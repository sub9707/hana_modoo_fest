import { NextRequest, NextResponse } from 'next/server'
import { queryOne } from '@/lib/mysql/connection'
import { phoneCheckSchema } from '@/lib/validations/registration'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 입력값 검증
    const validation = phoneCheckSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({
        available: false,
        message: validation.error.issues[0].message
      }, { status: 400 })
    }

    const { phone } = validation.data

    // DB에서 중복 확인
    const existingUser = await queryOne(
      'SELECT id, signup_method FROM users WHERE phone = ?',
      [phone]
    )

    if (existingUser) {
      const methodNames = {
        phone: '전화번호',
        naver: '네이버',
        kakao: '카카오'
      }
      const method = methodNames[existingUser.signup_method] || '다른 방법'
      
      return NextResponse.json({
        available: false,
        message: `이미 ${method}로 가입된 전화번호입니다`
      })
    }

    return NextResponse.json({
      available: true,
      message: '사용 가능한 전화번호입니다'
    })

  } catch (error) {
    console.error('Phone check error:', error)
    return NextResponse.json({
      available: false,
      message: '중복 확인 중 오류가 발생했습니다'
    }, { status: 500 })
  }
}