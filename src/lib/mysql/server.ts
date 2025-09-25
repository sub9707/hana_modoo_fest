import { Role } from '@/types/auth'
import { cookies } from 'next/headers'
import { cache } from 'react'
import { query, queryOne } from '@/lib/mysql/connection'

// 현재 로그인된 사용자 정보 가져오기
export const getCurrentUser = cache(async () => {

  const cookieStore = await cookies()

  const sessionToken = cookieStore.get('session-token')?.value

  if (!sessionToken) {
    return null
  }

  try {
    const user = await queryOne(
      'SELECT id, name, company, username, gender, birth_date, phone, role, created_at, last_login_at, last_activity_at, updated_at, signup_method FROM users WHERE session_token = ?',
      [sessionToken]
    )

    if (!user) {
      return null
    }

    // 세션 만료 확인
    if (user.session_expires_at && new Date(user.session_expires_at) < new Date()) {
      // 만료된 세션 정리
      await query(
        'UPDATE users SET session_token = NULL, session_expires_at = NULL WHERE id = ?',
        [user.id]
      )

      return null
    }

    return {
      id: user.id,
      name: user.name,
      company: user.company,
      username: user.username,
      gender: user.gender,
      birth_date: user.birth_date,
      phone: user.phone,
      role: user.role,
      created_at: user.created_at,
      last_login_at: user.last_login_at,
      last_activity_at: user.last_activity_at,
      updated_at: user.updated_at,
      signup_method: user.signup_method 
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
})

// 사용자 권한 확인
export const checkUserRole = cache(async (requiredRole: Role): Promise<boolean> => {
  const user = await getCurrentUser()

  if (!user) return false

  const roleHierarchy: Record<Role, number> = {
    'user': 1,
    'editor': 2,
    'admin': 3
  }

  return roleHierarchy[user.role as Role] >= roleHierarchy[requiredRole]
})

// NextJS 15: 사용자 세션 검증 (캐시됨)
export const validateSession = cache(async () => {
  const user = await getCurrentUser()
  return !!user
})

// NextJS 15: 사용자 권한별 리다이렉트
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}

export async function requireRole(role: Role) {
  const hasRole = await checkUserRole(role)
  if (!hasRole) {
    throw new Error('Insufficient permissions')
  }
}