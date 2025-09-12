import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { Role } from './types/auth'

// 로그인이 필요한 경로들 (명시적으로 정의)
const protectedPaths = ['/dashboard', '/profile', '/settings', '/my-page']

// 관리자만 접근 가능한 경로들  
const adminPaths = ['/admin']

// 편집자 이상만 접근 가능한 경로들
const editorPaths = ['/editor', '/manage']

// 권한 기반 접근 제어
const roleHierarchy: Record<Role, number> = {
  'user': 1,
  'editor': 2,
  'admin': 3
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 정적 파일들은 미들웨어를 거치지 않음
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Supabase 클라이언트 생성
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // 세션 토큰 확인
  const sessionToken = request.cookies.get('session-token')?.value

  let user = null
  if (sessionToken) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, username, role, session_expires_at')
        .eq('session_token', sessionToken)
        .single()

      if (!error && data) {
        // 세션 만료 확인
        if (data.session_expires_at && new Date(data.session_expires_at) > new Date()) {
          user = data
        } else {
          // 만료된 세션 정리
          await supabase
            .from('users')
            .update({ session_token: null, session_expires_at: null })
            .eq('id', data.id)

          // 쿠키 삭제
          response.cookies.delete('session-token')
        }
      }
    } catch (error) {
      console.error('Middleware auth error:', error)
    }
  }

  // 로그인 페이지 접근 처리
  if (pathname === '/login') {
    if (user) {
      // 이미 로그인된 사용자는 홈으로 리다이렉트
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return response
  }

  // 권한 기반 접근 제어 먼저 체크
  // 관리자 전용 경로
  if (adminPaths.some(path => pathname.startsWith(path))) {
    if (!user || roleHierarchy[user.role as Role] < roleHierarchy['admin']) {
      return NextResponse.redirect(new URL(!user ? '/login' : '/unauthorized', request.url))
    }
  }

  // 편집자 이상 전용 경로  
  if (editorPaths.some(path => pathname.startsWith(path))) {
    if (!user || roleHierarchy[user.role as Role] < roleHierarchy['editor']) {
      return NextResponse.redirect(new URL(!user ? '/login' : '/unauthorized', request.url))
    }
  }

  // 로그인 필요한 경로 체크
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // 관리자 전용 경로
  if (adminPaths.some(path => pathname.startsWith(path))) {
    if (roleHierarchy[user!.role as Role] < roleHierarchy['admin']) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  // 편집자 이상 전용 경로
  if (editorPaths.some(path => pathname.startsWith(path))) {
    if (roleHierarchy[user!.role as Role] < roleHierarchy['editor']) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  // 사용자 활동 시간 업데이트 (5분마다)
  if (user) {
    const lastActivity = request.cookies.get('last-activity')?.value
    const now = Date.now()

    if (!lastActivity || now - parseInt(lastActivity) > 5 * 60 * 1000) {
      try {
        await supabase
          .from('users')
          .update({ last_activity_at: new Date().toISOString() })
          .eq('id', user.id)

        response.cookies.set('last-activity', now.toString(), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/'
        })
      } catch (error) {
        console.error('Activity update error:', error)
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * 다음 경로들을 제외한 모든 요청에 대해 실행:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}