import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { randomBytes } from 'crypto'
import { query, queryOne } from '@/lib/mysql/connection'
import { getClientIp } from '@/lib/api/request-utils'
import { handleCorsOptions } from '@/lib/api/cors-handler'

// 개발/테스트 설정
const DEV_MODE = process.env.NODE_ENV === 'development' || process.env.ENABLE_SMS_BYPASS === 'true'
const DEV_VERIFICATION_CODE = '123456' // 개발용 고정 인증번호
const ADMIN_BYPASS_CODE = '000000' // 관리자용 만능 인증번호

// 요청 스키마
const verifyResetCodeSchema = z.object({
  phone: z.string()
    .min(11, '전화번호를 올바르게 입력해주세요')
    .regex(/^01[0-9]{9}$/, '올바른 전화번호 형식이 아닙니다'),
  code: z.string()
    .length(6, '인증번호는 6자리입니다')
    .regex(/^\d{6}$/, '숫자만 입력해주세요')
})

// 제한 설정
const VERIFICATION_LIMITS = {
  MAX_ATTEMPTS: 5, // 최대 시도 횟수
  BLOCK_DURATION_MINUTES: 30, // 차단 시간 (분)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, code } = verifyResetCodeSchema.parse(body)
    
    const clientIp = getClientIp(request)
    const now = new Date()

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

    // 3. 개발 모드: 특정 인증번호로 바로 통과
    if (DEV_MODE && (code === DEV_VERIFICATION_CODE || code === ADMIN_BYPASS_CODE)) {
      console.log('[DEV] 비밀번호 찾기 인증 성공 - 전화번호:', phone, '사용자:', user.name)

      const resetToken = generateResetToken()
      await saveDummyVerificationRecord(phone, code, clientIp, resetToken)

      return NextResponse.json({
        success: true,
        message: '인증이 완료되었습니다.',
        token: resetToken,
        phone: phone
      })
    }

    // 4. 실제 모드: 정상적인 인증 로직
    // 인증 코드 조회
    const verification = await queryOne(
      `SELECT id, code, attempt_count, expires_at, verified 
       FROM phone_verifications 
       WHERE phone = ? AND verified = 0
       ORDER BY created_at DESC 
       LIMIT 1`,
      [phone]
    )

    if (!verification) {
      return NextResponse.json(
        { error: '인증번호를 먼저 요청해주세요.' },
        { status: 400 }
      )
    }

    // 5. 만료 시간 확인
    const expiresAt = new Date(verification.expires_at)
    if (now > expiresAt) {
      return NextResponse.json(
        { error: '인증번호가 만료되었습니다. 새로 요청해주세요.' },
        { status: 400 }
      )
    }

    // 6. 시도 횟수 확인 (개발 모드에서는 더 관대하게)
    const maxAttempts = DEV_MODE ? 10 : VERIFICATION_LIMITS.MAX_ATTEMPTS
    
    if (verification.attempt_count >= maxAttempts) {
      // 차단 시간 확인
      const blockUntil = new Date(
        new Date(verification.updated_at).getTime() + 
        VERIFICATION_LIMITS.BLOCK_DURATION_MINUTES * 60 * 1000
      )

      if (now < blockUntil) {
        const remainingMinutes = Math.ceil((blockUntil.getTime() - now.getTime()) / (1000 * 60))
        return NextResponse.json(
          { 
            error: `너무 많은 시도로 인해 차단되었습니다. ${remainingMinutes}분 후 다시 시도해주세요.`,
            blockedUntil: blockUntil.toISOString(),
            remainingMinutes
          },
          { status: 429 }
        )
      } else {
        // 차단 시간이 지났으면 시도 횟수 초기화
        await query(
          'UPDATE phone_verifications SET attempt_count = 0 WHERE id = ?',
          [verification.id]
        )
        verification.attempt_count = 0
      }
    }

    // 7. 인증 코드 확인
    if (verification.code !== code) {
      // 시도 횟수 증가
      const newAttemptCount = verification.attempt_count + 1
      await query(
        'UPDATE phone_verifications SET attempt_count = ? WHERE id = ?',
        [newAttemptCount, verification.id]
      )

      const remainingAttempts = maxAttempts - newAttemptCount

      if (remainingAttempts <= 0) {
        return NextResponse.json(
          { 
            error: `인증번호가 올바르지 않습니다. 너무 많은 시도로 인해 ${VERIFICATION_LIMITS.BLOCK_DURATION_MINUTES}분간 차단됩니다.`,
            blocked: true,
            blockDurationMinutes: VERIFICATION_LIMITS.BLOCK_DURATION_MINUTES
          },
          { status: 429 }
        )
      }

      return NextResponse.json(
        {
          error: `인증번호가 올바르지 않습니다. (${remainingAttempts}회 남음)`,
          remainingAttempts
        },
        { status: 400 }
      )
    }

    // 8. 인증 성공 - 상태 업데이트 및 재설정 토큰 생성
    const resetToken = generateResetToken()
    
    await query(
      'UPDATE phone_verifications SET verified = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [verification.id]
    )

    return NextResponse.json({
      success: true,
      message: '인증이 완료되었습니다.',
      token: resetToken,
      phone: phone
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Verify reset code error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 재설정 토큰 생성
function generateResetToken(): string {
  return randomBytes(32).toString('hex')
}

async function saveDummyVerificationRecord(
  phone: string,
  code: string,
  clientIp: string,
  _resetToken: string
): Promise<void> {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

  await query(
    'DELETE FROM phone_verifications WHERE phone = ? AND verified = 0',
    [phone]
  )

  await query(
    `INSERT INTO phone_verifications (phone, code, ip_address, user_agent, expires_at, verified, created_at, updated_at)
     VALUES (?, ?, ?, 'DEV_MODE_PASSWORD_RESET', ?, 1, NOW(), NOW())`,
    [
      phone,
      code,
      clientIp,
      expiresAt.toISOString().slice(0, 19).replace('T', ' ')
    ]
  )
}

export async function OPTIONS() {
  return handleCorsOptions()
}