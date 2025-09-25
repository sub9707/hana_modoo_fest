// src/app/api/auth/verify-code/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { query, queryOne } from '@/lib/mysql/connection'

// 요청 스키마
const verifyCodeSchema = z.object({
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
    const { phone, code } = verifyCodeSchema.parse(body)
    
    const clientIp = getClientIp(request)
    const now = new Date()

    // 1. 기존 사용자 확인
    const existingUser = await queryOne(
      'SELECT id FROM users WHERE phone = ?',
      [phone]
    )

    if (existingUser) {
      return NextResponse.json(
        { error: '이미 가입된 전화번호입니다.' },
        { status: 409 }
      )
    }

    // 2. 인증 코드 조회
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

    // 3. 만료 시간 확인
    const expiresAt = new Date(verification.expires_at)
    if (now > expiresAt) {
      return NextResponse.json(
        { error: '인증번호가 만료되었습니다. 새로 요청해주세요.' },
        { status: 400 }
      )
    }

    // 4. 시도 횟수 확인
    if (verification.attempt_count >= VERIFICATION_LIMITS.MAX_ATTEMPTS) {
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

    // 5. 인증 코드 확인
    if (verification.code !== code) {
      // 시도 횟수 증가
      const newAttemptCount = verification.attempt_count + 1
      await query(
        'UPDATE phone_verifications SET attempt_count = ? WHERE id = ?',
        [newAttemptCount, verification.id]
      )

      const remainingAttempts = VERIFICATION_LIMITS.MAX_ATTEMPTS - newAttemptCount

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

    // 6. 인증 성공 - 상태 업데이트
    await query(
      'UPDATE phone_verifications SET verified = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [verification.id]
    )

    // 7. 만료된 인증 코드들 정리 (선택사항)
    await cleanupExpiredVerifications()

    return NextResponse.json({
      success: true,
      message: '전화번호 인증이 완료되었습니다.',
      phone: phone
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Verify code error:', error)
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

// 만료된 인증 코드 정리
async function cleanupExpiredVerifications(): Promise<void> {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    await query(
      'DELETE FROM phone_verifications WHERE expires_at < ?',
      [oneDayAgo.toISOString().slice(0, 19).replace('T', ' ')]
    )

    // 오래된 제한 기록도 정리
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    
    await query(
      `DELETE FROM verification_limits 
       WHERE (blocked_until IS NULL OR blocked_until < ?) 
       AND last_attempt_at < ?`,
      [
        new Date().toISOString().slice(0, 19).replace('T', ' '),
        oneWeekAgo.toISOString().slice(0, 19).replace('T', ' ')
      ]
    )

  } catch (error) {
    console.error('Cleanup error:', error)
    // 정리 실패는 치명적이지 않으므로 무시
  }
}