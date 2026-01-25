import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/mysql/connection'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session-token')?.value

    if (!sessionToken) {
      return NextResponse.json({
        success: false,
        error: '로그인이 필요합니다'
      }, { status: 401 })
    }

    // 세션 확인
    const user = await queryOne(
      `SELECT id, email, signup_method FROM users 
       WHERE session_token = ? AND session_expires_at > NOW()`,
      [sessionToken]
    )

    if (!user) {
      return NextResponse.json({
        success: false,
        error: '유효하지 않은 세션입니다'
      }, { status: 401 })
    }

    // 소셜 가입자는 이메일 등록 불가
    if (user.signup_method !== 'phone') {
      return NextResponse.json({
        success: false,
        error: 'SNS 가입자는 이메일 등록이 불가능합니다'
      }, { status: 400 })
    }

    // 이미 이메일이 있는 경우
    if (user.email) {
      return NextResponse.json({
        success: false,
        error: '이미 이메일이 등록되어 있습니다'
      }, { status: 400 })
    }

    const { email } = await request.json()

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

    // 이메일 중복 확인
    const existingEmail = await queryOne(
      'SELECT id FROM users WHERE email = ?',
      [email]
    )

    if (existingEmail) {
      return NextResponse.json({
        success: false,
        error: '이미 사용 중인 이메일입니다'
      }, { status: 409 })
    }

    // 이메일 인증 확인
    const emailVerification = await queryOne(
      `SELECT * FROM email_verifications 
       WHERE email = ? AND is_verified = 1 
       ORDER BY verified_at DESC LIMIT 1`,
      [email]
    )

    if (!emailVerification) {
      return NextResponse.json({
        success: false,
        error: '이메일 인증이 완료되지 않았습니다'
      }, { status: 400 })
    }

    // 인증이 최근 10분 이내인지 확인
    const verifiedAt = new Date(emailVerification.verified_at)
    const now = new Date()
    const diffMinutes = (now.getTime() - verifiedAt.getTime()) / 60000

    if (diffMinutes > 10) {
      return NextResponse.json({
        success: false,
        error: '이메일 인증이 만료되었습니다. 다시 인증해주세요'
      }, { status: 400 })
    }

    // 이메일 등록
    await query(
      'UPDATE users SET email = ?, updated_at = NOW() WHERE id = ?',
      [email, user.id]
    )

    return NextResponse.json({
      success: true,
      message: '이메일이 성공적으로 등록되었습니다'
    })

  } catch (error) {
    console.error('Register email error:', error)
    return NextResponse.json({
      success: false,
      error: '이메일 등록 중 오류가 발생했습니다'
    }, { status: 500 })
  }
}