import { NextRequest, NextResponse } from 'next/server'
import { queryOne } from '@/lib/mysql/connection'
import { usernameCheckSchema } from '@/lib/validations/registration'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 입력값 검증
    const validation = usernameCheckSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({
        available: false,
        message: validation.error.issues[0].message
      }, { status: 400 })
    }

    const { username } = validation.data

    // 금지된 사용자명 확인
    const forbiddenUsernames = [
      'admin', 'administrator', 'root', 'api', 'www', 'mail', 'ftp',
      'test', 'guest', 'user', 'null', 'undefined', 'system', 'support'
    ]
    
    if (forbiddenUsernames.includes(username.toLowerCase())) {
      return NextResponse.json({
        available: false,
        message: '사용할 수 없는 사용자명입니다'
      })
    }

    // DB에서 중복 확인
    const existingUser = await queryOne(
      'SELECT id FROM users WHERE username = ?',
      [username]
    )

    if (existingUser) {
      return NextResponse.json({
        available: false,
        message: '이미 사용 중인 사용자명입니다'
      })
    }

    return NextResponse.json({
      available: true,
      message: '사용 가능한 사용자명입니다'
    })

  } catch (error) {
    console.error('Username check error:', error)
    return NextResponse.json({
      available: false,
      message: '중복 확인 중 오류가 발생했습니다'
    }, { status: 500 })
  }
}