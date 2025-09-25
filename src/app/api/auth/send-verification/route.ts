// app/api/auth/send-verification/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { query, queryOne } from '@/lib/mysql/connection'

// SOLAPI 설정
const SOLAPI_CONFIG = {
  apiKey: process.env.SOLAPI_API_KEY!,
  apiSecret: process.env.SOLAPI_API_SECRET!,
  baseUrl: 'https://api.solapi.com',
  fromNumber: process.env.SOLAPI_FROM_NUMBER || '01000000000'
}

// 요청 스키마
const sendVerificationSchema = z.object({
  phone: z.string()
    .min(11, '전화번호를 올바르게 입력해주세요')
    .regex(/^01[0-9]{9}$/, '올바른 전화번호 형식이 아닙니다')
})

// 제한 설정
const RATE_LIMITS = {
  // IP별 제한 (1시간당 10회)
  IP_HOURLY_LIMIT: 10,
  IP_BLOCK_HOURS: 1,
  
  // 전화번호별 제한 (1일당 5회)
  PHONE_DAILY_LIMIT: 5,
  PHONE_BLOCK_HOURS: 24,
  
  // 연속 요청 방지 (3분)
  COOLDOWN_MINUTES: 3
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone } = sendVerificationSchema.parse(body)
    
    const clientIp = getClientIp(request)
    const userAgent = request.headers.get('user-agent') || 'Unknown'

    // 1. 기존 사용자 확인 (이미 가입된 전화번호)
    const existingUser = await queryOne(
      'SELECT id, signup_method FROM users WHERE phone = ?',
      [phone]
    )

    if (existingUser) {
      return NextResponse.json(
        { 
          error: '이미 가입된 전화번호입니다.',
          existingUser: true,
          signupMethod: existingUser.signup_method
        },
        { status: 409 }
      )
    }

    // 2. 요청 제한 확인
    const rateLimitCheck = await checkRateLimit(clientIp, phone)
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { error: rateLimitCheck.message },
        { status: 429 }
      )
    }

    // 3. 쿨다운 확인
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

    // 4. 인증 코드 생성 및 발송
    const verificationCode = generateVerificationCode()
    
    // SOLAPI로 SMS 발송
    const smsResult = await sendSMS(phone, verificationCode)
    if (!smsResult.success) {
      return NextResponse.json(
        { error: '인증번호 발송에 실패했습니다. 잠시 후 다시 시도해주세요.' },
        { status: 500 }
      )
    }

    // 5. 데이터베이스에 인증 정보 저장
    await saveVerificationCode(phone, verificationCode, clientIp, userAgent)

    // 6. 요청 제한 카운터 업데이트
    await updateRateLimitCounters(clientIp, phone)

    return NextResponse.json({
      success: true,
      message: '인증번호가 발송되었습니다.',
      expiresIn: 300 // 5분
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Send verification error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 클라이언트 IP 추출
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const clientIp = request.headers.get('x-client-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIp) {
    return realIp.trim()
  }
  if (clientIp) {
    return clientIp.trim()
  }
  
  return '127.0.0.1'
}

// 요청 제한 확인
async function checkRateLimit(
  clientIp: string, 
  phone: string
): Promise<{ allowed: boolean; message?: string }> {
  const now = new Date()
  
  // IP별 제한 확인
  const ipLimit = await queryOne(
    `SELECT * FROM verification_limits 
     WHERE identifier = ? AND type = 'ip' AND blocked_until > ?`,
    [clientIp, now.toISOString().slice(0, 19).replace('T', ' ')]
  )

  if (ipLimit) {
    return {
      allowed: false,
      message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.'
    }
  }

  // 전화번호별 제한 확인
  const phoneLimit = await queryOne(
    `SELECT * FROM verification_limits 
     WHERE identifier = ? AND type = 'phone' AND blocked_until > ?`,
    [phone, now.toISOString().slice(0, 19).replace('T', ' ')]
  )

  if (phoneLimit) {
    return {
      allowed: false,
      message: '해당 전화번호로 너무 많은 인증 요청이 있었습니다. 내일 다시 시도해주세요.'
    }
  }

  // 시간당/일간 제한 확인
  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000)
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  const ipCount = await queryOne(
    `SELECT COUNT(*) as count FROM phone_verifications 
     WHERE ip_address = ? AND created_at > ?`,
    [clientIp, hourAgo.toISOString().slice(0, 19).replace('T', ' ')]
  )

  if (ipCount && ipCount.count >= RATE_LIMITS.IP_HOURLY_LIMIT) {
    // IP 차단
    await query(
      `INSERT INTO verification_limits (identifier, type, attempt_count, blocked_until)
       VALUES (?, 'ip', ?, ?) 
       ON DUPLICATE KEY UPDATE 
       attempt_count = attempt_count + 1, 
       blocked_until = VALUES(blocked_until)`,
      [
        clientIp,
        RATE_LIMITS.IP_HOURLY_LIMIT,
        new Date(now.getTime() + RATE_LIMITS.IP_BLOCK_HOURS * 60 * 60 * 1000)
          .toISOString().slice(0, 19).replace('T', ' ')
      ]
    )

    return {
      allowed: false,
      message: '너무 많은 요청이 발생했습니다. 1시간 후 다시 시도해주세요.'
    }
  }

  const phoneCount = await queryOne(
    `SELECT COUNT(*) as count FROM phone_verifications 
     WHERE phone = ? AND created_at > ?`,
    [phone, dayAgo.toISOString().slice(0, 19).replace('T', ' ')]
  )

  if (phoneCount && phoneCount.count >= RATE_LIMITS.PHONE_DAILY_LIMIT) {
    // 전화번호 차단
    await query(
      `INSERT INTO verification_limits (identifier, type, attempt_count, blocked_until)
       VALUES (?, 'phone', ?, ?) 
       ON DUPLICATE KEY UPDATE 
       attempt_count = attempt_count + 1, 
       blocked_until = VALUES(blocked_until)`,
      [
        phone,
        RATE_LIMITS.PHONE_DAILY_LIMIT,
        new Date(now.getTime() + RATE_LIMITS.PHONE_BLOCK_HOURS * 60 * 60 * 1000)
          .toISOString().slice(0, 19).replace('T', ' ')
      ]
    )

    return {
      allowed: false,
      message: '해당 전화번호로 하루 인증 제한을 초과했습니다. 내일 다시 시도해주세요.'
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

// SOLAPI SMS 발송
async function sendSMS(phone: string, code: string): Promise<{ success: boolean; messageId?: string }> {
  try {
    if (!SOLAPI_CONFIG.apiKey || !SOLAPI_CONFIG.apiSecret) {
      console.error('SOLAPI credentials not configured')
      return { success: false }
    }

    const message = `[모두하나대축제 2025] 인증번호는 ${code}입니다. 5분 내에 입력해주세요.`
    
    const timestamp = Date.now().toString()
    const salt = generateSalt()
    const signature = generateSignature(timestamp, salt)

    const requestBody = {
      message: {
        to: phone,
        from: SOLAPI_CONFIG.fromNumber,
        text: message
      }
    }

    const response = await fetch(`${SOLAPI_CONFIG.baseUrl}/messages/v4/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `HMAC-SHA256 ApiKey=${SOLAPI_CONFIG.apiKey}, Date=${timestamp}, salt=${salt}, signature=${signature}`
      },
      body: JSON.stringify(requestBody)
    })

    if (response.ok) {
      const data = await response.json()
      return { 
        success: true, 
        messageId: data.messageId 
      }
    } else {
      console.error('SOLAPI SMS send failed:', response.status, await response.text())
      return { success: false }
    }

  } catch (error) {
    console.error('SMS send error:', error)
    return { success: false }
  }
}

// SOLAPI 서명 생성
function generateSalt(): string {
  return Math.random().toString(36).substring(2, 15)
}

function generateSignature(timestamp: string, salt: string): string {
  const crypto = require('crypto')
  const data = timestamp + salt
  return crypto
    .createHmac('sha256', SOLAPI_CONFIG.apiSecret)
    .update(data)
    .digest('hex')
}

// 인증 코드 저장
async function saveVerificationCode(
  phone: string, 
  code: string, 
  clientIp: string, 
  userAgent: string
): Promise<void> {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5분 후

  // 기존 미인증 코드 삭제
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
}