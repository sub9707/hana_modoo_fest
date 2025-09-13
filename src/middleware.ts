import { NextRequest, NextResponse } from 'next/server'
import { Role } from './types/auth'

// 로그인이 필요한 경로들 (명시적으로 정의)
const protectedPaths = ['/dashboard', '/profile', '/settings', '/my-page', '/registration']

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

// NextJS 15: 데이터베이스 쿼리 함수 (미들웨어에서 사용)
async function queryDatabase(sql: string, params: any[] = []) {
  try {
    // NextJS 15: 동적 import 사용
    const mysql = await import('mysql2/promise')

    const connection = await mysql.default.createConnection({
      host: '192.168.219.102',
      port: 13306,
      user: process.env.NEXT_PUBLIC_MYSQL_USER || 'root',
      password: process.env.NEXT_PUBLIC_MYSQL_PASSWORD || '',
      database: process.env.NEXT_PUBLIC_MYSQL_DATABASE || 'modohana_festival',
      charset: 'utf8mb4',
      timezone: '+09:00',
      dateStrings: true,
    })

    try {
      const [rows] = await connection.execute(sql, params)
      return Array.isArray(rows) && rows.length > 0 ? rows[0] : null
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error('Middleware database query error:', error)
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 정적 파일들은 미들웨어를 거치지 않음
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/__nextjs_original-stack-frame')
  ) {
    return NextResponse.next()
  }

  // NextJS 15: Response 생성 방식 개선
  const response = NextResponse.next()

  // 세션 토큰 확인
  const sessionToken = request.cookies.get('session-token')?.value

  let user = null
  if (sessionToken) {
    try {
      const userData = await queryDatabase(
        'SELECT id, name, username, role, session_expires_at FROM users WHERE session_token = ?',
        [sessionToken]
      )

      if (userData) {
        const userRow = userData as { id: number; name: string; username: string; role: Role; session_expires_at: string | null }
        // 세션 만료 확인
        if (userRow.session_expires_at && new Date(userRow.session_expires_at) > new Date()) {
          user = userRow
        } else {
          // 만료된 세션 정리
          await queryDatabase(
            'UPDATE users SET session_token = NULL, session_expires_at = NULL WHERE id = ?',
            [userRow.id]
          )

          // NextJS 15: 쿠키 삭제 개선
          response.cookies.set('session-token', '', {
            expires: new Date(0),
            path: '/',
          })
        }
      }
    } catch (error) {
      console.error('Middleware auth error:', error)
    }
  }

  // 로그인 페이지 접근 처리
  if (pathname === '/login') {
    if (user) {
      // 이미 로그인된 사용자는 대시보드로 리다이렉트
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return response
  }

  // 로그인 필요한 경로 체크
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      loginUrl.searchParams.set('message', '로그인이 필요한 접근입니다.')
      return NextResponse.redirect(loginUrl)
    }
  }

  // 권한 기반 접근 제어
  if (user) {
    const userRole = (user as any).role
    // 관리자 전용 경로
    if (adminPaths.some(path => pathname.startsWith(path))) {
      if (roleHierarchy[userRole as Role] < roleHierarchy['admin']) {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }

    // 편집자 이상 전용 경로  
    if (editorPaths.some(path => pathname.startsWith(path))) {
      if (roleHierarchy[userRole as Role] < roleHierarchy['editor']) {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }

    // NextJS 15: 사용자 활동 시간 업데이트 (5분마다)
    const lastActivity = request.cookies.get('last-activity')?.value
    const now = Date.now()

    if (!lastActivity || now - parseInt(lastActivity) > 5 * 60 * 1000) {
      try {
        await queryDatabase(
          'UPDATE users SET last_activity_at = ? WHERE id = ?',
          [new Date().toISOString().slice(0, 19).replace('T', ' '), user.id]
        )

        response.cookies.set('last-activity', now.toString(), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7 // 7일
        })
      } catch (error) {
        console.error('Activity update error:', error)
      }
    }
  }

  return response
}

// NextJS 15: config 개선
export const config = {
  matcher: [
    /*
     * NextJS 15: 매처 패턴 개선
     * 다음 경로들을 제외한 모든 요청에 대해 실행:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - 기타 정적 assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|__nextjs_original-stack-frame).*)',
  ],
  runtime: 'nodejs'
}

