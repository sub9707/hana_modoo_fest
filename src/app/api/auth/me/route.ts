import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getCurrentUserAction } from '@/lib/actions/auth'

// 캐시를 위한 간단한 메모리 저장소 (프로덕션에서는 Redis 사용 권장)
const userCache = new Map<string, { user: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5분

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
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      )
    }

    // 캐시 확인 (같은 세션 토큰에 대한 최근 요청)
    const cached = userCache.get(sessionToken)
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      return NextResponse.json(
        { user: cached.user },
        {
          headers: {
            'Cache-Control': 'private, max-age=300', // 5분 캐시
            'X-Cache': 'HIT'
          }
        }
      )
    }

    // 데이터베이스에서 사용자 정보 조회
    const result = await getCurrentUserAction()

    if (result.error) {
      // 캐시에서 제거
      userCache.delete(sessionToken)
      
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
    if (userCache.size > 1000) {
      const oldestKey = userCache.keys().next().value
      if (typeof oldestKey === 'string') {
        userCache.delete(oldestKey)
      }
    }

    return NextResponse.json(
      { user: result.user },
      {
        headers: {
          'Cache-Control': 'private, max-age=300', // 5분 캐시
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

// 캐시 정리를 위한 주기적 작업 (선택사항)
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