// src/app/api/auth/verify-email-code/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/mysql/connection'

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({
        success: false,
        error: '이메일과 인증번호를 모두 입력해주세요'
      }, { status: 400 })
    }

    // 인증번호 조회 (만료되지 않은 것만)
    const verification = await queryOne(
      `SELECT * FROM email_verifications 
       WHERE email = ? 
       AND code = ? 
       AND is_verified = 0 
       AND expires_at > NOW()
       ORDER BY created_at DESC 
       LIMIT 1`,
      [email, code]
    )

    if (!verification) {
      // 만료된 인증번호가 있는지 확인
      const expiredVerification = await queryOne(
        `SELECT * FROM email_verifications 
         WHERE email = ? 
         AND code = ? 
         AND is_verified = 0
         ORDER BY created_at DESC 
         LIMIT 1`,
        [email, code]
      )

      if (expiredVerification) {
        return NextResponse.json({
          success: false,
          error: '인증번호가 만료되었습니다. 다시 요청해주세요'
        }, { status: 400 })
      }

      return NextResponse.json({
        success: false,
        error: '인증번호가 일치하지 않습니다'
      }, { status: 400 })
    }

    // 인증번호 확인 및 is_verified를 1로 업데이트, verified_at 설정
    await query(
      `UPDATE email_verifications 
       SET is_verified = 1, verified_at = NOW()
       WHERE id = ?`,
      [verification.id]
    )

    return NextResponse.json({
      success: true,
      message: '인증번호가 확인되었습니다'
    })

  } catch (error) {
    console.error('Verify email code error:', error)
    return NextResponse.json({
      success: false,
      error: '인증번호 확인 중 오류가 발생했습니다'
    }, { status: 500 })
  }
}