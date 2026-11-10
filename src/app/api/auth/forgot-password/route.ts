import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { query, queryOne } from '@/lib/mysql/connection'
import { getClientIp } from '@/lib/api/request-utils'
import { checkTableExists } from '@/lib/api/database-utils'
import { handleCorsOptions } from '@/lib/api/cors-handler'

// 개발/테스트 설정
const DEV_MODE = process.env.NODE_ENV === 'development' || process.env.ENABLE_SMS_BYPASS === 'true'
const DEV_VERIFICATION_CODE = '123456' // 개발용 고정 인증번호

// 요청 스키마
const forgotPasswordSchema = z.object({
  phone: z.string()
    .min(11, '전화번호를 올바르게 입력해주세요')
    .regex(/^01[0-9]{9}$/, '올바른 전화번호 형식이 아닙니다')
})

// 제한 설정
const RATE_LIMITS = {
  // IP별 제한 (1시간당 5회)
  IP_HOURLY_LIMIT: 5,
  IP_BLOCK_HOURS: 1,
  
  // 전화번호별 제한 (1일당 3회)
  PHONE_DAILY_LIMIT: 3,
  PHONE_BLOCK_HOURS: 24,
  
  // 연속 요청 방지 (5분)
  COOLDOWN_MINUTES: 5
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone } = forgotPasswordSchema.parse(body)
    
    const clientIp = getClientIp(request)
    const userAgent = request.headers.get('user-agent') || 'Unknown'

    // 1. 사용자 존재 및 가입 방법 확인
    const user = await queryOne(
      'SELECT id, name, signup_method FROM users WHERE phone = ?',
      [phone]
    )

    if (!user) {
      return NextResponse.json(
        { error: '해당 전화번호로 가입된 계정이 없습니다.' },
        { status: 404 }
      )
    }

    // 2. 전화번호 가입 계정인지 확인
    if (user.signup_method !== 'phone') {
      const methodNames = {
        naver: '네이버',
        kakao: '카카오'
      }
      const providerName = methodNames[user.signup_method] || 'SNS'
      
      return NextResponse.json(
        { 
          error: `${providerName}로 가입한 계정입니다. ${providerName} 로그인을 이용해주세요.`,
          socialAccount: true,
          provider: user.signup_method
        },
        { status: 400 }
      )
    }

    // 3. 요청 제한 확인 (개발 모드에서는 더 관대하게)
    if (!DEV_MODE) {
      const rateLimitCheck = await checkRateLimit(clientIp, phone)
      if (!rateLimitCheck.allowed) {
        return NextResponse.json(
          { error: rateLimitCheck.message },
          { status: 429 }
        )
      }

      // 4. 쿨다운 확인
      const cooldownCheck = await checkCooldown(phone)
      if (!cooldownCheck.allowed) {
        return NextResponse.json(
          { 
            error: `잠시 후 다시 시도해주세요. (${cooldownCheck.remainingSeconds}초 후 가능)`,
            remainingSeconds: cooldownCheck.remainingSeconds
          },
          { status: 429 }
        )
      }
    }

    // 5. 인증 코드 생성
    const verificationCode = DEV_MODE ? DEV_VERIFICATION_CODE : generateVerificationCode()
    
    // 6. SMS 발송 (테스트 모드 - 실제 SMS 발송하지 않음)
    let smsResult: { success: boolean; requestId?: string; error?: string }
    
    smsResult = {
      success: true,
      requestId: `test-forgot-${Date.now()}`
    }

    /* 실제 SMS 발송 코드 (운영 시 주석 해제)
    if (!DEV_MODE) {
      try {
        const smsMessage = `[모두하나대축제 2025] 비밀번호 찾기 인증번호는 ${verificationCode}입니다. 5분 내에 입력해주세요.`
        const actualSmsResult = await sendVerificationSms(phone, verificationCode, smsMessage)

        if (!actualSmsResult.success) {
          console.error('SENS SMS send failed:', actualSmsResult.error)
          return NextResponse.json(
            { error: actualSmsResult.error || '인증번호 발송에 실패했습니다. 잠시 후 다시 시도해주세요.' },
            { status: 500 }
          )
        }

        smsResult = actualSmsResult
      } catch (error) {
        console.error('SMS send error:', error)
        return NextResponse.json(
          { error: '인증번호 발송 중 오류가 발생했습니다.' },
          { status: 500 }
        )
      }
    }
    */

    if (!smsResult.success) {
      return NextResponse.json(
        { error: smsResult.error || '인증번호 발송에 실패했습니다.' },
        { status: 500 }
      )
    }

    // 7. 데이터베이스에 인증 정보 저장
    await savePasswordResetCode(phone, verificationCode, clientIp, userAgent)

    // 8. 요청 제한 카운터 업데이트 (개발 모드가 아닐 때만)
    if (!DEV_MODE) {
      await updateRateLimitCounters(clientIp, phone)
    }

    if (DEV_MODE) {
      console.log('[DEV] 비밀번호 찾기 인증번호:', verificationCode)
    }

    return NextResponse.json({
      success: true,
      message: '인증번호가 발송되었습니다.',
      expiresIn: 300
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 요청 제한 확인
async function checkRateLimit(clientIp: string, phone: string): Promise<{ 
  allowed: boolean; 
  message?: string 
}> {
  const now = new Date()
  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000)
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  // IP별 시간당 제한 확인
  const ipCount = await queryOne(
    `SELECT COUNT(*) as count FROM phone_verifications 
     WHERE ip_address = ? AND created_at > ?`,
    [clientIp, hourAgo.toISOString().slice(0, 19).replace('T', ' ')]
  )

  if (ipCount && ipCount.count >= RATE_LIMITS.IP_HOURLY_LIMIT) {
    return {
      allowed: false,
      message: '너무 많은 요청이 발생했습니다. 1시간 후 다시 시도해주세요.'
    }
  }

  // 전화번호별 일일 제한 확인
  const phoneCount = await queryOne(
    `SELECT COUNT(*) as count FROM phone_verifications 
     WHERE phone = ? AND created_at > ?`,
    [phone, dayAgo.toISOString().slice(0, 19).replace('T', ' ')]
  )

  if (phoneCount && phoneCount.count >= RATE_LIMITS.PHONE_DAILY_LIMIT) {
    return {
      allowed: false,
      message: '해당 전화번호로 하루 요청 제한을 초과했습니다. 내일 다시 시도해주세요.'
    }
  }

  return { allowed: true }
}

// 쿨다운 확인
async function checkCooldown(phone: string): Promise<{ 
  allowed: boolean; 
  remainingSeconds?: number 
}> {
  const cooldownTime = new Date(Date.now() - RATE_LIMITS.COOLDOWN_MINUTES * 60 * 1000)
  
  const recentVerification = await queryOne(
    `SELECT created_at FROM phone_verifications 
     WHERE phone = ? AND created_at > ? 
     ORDER BY created_at DESC LIMIT 1`,
    [phone, cooldownTime.toISOString().slice(0, 19).replace('T', ' ')]
  )

  if (recentVerification) {
    const lastRequestTime = new Date(recentVerification.created_at)
    const nextAllowedTime = new Date(lastRequestTime.getTime() + RATE_LIMITS.COOLDOWN_MINUTES * 60 * 1000)
    const remainingSeconds = Math.ceil((nextAllowedTime.getTime() - Date.now()) / 1000)

    return {
      allowed: false,
      remainingSeconds: Math.max(0, remainingSeconds)
    }
  }

  return { allowed: true }
}

// 인증 코드 생성
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// 비밀번호 재설정 인증 코드 저장
async function savePasswordResetCode(
  phone: string, 
  code: string, 
  clientIp: string, 
  userAgent: string
): Promise<void> {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5분 후

  // 기존 미인증 코드 삭제 (비밀번호 찾기용)
  await query(
    'DELETE FROM phone_verifications WHERE phone = ? AND verified = 0',
    [phone]
  )

  // 새 인증 코드 저장
  await query(
    `INSERT INTO phone_verifications (phone, code, ip_address, user_agent, expires_at)
     VALUES (?, ?, ?, ?, ?)`,
    [
      phone,
      code,
      clientIp,
      userAgent,
      expiresAt.toISOString().slice(0, 19).replace('T', ' ')
    ]
  )
}

// 요청 제한 카운터 업데이트
async function updateRateLimitCounters(clientIp: string, phone: string): Promise<void> {
  try {
    // verification_limits 테이블이 있는지 확인
    const tableExists = await checkTableExists('verification_limits')
    if (!tableExists) {
      return
    }

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')

    // IP 카운터 업데이트
    await query(
      `INSERT INTO verification_limits (identifier, type, attempt_count, last_attempt_at)
       VALUES (?, 'ip', 1, ?) 
       ON DUPLICATE KEY UPDATE 
       attempt_count = attempt_count + 1, 
       last_attempt_at = VALUES(last_attempt_at)`,
      [clientIp, now]
    )

    // 전화번호 카운터 업데이트
    await query(
      `INSERT INTO verification_limits (identifier, type, attempt_count, last_attempt_at)
       VALUES (?, 'phone', 1, ?) 
       ON DUPLICATE KEY UPDATE 
       attempt_count = attempt_count + 1, 
       last_attempt_at = VALUES(last_attempt_at)`,
      [phone, now]
    )
  } catch (error) {
    console.warn('Rate limit counter update failed:', error)
  }
}

export async function OPTIONS() {
  return handleCorsOptions()
}