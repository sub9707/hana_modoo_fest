import { Role } from '@/types/auth'
import { cookies } from 'next/headers'
import { query, queryOne } from '@/lib/mysql/connection'

// 현재 로그인된 사용자 정보 가져오기
export async function getCurrentUser() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session-token')?.value

  if (!sessionToken) {
    return null
  }

  try {
    const user = await queryOne(
      `SELECT id, name, company, username, gender, birth_date, phone, email, profile_image, 
              role, signup_method, created_at, last_login_at, last_activity_at, updated_at, 
              session_expires_at, address, address_detail, zip_code
       FROM users WHERE session_token = ? AND deleted_at IS NULL`,
      [sessionToken]
    )

    if (!user) {
      return null
    }

    // 세션 만료 확인
    if (user.session_expires_at && new Date(user.session_expires_at) < new Date()) {
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
      email: user.email,
      profile_image: user.profile_image,
      gender: user.gender,
      birth_date: user.birth_date,
      phone: user.phone,
      address: user.address,
      address_detail: user.address_detail,
      zip_code: user.zip_code,
      role: user.role,
      signup_method: user.signup_method || 'phone',
      created_at: user.created_at,
      last_login_at: user.last_login_at,
      last_activity_at: user.last_activity_at,
      updated_at: user.updated_at
    }
  } catch (error) {
    console.error('[getCurrentUser] 에러:', error)
    return null
  }
}

// 사용자 권한 확인
export async function checkUserRole(requiredRole: Role): Promise<boolean> {
  const user = await getCurrentUser()

  if (!user) return false

  const roleHierarchy: Record<Role, number> = {
    'user': 1,
    'editor': 2,
    'admin': 3
  }

  return roleHierarchy[user.role as Role] >= roleHierarchy[requiredRole]
}

export async function validateSession(): Promise<boolean> {
  const user = await getCurrentUser()
  return !!user
}

// 로그인하지 않았으면 예외를 던진다
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