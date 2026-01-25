import { NextRequest, NextResponse } from 'next/server'
import { queryOne } from '@/lib/mysql/connection'

export async function POST(request: NextRequest) {
  try {
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

    // DB에서 이메일 중복 확인
    const existingUser = await queryOne(
      'SELECT id FROM users WHERE email = ?',
      [email]
    )

    if (existingUser) {
      return NextResponse.json({
        success: false,
        available: false,
        message: '이미 사용 중인 이메일입니다'
      })
    }

    return NextResponse.json({
      success: true,
      available: true,
      message: '사용 가능한 이메일입니다'
    })

  } catch (error) {
    console.error('Email check error:', error)
    return NextResponse.json({
      success: false,
      error: '이메일 확인 중 오류가 발생했습니다'
    }, { status: 500 })
  }
}