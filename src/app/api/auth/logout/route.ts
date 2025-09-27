import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { query } from '@/lib/mysql/connection'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session-token')?.value

    if (sessionToken) {
      // DB에서 세션 토큰 제거
      await query(
        'UPDATE users SET session_token = NULL, session_expires_at = NULL WHERE session_token = ?',
        [sessionToken]
      )
    }

    // 쿠키 삭제
    cookieStore.set('session-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(0),
      path: '/'
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}