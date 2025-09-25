// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { queryOne } from '@/lib/mysql/connection'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session-token')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'No session token found' },
        { status: 401 }
      )
    }

    // 사용자 정보 조회
    const user = await queryOne(
      `SELECT id, name, username, gender, birth_date, phone, role, 
              created_at, last_login_at, last_activity_at, session_expires_at
       FROM users 
       WHERE session_token = ?`,
      [sessionToken]
    )

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // 세션 만료 확인
    if (user.session_expires_at && new Date(user.session_expires_at) < new Date()) {
      // 만료된 세션 정리
      await queryOne(
        'UPDATE users SET session_token = NULL, session_expires_at = NULL WHERE id = ?',
        [user.id]
      )
      
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      )
    }

    // 민감한 정보 제거
    const { session_expires_at, ...safeUser } = user

    // NextJS 15: 응답 헤더 개선
    return NextResponse.json(
      { user: safeUser },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        }
      }
    )

  } catch (error) {
    console.error('Get current user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// NextJS 15: OPTIONS 메서드 지원 추가 (CORS 대응)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_APP_URL || '',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  })
}