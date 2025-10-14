// src/app/api/auth/send-email-verification/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { query, queryOne } from '@/lib/mysql/connection'
import { sendVerificationEmail } from '@/lib/email/brevo'

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const clientIp = request.headers.get('x-client-ip')

  if (forwarded) return forwarded.split(',')[0].trim()
  if (realIp) return realIp.trim()
  if (clientIp) return clientIp.trim()
  return '127.0.0.1'
}

export async function POST(request: NextRequest) {
  try {
    const { email, skipDuplicateCheck } = await request.json()
    const clientIp = getClientIp(request)

    if (!email) {
      return NextResponse.json({
        success: false,
        error: '이메일을 입력해주세요'
      }, { status: 400 })
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        error: '올바른 이메일 형식이 아닙니다'
      }, { status: 400 })
    }

    // 이메일 중복 확인 (비밀번호 변경 시에는 건너뜀)
    if (!skipDuplicateCheck) {
      const existingUser = await queryOne(
        'SELECT id FROM users WHERE email = ?',
        [email]
      )

      if (existingUser) {
        return NextResponse.json({
          success: false,
          error: '이미 사용 중인 이메일입니다'
        }, { status: 409 })
      }
    }

    // 인증 시도 제한 확인 (5분 내 5회 이상 요청 차단)
    const recentAttempts = await queryOne(
      `SELECT attempt_count, blocked_until 
       FROM email_verification_limits 
       WHERE email = ? AND ip_address = ?`,
      [email, clientIp]
    )

    if (recentAttempts) {
      if (recentAttempts.blocked_until && new Date(recentAttempts.blocked_until) > new Date()) {
        const blockedMinutes = Math.ceil((new Date(recentAttempts.blocked_until).getTime() - Date.now()) / 60000)
        return NextResponse.json({
          success: false,
          error: `너무 많은 요청이 발생했습니다. ${blockedMinutes}분 후에 다시 시도해주세요`
        }, { status: 429 })
      }

      if (recentAttempts.attempt_count >= 5) {
        await query(
          `UPDATE email_verification_limits 
           SET attempt_count = attempt_count + 1, 
               blocked_until = DATE_ADD(NOW(), INTERVAL 30 MINUTE), 
               last_attempt_at = NOW() 
           WHERE email = ? AND ip_address = ?`,
          [email, clientIp]
        )

        return NextResponse.json({
          success: false,
          error: '너무 많은 요청이 발생했습니다. 30분 후에 다시 시도해주세요'
        }, { status: 429 })
      }
    }

    // 기존 미인증 코드 삭제
    await query(
      'DELETE FROM email_verifications WHERE email = ? AND is_verified = 0',
      [email]
    )

    // 인증번호 생성
    const code = generateVerificationCode()
    const verificationId = uuidv4()

    // DB에 인증 정보 저장 (MySQL의 DATE_ADD 사용)
    await query(
      `INSERT INTO email_verifications (id, email, code, expires_at, ip_address, created_at)
       VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 5 MINUTE), ?, NOW())`,
      [verificationId, email, code, clientIp]
    )

    // 이메일 발송
    const emailResult = await sendVerificationEmail(email, code)

    if (!emailResult.success) {
      // 이메일 발송 실패 시 DB 레코드 삭제
      await query('DELETE FROM email_verifications WHERE id = ?', [verificationId])
      
      return NextResponse.json({
        success: false,
        error: emailResult.error || '이메일 전송에 실패했습니다'
      }, { status: 500 })
    }

    // 인증 시도 횟수 업데이트
    if (recentAttempts) {
      await query(
        `UPDATE email_verification_limits 
         SET attempt_count = attempt_count + 1, 
             last_attempt_at = NOW() 
         WHERE email = ? AND ip_address = ?`,
        [email, clientIp]
      )
    } else {
      await query(
        `INSERT INTO email_verification_limits (id, email, ip_address, attempt_count, created_at)
         VALUES (?, ?, ?, 1, NOW())`,
        [uuidv4(), email, clientIp]
      )
    }

    return NextResponse.json({
      success: true,
      message: '인증번호가 이메일로 전송되었습니다',
      expiresIn: 300 // 5분 (초 단위)
    })

  } catch (error) {
    console.error('Send email verification error:', error)
    return NextResponse.json({
      success: false,
      error: '인증번호 전송 중 오류가 발생했습니다'
    }, { status: 500 })
  }
}