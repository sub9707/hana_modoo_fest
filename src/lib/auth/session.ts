// src/lib/auth/session.ts
import { cookies } from 'next/headers'
import { queryOne } from '@/lib/mysql/connection'
import type { User } from '@/types/auth'

/**
 * 현재 세션에서 사용자 정보 가져오기
 */
export async function getUserFromSession(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session-token')?.value

    if (!sessionToken) {
      return null
    }

    // 사용자 정보와 세션 검증
    const user = await queryOne(
      `SELECT u.id, u.name, u.username, u.company, u.gender, u.birth_date, 
              u.phone, u.email, u.profile_image, u.role, u.signup_method,
              u.address, u.address_detail, u.zip_code,
              u.last_login_at, u.last_activity_at, u.created_at, u.updated_at
       FROM users u 
       WHERE u.session_token = ? 
       AND (u.session_expires_at IS NULL OR u.session_expires_at > NOW())`,
      [sessionToken]
    )

    if (!user) {
      return null
    }

    return user as User
  } catch (error) {
    console.error('Get user from session error:', error)
    return null
  }
}

/**
 * 세션 토큰 검증
 */
export async function validateSessionToken(sessionToken: string): Promise<boolean> {
  try {
    const result = await queryOne(
      `SELECT id FROM users 
       WHERE session_token = ? 
       AND (session_expires_at IS NULL OR session_expires_at > NOW())`,
      [sessionToken]
    )

    return !!result
  } catch (error) {
    console.error('Validate session token error:', error)
    return false
  }
}

/**
 * 세션 만료
 */
export async function invalidateSession(sessionToken: string): Promise<void> {
  try {
    await queryOne(
      'UPDATE users SET session_token = NULL, session_expires_at = NULL WHERE session_token = ?',
      [sessionToken]
    )
  } catch (error) {
    console.error('Invalidate session error:', error)
  }
}