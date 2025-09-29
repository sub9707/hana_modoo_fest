import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getCurrentUserAction } from '@/lib/actions/auth'
import { query } from '@/lib/mysql/connection';

// 캐시를 위한 간단한 메모리 저장소
const userCache = new Map<string, { user: any; timestamp: number }>()
const CACHE_DURATION = 3 * 1000

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session-token')?.value

    // 세션 토큰이 없으면 즉시 401 반환 (빠른 응답)
    if (!sessionToken) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        {
          status: 401,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          }
        }
      )
    }

    const tokenExists = await query(
      'SELECT 1 FROM users WHERE session_token = ? AND session_expires_at > NOW()',
      [sessionToken]
    )

    if (!tokenExists || tokenExists.length === 0) {
      userCache.delete(sessionToken) // 캐시 무효화

      cookieStore.set('session-token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(0),
        path: '/'
      })

      return NextResponse.json(
        { error: '세션이 무효화되었습니다.' },
        { status: 401, headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' } }
      )
    }

    // 캐시 확인 (같은 세션 토큰에 대한 최근 요청)
    const cached = userCache.get(sessionToken)
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log('[me] Cache HIT')
      return NextResponse.json(
        { user: cached.user },
        {
          headers: {
            'Cache-Control': 'private, max-age=180',
            'X-Cache': 'HIT'
          }
        }
      )
    }

    // 데이터베이스에서 사용자 정보 조회
    const result = await getCurrentUserAction()

    if (result.error) {

      console.warn('[me] Auth error:', result.error)

      // ⚠️ 캐시에서 제거
      userCache.delete(sessionToken)

      if (result.error.includes('무효화') || result.error.includes('만료')) {
        cookieStore.set('session-token', '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          expires: new Date(0),
          path: '/'
        })
      }

      return NextResponse.json(
        { error: result.error },
        {
          status: 401,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        }
      )
    }

    // 성공 시 캐시에 저장
    userCache.set(sessionToken, {
      user: result.user,
      timestamp: Date.now()
    })

    // 캐시 크기 제한 (메모리 누수 방지)
    if (userCache.size > 100) { 
      const oldestKey = userCache.keys().next().value
      if (typeof oldestKey === 'string') {
        userCache.delete(oldestKey)
      }
    }

    return NextResponse.json(
      { user: result.user },
      {
        headers: {
          'Cache-Control': 'private, max-age=180',
          'X-Cache': 'MISS'
        }
      }
    )

  } catch (error) {
    console.error('Auth me API error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      }
    )
  }
}

// 캐시 정리를 위한 주기적 작업
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, value] of userCache.entries()) {
      if (now - value.timestamp > CACHE_DURATION * 2) { 
        userCache.delete(key)
      }
    }
  }, CACHE_DURATION)
}