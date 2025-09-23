import { NextRequest, NextResponse } from 'next/server'
import type { RowDataPacket } from 'mysql2/promise'

// 사용자 역할 타입 정의
export type Role = 'admin' | 'editor' | 'user'

// 데이터베이스 사용자 타입 정의
interface DatabaseUser extends RowDataPacket {
  id: string
  name: string
  username: string
  role: Role
  session_expires_at: string | null
  last_activity_at: string | null
}

// 미들웨어에서 사용할 사용자 타입
interface MiddlewareUser {
  id: string
  name: string
  username: string
  role: Role
  session_expires_at: Date | null
  last_activity_at: Date | null
}

// 보호된 경로 설정
const PROTECTED_PATHS = [
  '/dashboard',
  '/profile', 
  '/settings',
  '/my-page',
  '/registration',
  '/registration/success'
] as const

const ADMIN_PATHS = ['/admin'] as const
const EDITOR_PATHS = ['/editor', '/manage'] as const

// 역할 계층 구조
const ROLE_HIERARCHY: Record<Role, number> = {
  'user': 1,
  'editor': 2,
  'admin': 3
} as const

// 정적 파일 경로 패턴
const STATIC_FILE_PATTERNS = [
  '/_next',
  '/api',
  '/__nextjs_original-stack-frame',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml'
] as const

// 데이터베이스 연결 설정
interface DatabaseConfig {
  host: string
  port: number
  user: string
  password: string
  database: string
  charset: string
  timezone: string
  dateStrings: boolean
}

function getDatabaseConfig(): DatabaseConfig {
  return {
    host: process.env.NEXT_PUBLIC_MYSQL_HOST || '192.168.219.102',
    port: parseInt(process.env.NEXT_PUBLIC_MYSQL_PORT || '13306', 10),
    user: process.env.NEXT_PUBLIC_MYSQL_USER || 'root',
    password: process.env.NEXT_PUBLIC_MYSQL_PASSWORD || '',
    database: process.env.NEXT_PUBLIC_MYSQL_DATABASE || 'modohana_festival',
    charset: 'utf8mb4',
    timezone: '+09:00',
    dateStrings: true,
  }
}

// 안전한 데이터베이스 쿼리 함수
async function queryDatabase<T extends RowDataPacket = RowDataPacket>(
  sql: string, 
  params: unknown[] = []
): Promise<T | null> {
  let connection: any = null
  
  try {
    const mysql = await import('mysql2/promise')
    const config = getDatabaseConfig()
    
    connection = await mysql.default.createConnection(config)
    
    const [rows] = await connection.execute(sql, params)
    
    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0] as T
    }
    
    return null
  } catch (error) {
    console.error('Middleware database query error:', {
      sql,
      params: params.map(p => typeof p === 'string' ? p.substring(0, 10) + '...' : p),
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return null
  } finally {
    if (connection) {
      try {
        await connection.end()
      } catch (error) {
        console.error('Error closing database connection:', error)
      }
    }
  }
}

// 사용자 데이터 변환 함수
function transformDatabaseUser(dbUser: DatabaseUser): MiddlewareUser {
  return {
    id: dbUser.id,
    name: dbUser.name,
    username: dbUser.username,
    role: dbUser.role,
    session_expires_at: dbUser.session_expires_at ? new Date(dbUser.session_expires_at) : null,
    last_activity_at: dbUser.last_activity_at ? new Date(dbUser.last_activity_at) : null
  }
}

// 정적 파일 체크 함수
function isStaticFile(pathname: string): boolean {
  return STATIC_FILE_PATTERNS.some(pattern => pathname.startsWith(pattern)) ||
         pathname.includes('.') && !pathname.endsWith('/')
}

// 보호된 경로 체크 함수
function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some(path => pathname.startsWith(path))
}

// 관리자 경로 체크 함수
function isAdminPath(pathname: string): boolean {
  return ADMIN_PATHS.some(path => pathname.startsWith(path))
}

// 편집자 경로 체크 함수
function isEditorPath(pathname: string): boolean {
  return EDITOR_PATHS.some(path => pathname.startsWith(path))
}

// 권한 체크 함수
function hasRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

// 세션 만료 체크 함수
function isSessionExpired(expiresAt: Date | null): boolean {
  if (!expiresAt) return true
  return new Date() > expiresAt
}

// 세션 정리 함수
async function clearExpiredSession(userId: string): Promise<void> {
  try {
    await queryDatabase(
      'UPDATE users SET session_token = NULL, session_expires_at = NULL WHERE id = ?',
      [userId]
    )
  } catch (error) {
    console.error('Error clearing expired session:', error)
  }
}

// 사용자 활동 시간 업데이트 함수
async function updateUserActivity(userId: string): Promise<void> {
  try {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
    await queryDatabase(
      'UPDATE users SET last_activity_at = ? WHERE id = ?',
      [now, userId]
    )
  } catch (error) {
    console.error('Error updating user activity:', error)
  }
}

// 사용자 인증 함수
async function authenticateUser(sessionToken: string): Promise<MiddlewareUser | null> {
  if (!sessionToken) return null

  const dbUser = await queryDatabase<DatabaseUser>(
    'SELECT id, name, username, role, session_expires_at, last_activity_at FROM users WHERE session_token = ?',
    [sessionToken]
  )

  if (!dbUser) return null

  const user = transformDatabaseUser(dbUser)

  // 세션 만료 확인
  if (isSessionExpired(user.session_expires_at)) {
    await clearExpiredSession(user.id)
    return null
  }

  return user
}

// 리다이렉트 URL 생성 함수
function createRedirectUrl(request: NextRequest, path: string, params?: Record<string, string>): URL {
  const url = new URL(path, request.url)
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }
  
  return url
}

// 쿠키 설정 옵션
function getCookieOptions(secure: boolean = process.env.NODE_ENV === 'production') {
  return {
    httpOnly: true,
    secure,
    sameSite: 'lax' as const,
    path: '/',
  }
}

// 메인 미들웨어 함수
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl

  // 정적 파일들은 미들웨어를 거치지 않음
  if (isStaticFile(pathname)) {
    return NextResponse.next()
  }

  const response = NextResponse.next()
  const sessionToken = request.cookies.get('session-token')?.value

  // 사용자 인증
  let user: MiddlewareUser | null = null
  
  if (sessionToken) {
    user = await authenticateUser(sessionToken)
    
    // 만료된 세션인 경우 쿠키 삭제
    if (!user && sessionToken) {
      response.cookies.set('session-token', '', {
        ...getCookieOptions(),
        expires: new Date(0)
      })
    }
  }

  // 로그인 페이지 접근 처리
  if (pathname === '/login') {
    if (user) {
      const callbackUrl = request.nextUrl.searchParams.get('callbackUrl') || '/dashboard'
      return NextResponse.redirect(new URL(callbackUrl, request.url))
    }
    return response
  }

  // 로그인이 필요한 경로 체크
  if (isProtectedPath(pathname)) {
    if (!user) {
      const loginUrl = createRedirectUrl(request, '/login', {
        callbackUrl: pathname,
        message: '로그인이 필요한 서비스입니다.'
      })
      return NextResponse.redirect(loginUrl)
    }
  }

  // 권한 기반 접근 제어
  if (user) {
    // 관리자 전용 경로
    if (isAdminPath(pathname)) {
      if (!hasRole(user.role, 'admin')) {
        const errorUrl = createRedirectUrl(request, '/unauthorized', {
          message: '관리자 권한이 필요합니다.'
        })
        return NextResponse.redirect(errorUrl)
      }
    }

    // 편집자 이상 전용 경로  
    if (isEditorPath(pathname)) {
      if (!hasRole(user.role, 'editor')) {
        const errorUrl = createRedirectUrl(request, '/unauthorized', {
          message: '편집자 이상의 권한이 필요합니다.'
        })
        return NextResponse.redirect(errorUrl)
      }
    }

    // 사용자 활동 시간 업데이트 (5분마다)
    const lastActivityCookie = request.cookies.get('last-activity')?.value
    const now = Date.now()
    const fiveMinutesInMs = 5 * 60 * 1000

    if (!lastActivityCookie || now - parseInt(lastActivityCookie, 10) > fiveMinutesInMs) {
      // 비동기로 실행하여 응답 지연을 방지
      updateUserActivity(user.id).catch(error => {
        console.error('Failed to update user activity:', error)
      })

      response.cookies.set('last-activity', now.toString(), {
        ...getCookieOptions(),
        maxAge: 60 * 60 * 24 * 7 // 7일
      })
    }

    // 사용자 정보를 헤더에 추가 (선택사항 - 클라이언트에서 사용할 수 있음)
    response.headers.set('x-user-id', user.id)
    response.headers.set('x-user-role', user.role)
  }

  return response
}

// NextJS 15 최적화된 매처 설정
export const config = {
  matcher: [
    /*
     * 다음 경로들을 제외한 모든 요청에 대해 실행:
     * - api routes (API 경로들)
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화 파일)
     * - favicon.ico 및 기타 정적 assets
     * - 확장자가 있는 파일들
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
  runtime: 'nodejs',
  // NextJS 15에서 추가된 설정
  unstable_allowDynamic: [
    '/lib/**', // lib 폴더의 동적 import 허용
  ]
}