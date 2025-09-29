import { NextRequest, NextResponse } from 'next/server'
import type { RowDataPacket } from 'mysql2/promise'

export type Role = 'admin' | 'editor' | 'user'
export type SignupMethod = 'phone' | 'naver' | 'kakao'

interface DatabaseUser extends RowDataPacket {
  id: string
  name: string
  username: string
  role: Role
  signup_method: SignupMethod
  email?: string
  profile_image?: string
  session_expires_at: string | null
  last_activity_at: string | null
}

interface MiddlewareUser {
  id: string
  name: string
  username: string
  role: Role
  signup_method: SignupMethod
  email?: string
  profile_image?: string
  session_expires_at: Date | null
  last_activity_at: Date | null
}

const PROTECTED_PATHS = [
  '/admin',
  '/profile',
  '/settings',
  '/my-page',
  '/registration',
  '/registration/success',
] as const

const ADMIN_PATHS = ['/admin'] as const
const EDITOR_PATHS = ['/editor', '/manage'] as const

const ROLE_HIERARCHY: Record<Role, number> = {
  'user': 1,
  'editor': 2,
  'admin': 3
} as const

const STATIC_FILE_PATTERNS = [
  '/_next',
  '/api',
  '/__nextjs_original-stack-frame',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml'
] as const

let globalPool: any = null

async function queryDatabase<T extends RowDataPacket = RowDataPacket>(
  sql: string,
  params: unknown[] = []
): Promise<T | null> {
  try {
    if (!globalPool) {
      const { getPool } = await import('@/lib/mysql/connection')
      globalPool = getPool()
    }

    const [rows] = await globalPool.execute(sql, params)

    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0] as T
    }

    return null
  } catch (error) {
    console.error('Middleware database query error:', {
      sql: sql.substring(0, 50) + '...',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return null
  }
}

function transformDatabaseUser(dbUser: DatabaseUser): MiddlewareUser {
  return {
    id: dbUser.id,
    name: dbUser.name,
    username: dbUser.username,
    role: dbUser.role,
    signup_method: dbUser.signup_method,
    email: dbUser.email,
    profile_image: dbUser.profile_image,
    session_expires_at: dbUser.session_expires_at ? new Date(dbUser.session_expires_at) : null,
    last_activity_at: dbUser.last_activity_at ? new Date(dbUser.last_activity_at) : null
  }
}

function isStaticFile(pathname: string): boolean {
  return STATIC_FILE_PATTERNS.some(pattern => pathname.startsWith(pattern)) ||
    pathname.includes('.') && !pathname.endsWith('/')
}

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some(path => pathname.startsWith(path))
}

function isAdminPath(pathname: string): boolean {
  return ADMIN_PATHS.some(path => pathname.startsWith(path))
}

function isEditorPath(pathname: string): boolean {
  return EDITOR_PATHS.some(path => pathname.startsWith(path))
}

function hasRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

function isSessionExpired(expiresAt: Date | null): boolean {
  if (!expiresAt) return true
  return new Date() > expiresAt
}

async function clearExpiredSession(userId: string): Promise<void> {
  try {
    if (!globalPool) {
      const { getPool } = await import('@/lib/mysql/connection')
      globalPool = getPool()
    }

    await globalPool.execute(
      'UPDATE users SET session_token = NULL, session_expires_at = NULL WHERE id = ?',
      [userId]
    )
  } catch (error) {
    console.error('Error clearing expired session:', error)
  }
}

async function updateUserActivity(userId: string): Promise<void> {
  try {
    if (!globalPool) {
      const { getPool } = await import('@/lib/mysql/connection')
      globalPool = getPool()
    }

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
    await globalPool.execute(
      'UPDATE users SET last_activity_at = ? WHERE id = ?',
      [now, userId]
    )
  } catch (error) {
    console.error('Error updating user activity:', error)
  }
}

async function authenticateUser(sessionToken: string): Promise<MiddlewareUser | null> {
  if (!sessionToken) return null

  try {
    const dbUser = await queryDatabase<DatabaseUser>(
      `SELECT 
         u.id, u.name, u.username, u.role, u.signup_method, u.email, u.profile_image,
         u.session_expires_at, u.last_activity_at
       FROM users u
       WHERE u.session_token = ?`,
      [sessionToken]
    )

    if (!dbUser) {
      console.warn('[Middleware] 등록되지 않은 토큰 (다른 기기 로그인으로 무효화됨):', sessionToken.substring(0, 8))
      return null
    }

    const user = transformDatabaseUser(dbUser)

    if (isSessionExpired(user.session_expires_at)) {
      console.warn('[Middleware] 만료된 토큰')
      await clearExpiredSession(dbUser.id)
      return null
    }

    return user
  } catch (error) {
    console.error('[Middleware] 인증 에러:', error)
    return null
  }
}

function createRedirectUrl(request: NextRequest, path: string, params?: Record<string, string>): URL {
  const url = new URL(path, request.url)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }

  return url
}

function getCookieOptions(secure: boolean = process.env.NODE_ENV === 'production') {
  return {
    httpOnly: true,
    secure,
    sameSite: 'lax' as const,
    path: '/',
  }
}

// ✅ 개선된 무한 리다이렉트 감지 (쿠키 기반)
function checkRedirectLoop(request: NextRequest): { isLoop: boolean; count: number } {
  const loopCookie = request.cookies.get('_redirect_loop')?.value

  if (!loopCookie) {
    return { isLoop: false, count: 0 }
  }

  try {
    const data = JSON.parse(loopCookie)
    const now = Date.now()

    // 5초 이내에 3번 이상 리다이렉트되면 루프로 판단
    if (now - data.timestamp < 5000 && data.count >= 3) {
      console.error('[Middleware] 무한 리다이렉트 감지:', data.count, '회')
      return { isLoop: true, count: data.count }
    }

    // 5초가 지났으면 카운트 리셋
    if (now - data.timestamp >= 5000) {
      return { isLoop: false, count: 0 }
    }

    return { isLoop: false, count: data.count }
  } catch {
    return { isLoop: false, count: 0 }
  }
}

// ✅ 리다이렉트 카운트 증가
function incrementRedirectCount(response: NextResponse, currentCount: number): void {
  const data = {
    count: currentCount + 1,
    timestamp: Date.now()
  }

  response.cookies.set('_redirect_loop', JSON.stringify(data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 10 // 10초 후 자동 삭제
  })
}

// ✅ 리다이렉트 카운트 초기화
function clearRedirectCount(response: NextResponse): void {
  response.cookies.set('_redirect_loop', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0)
  })
}

// ✅ 메인 미들웨어 함수
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl

  // 정적 파일들은 미들웨어를 거치지 않음
  if (isStaticFile(pathname)) {
    return NextResponse.next()
  }

  // ✅ 무한 리다이렉트 루프 감지 (쿠키 기반)
  const { isLoop, count } = checkRedirectLoop(request)

  if (isLoop) {
    console.error('[Middleware] 무한 리다이렉트 루프 중단 - 강제 로그아웃')
    const response = NextResponse.redirect(new URL('/login?message=' +
      encodeURIComponent('세션 오류가 발생했습니다. 다시 로그인해주세요.'), request.url))

    // 모든 인증 관련 쿠키 삭제
    response.cookies.set('session-token', '', {
      ...getCookieOptions(),
      expires: new Date(0),
      maxAge: 0
    })
    clearRedirectCount(response)

    return response
  }

  const response = NextResponse.next()
  const sessionToken = request.cookies.get('session-token')?.value

  // 로그인 페이지 접근 처리
  if (pathname === '/login') {
    // ✅ 로그인 페이지에서는 리다이렉트 카운트 초기화
    clearRedirectCount(response)

    // 세션 만료 파라미터가 있으면 쿠키 강제 삭제
    if (request.nextUrl.searchParams.get('session_expired') === 'true') {
      response.cookies.set('session-token', '', {
        ...getCookieOptions(),
        expires: new Date(0),
        maxAge: 0
      })
    }
    return response
  }

  // 사용자 인증
  let user: MiddlewareUser | null = null

  if (sessionToken) {
    user = await authenticateUser(sessionToken)

    // ✅ 세션 무효화 감지 (다른 기기 로그인 등)
    if (!user && sessionToken) {
      console.warn('[Middleware] 세션 무효화 감지 - 쿠키 삭제 및 강제 로그아웃')

      // 보호된 경로에서 무효화된 세션 발견 시
      if (isProtectedPath(pathname)) {
        const loginUrl = createRedirectUrl(request, '/login', {
          callbackUrl: pathname,
          message: '다른 기기에서 로그인하여 현재 세션이 종료되었습니다. 다시 로그인해주세요.',
          session_expired: 'true'
        })

        const redirectResponse = NextResponse.redirect(loginUrl)

        // 쿠키 확실하게 삭제
        redirectResponse.cookies.set('session-token', '', {
          ...getCookieOptions(),
          expires: new Date(0),
          maxAge: 0
        })

        // ✅ 리다이렉트 카운트 증가
        incrementRedirectCount(redirectResponse, count)

        return redirectResponse
      }

      // 일반 페이지에서는 쿠키만 삭제
      response.cookies.set('session-token', '', {
        ...getCookieOptions(),
        expires: new Date(0),
        maxAge: 0
      })
    }
  }



  // ✅ 보호된 경로 체크
  if (isProtectedPath(pathname)) {
    if (!user) {
      console.log('[Middleware] 인증 필요 - 로그인 페이지로 리다이렉트:', pathname)

      const hadToken = !!sessionToken

      const loginUrl = createRedirectUrl(request, '/login', {
        callbackUrl: pathname,
        message: hadToken
          ? '세션이 만료되었습니다. 다시 로그인해주세요.'
          : '로그인이 필요한 서비스입니다.',
        ...(hadToken && { session_expired: 'true' })
      })

      const redirectResponse = NextResponse.redirect(loginUrl)

      // 쿠키 삭제
      if (hadToken) {
        redirectResponse.cookies.set('session-token', '', {
          ...getCookieOptions(),
          expires: new Date(0),
          maxAge: 0
        })
      }

      // ✅ 리다이렉트 카운트 증가
      incrementRedirectCount(redirectResponse, count)

      return redirectResponse
    }

    // ✅ 인증 성공 시 리다이렉트 카운트 초기화
    clearRedirectCount(response)
  }

  // 권한 기반 접근 제어
  if (user) {
    // 관리자 전용 경로
    if (isAdminPath(pathname)) {
      if (!hasRole(user.role, 'admin')) {
        console.warn('[Middleware] 관리자 권한 부족:', user.username)
        const errorUrl = createRedirectUrl(request, '/unauthorized', {
          message: '관리자 권한이 필요합니다.'
        })
        return NextResponse.redirect(errorUrl)
      }
    }

    // 편집자 이상 전용 경로  
    if (isEditorPath(pathname)) {
      if (!hasRole(user.role, 'editor')) {
        console.warn('[Middleware] 편집자 권한 부족:', user.username)
        const errorUrl = createRedirectUrl(request, '/unauthorized', {
          message: '편집자 이상의 권한이 필요합니다.'
        })
        return NextResponse.redirect(errorUrl)
      }
    }

    // 사용자 활동 시간 업데이트 (30분마다)
    const lastActivity = user.last_activity_at
    if (!lastActivity || (new Date().getTime() - lastActivity.getTime()) > 30 * 60 * 1000) {
      updateUserActivity(user.id).catch(err =>
        console.error('[Middleware] 활동 시간 업데이트 실패:', err)
      )
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
  runtime: 'nodejs',
  unstable_allowDynamic: [
    '/lib/**',
  ]
}