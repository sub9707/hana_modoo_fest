// libs/users-service.ts
import { query, queryOne, transaction } from '@/lib/mysql/connection'
import { User, Role } from '@/types/auth'
import crypto from 'crypto'

export interface CreateUserData {
  name: string
  username: string
  company?: string
  gender: 'male' | 'female' | 'none'
  birth_date: string
  phone: string
  role: Role
  password: string
}

export interface UpdateUserData {
  name: string
  company?: string
  gender: 'male' | 'female' | 'none'
  birth_date: string
  phone: string
  role: Role
}

export interface UserStats {
  total: number
  admin: number
  editor: number
  user: number
  newThisMonth: number
  male: number
  female: number
  genderUnknown: number
}

/**
 * 모든 사용자 목록 조회 (수정됨 - signup_method, email, profile_image 포함)
 */
export async function getAllUsers(): Promise<User[]> {
  try {
    const users = await query(`
      SELECT 
        id, 
        name, 
        username, 
        company, 
        gender, 
        birth_date, 
        phone, 
        email,
        profile_image,
        role, 
        signup_method,
        last_login_at, 
        last_activity_at, 
        created_at, 
        updated_at
      FROM users 
      ORDER BY created_at DESC
    `)

    return users.map((user: any) => ({
      id: user.id,
      name: user.name,
      username: user.username,
      company: user.company || undefined,
      gender: user.gender,
      birth_date: user.birth_date,
      phone: user.phone,
      email: user.email || undefined,
      profile_image: user.profile_image || undefined,
      role: user.role,
      signup_method: user.signup_method || 'phone',
      last_login_at: user.last_login_at || undefined,
      last_activity_at: user.last_activity_at || undefined,
      created_at: user.created_at,
      updated_at: user.updated_at
    }))
  } catch (error) {
    console.error('Error fetching all users:', error)
    throw new Error('사용자 목록을 가져오는데 실패했습니다.')
  }
}

/**
 * ID로 사용자 조회 (수정됨 - email, profile_image 포함)
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const user = await queryOne(`
      SELECT 
        id, 
        name, 
        username, 
        company, 
        gender, 
        birth_date, 
        phone, 
        email,
        profile_image,
        role,
        signup_method,
        last_login_at, 
        last_activity_at, 
        created_at, 
        updated_at
      FROM users 
      WHERE id = ?
    `, [userId])

    if (!user) return null

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      company: user.company || undefined,
      gender: user.gender,
      birth_date: user.birth_date,
      phone: user.phone,
      email: user.email || undefined,
      profile_image: user.profile_image || undefined,
      role: user.role,
      signup_method: user.signup_method || 'phone',
      last_login_at: user.last_login_at || undefined,
      last_activity_at: user.last_activity_at || undefined,
      created_at: user.created_at,
      updated_at: user.updated_at
    }
  } catch (error) {
    console.error('Error fetching user by ID:', error)
    throw new Error('사용자 정보를 가져오는데 실패했습니다.')
  }
}

/**
 * 사용자명으로 사용자 존재 여부 확인
 */
export async function checkUserExists(username: string): Promise<boolean> {
  try {
    const user = await queryOne(
      'SELECT id FROM users WHERE username = ?',
      [username]
    )
    return !!user
  } catch (error) {
    console.error('Error checking user existence:', error)
    throw new Error('사용자 존재 여부 확인에 실패했습니다.')
  }
}

/**
 * 새 사용자 생성
 */
export async function createUser(userData: CreateUserData): Promise<User> {
  try {
    // 사용자명 중복 확인
    const exists = await checkUserExists(userData.username)
    if (exists) {
      throw new Error('이미 사용 중인 사용자명입니다.')
    }

    // 비밀번호 해싱
    const salt = crypto.randomBytes(32).toString('hex')
    const passwordHash = crypto.pbkdf2Sync(userData.password, salt, 10000, 64, 'sha512').toString('hex')

    const userId = crypto.randomUUID()
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')

    // 사용자 생성 (signup_method 기본값 'phone' 설정)
    await query(`
      INSERT INTO users (
        id, name, username, company, gender, birth_date, phone, role,
        password_hash, password_salt, signup_method, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId,
      userData.name,
      userData.username,
      userData.company || null,
      userData.gender,
      userData.birth_date,
      userData.phone,
      userData.role,
      passwordHash,
      salt,
      'phone', // 기본 가입 방법
      now,
      now
    ])

    // 생성된 사용자 정보 반환
    const newUser = await getUserById(userId)
    if (!newUser) {
      throw new Error('사용자 생성 후 조회에 실패했습니다.')
    }

    return newUser
  } catch (error) {
    console.error('Error creating user:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('사용자 생성에 실패했습니다.')
  }
}

/**
 * 사용자 정보 업데이트
 */
export async function updateUser(userId: string, userData: UpdateUserData): Promise<User> {
  try {
    // 사용자 존재 확인
    const existingUser = await getUserById(userId)
    if (!existingUser) {
      throw new Error('사용자를 찾을 수 없습니다.')
    }

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')

    // 사용자 정보 업데이트
    await query(`
      UPDATE users 
      SET name = ?, company = ?, gender = ?, birth_date = ?, phone = ?, role = ?, updated_at = ?
      WHERE id = ?
    `, [
      userData.name,
      userData.company || null,
      userData.gender,
      userData.birth_date,
      userData.phone,
      userData.role,
      now,
      userId
    ])

    // 업데이트된 사용자 정보 반환
    const updatedUser = await getUserById(userId)
    if (!updatedUser) {
      throw new Error('사용자 업데이트 후 조회에 실패했습니다.')
    }

    return updatedUser
  } catch (error) {
    console.error('Error updating user:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('사용자 정보 업데이트에 실패했습니다.')
  }
}

/**
 * 사용자 역할 변경
 */
export async function updateUserRole(userId: string, newRole: Role): Promise<User> {
  try {
    // 사용자 존재 확인
    const existingUser = await getUserById(userId)
    if (!existingUser) {
      throw new Error('사용자를 찾을 수 없습니다.')
    }

    // 마지막 관리자 권한 제거 방지
    if (existingUser.role === 'admin' && newRole !== 'admin') {
      const adminCount = await getAdminCount()
      if (adminCount <= 1) {
        throw new Error('마지막 관리자의 권한을 제거할 수 없습니다.')
      }
    }

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')

    // 역할 업데이트
    await query(
      'UPDATE users SET role = ?, updated_at = ? WHERE id = ?',
      [newRole, now, userId]
    )

    // 업데이트된 사용자 정보 반환
    const updatedUser = await getUserById(userId)
    if (!updatedUser) {
      throw new Error('사용자 역할 업데이트 후 조회에 실패했습니다.')
    }

    return updatedUser
  } catch (error) {
    console.error('Error updating user role:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('사용자 역할 변경에 실패했습니다.')
  }
}

/**
 * 사용자 삭제
 */
export async function deleteUser(userId: string): Promise<void> {
  try {
    // 사용자 존재 확인
    const existingUser = await getUserById(userId)
    if (!existingUser) {
      throw new Error('사용자를 찾을 수 없습니다.')
    }

    // 마지막 관리자 삭제 방지
    if (existingUser.role === 'admin') {
      const adminCount = await getAdminCount()
      if (adminCount <= 1) {
        throw new Error('마지막 관리자 계정은 삭제할 수 없습니다.')
      }
    }

    // 트랜잭션으로 관련 데이터와 함께 삭제
    await transaction(async (connection) => {
      // 세션 정보 정리
      await connection.execute(
        'UPDATE users SET session_token = NULL, session_expires_at = NULL WHERE id = ?',
        [userId]
      )

      // 사용자 삭제
      await connection.execute('DELETE FROM users WHERE id = ?', [userId])
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('사용자 삭제에 실패했습니다.')
  }
}

/**
 * 관리자 수 조회
 */
export async function getAdminCount(): Promise<number> {
  try {
    const result = await queryOne('SELECT COUNT(*) as count FROM users WHERE role = "admin"')
    return result.count
  } catch (error) {
    console.error('Error counting admins:', error)
    throw new Error('관리자 수 조회에 실패했습니다.')
  }
}

/**
 * 사용자 통계 조회
 */
export async function getUserStats(): Promise<UserStats> {
  try {
    const users = await getAllUsers()
    const now = new Date()

    return {
      total: users.length,
      admin: users.filter(u => u.role === 'admin').length,
      editor: users.filter(u => u.role === 'editor').length,
      user: users.filter(u => u.role === 'user').length,
      male: users.filter(u => u.gender === 'male').length,
      female: users.filter(u => u.gender === 'female').length,
      genderUnknown: users.filter(u => u.gender === 'none').length,
      newThisMonth: users.filter(user => {
        const userDate = new Date(user.created_at)
        return (now.getTime() - userDate.getTime()) <= (30 * 24 * 60 * 60 * 1000)
      }).length
    }
  } catch (error) {
    console.error('Error getting user stats:', error)
    throw new Error('사용자 통계 조회에 실패했습니다.')
  }
}

/**
 * 사용자 검색 (수정됨 - signup_method, email, profile_image 포함)
 */
export async function searchUsers(searchTerm: string): Promise<User[]> {
  try {
    const users = await query(`
      SELECT 
        id, 
        name, 
        username, 
        company, 
        gender, 
        birth_date, 
        phone, 
        email,
        profile_image,
        role, 
        signup_method,
        last_login_at, 
        last_activity_at, 
        created_at, 
        updated_at
      FROM users 
      WHERE name LIKE ? 
         OR username LIKE ? 
         OR company LIKE ? 
         OR phone LIKE ?
      ORDER BY created_at DESC
    `, [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`])

    return users.map((user: any) => ({
      id: user.id,
      name: user.name,
      username: user.username,
      company: user.company || undefined,
      gender: user.gender,
      birth_date: user.birth_date,
      phone: user.phone,
      email: user.email || undefined,
      profile_image: user.profile_image || undefined,
      role: user.role,
      signup_method: user.signup_method || 'phone',
      last_login_at: user.last_login_at || undefined,
      last_activity_at: user.last_activity_at || undefined,
      created_at: user.created_at,
      updated_at: user.updated_at
    }))
  } catch (error) {
    console.error('Error searching users:', error)
    throw new Error('사용자 검색에 실패했습니다.')
  }
}

/**
 * 역할별 사용자 조회 (수정됨 - signup_method, email, profile_image 포함)
 */
export async function getUsersByRole(role: Role): Promise<User[]> {
  try {
    const users = await query(`
      SELECT 
        id, 
        name, 
        username, 
        company, 
        gender, 
        birth_date, 
        phone, 
        email,
        profile_image,
        role, 
        signup_method,
        last_login_at, 
        last_activity_at, 
        created_at, 
        updated_at
      FROM users 
      WHERE role = ?
      ORDER BY created_at DESC
    `, [role])

    return users.map((user: any) => ({
      id: user.id,
      name: user.name,
      username: user.username,
      company: user.company || undefined,
      gender: user.gender,
      birth_date: user.birth_date,
      phone: user.phone,
      email: user.email || undefined,
      profile_image: user.profile_image || undefined,
      role: user.role,
      signup_method: user.signup_method || 'phone',
      last_login_at: user.last_login_at || undefined,
      last_activity_at: user.last_activity_at || undefined,
      created_at: user.created_at,
      updated_at: user.updated_at
    }))
  } catch (error) {
    console.error('Error fetching users by role:', error)
    throw new Error('역할별 사용자 조회에 실패했습니다.')
  }
}

/**
 * 특정 기간 내 가입한 사용자 조회 (수정됨 - signup_method, email, profile_image 포함)
 */
export async function getUsersByDateRange(startDate: Date, endDate: Date): Promise<User[]> {
  try {
    const start = startDate.toISOString().slice(0, 19).replace('T', ' ')
    const end = endDate.toISOString().slice(0, 19).replace('T', ' ')

    const users = await query(`
      SELECT 
        id, 
        name, 
        username, 
        company, 
        gender, 
        birth_date, 
        phone, 
        email,
        profile_image,
        role, 
        signup_method,
        last_login_at, 
        last_activity_at, 
        created_at, 
        updated_at
      FROM users 
      WHERE created_at BETWEEN ? AND ?
      ORDER BY created_at DESC
    `, [start, end])

    return users.map((user: any) => ({
      id: user.id,
      name: user.name,
      username: user.username,
      company: user.company || undefined,
      gender: user.gender,
      birth_date: user.birth_date,
      phone: user.phone,
      email: user.email || undefined,
      profile_image: user.profile_image || undefined,
      role: user.role,
      signup_method: user.signup_method || 'phone',
      last_login_at: user.last_login_at || undefined,
      last_activity_at: user.last_activity_at || undefined,
      created_at: user.created_at,
      updated_at: user.updated_at
    }))
  } catch (error) {
    console.error('Error fetching users by date range:', error)
    throw new Error('기간별 사용자 조회에 실패했습니다.')
  }
}

/**
 * 사용자 마지막 활동 시간 업데이트
 */
export async function updateUserActivity(userId: string): Promise<void> {
  try {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
    await query(
      'UPDATE users SET last_activity_at = ? WHERE id = ?',
      [now, userId]
    )
  } catch (error) {
    console.error('Error updating user activity:', error)
    // 이 함수는 에러를 throw하지 않음 (로그인 등의 중요한 프로세스를 방해하지 않기 위해)
  }
}

/**
 * 사용자 마지막 로그인 시간 업데이트
 */
export async function updateUserLoginTime(userId: string): Promise<void> {
  try {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
    await query(
      'UPDATE users SET last_login_at = ?, last_activity_at = ? WHERE id = ?',
      [now, now, userId]
    )
  } catch (error) {
    console.error('Error updating user login time:', error)
    // 이 함수는 에러를 throw하지 않음 (로그인 프로세스를 방해하지 않기 위해)
  }
}

/**
 * 비밀번호 변경
 */
export async function updateUserPassword(userId: string, newPassword: string): Promise<void> {
  try {
    // 사용자 존재 확인
    const user = await getUserById(userId)
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.')
    }

    // 새 비밀번호 해싱
    const salt = crypto.randomBytes(32).toString('hex')
    const passwordHash = crypto.pbkdf2Sync(newPassword, salt, 10000, 64, 'sha512').toString('hex')
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')

    // 비밀번호 업데이트
    await query(
      'UPDATE users SET password_hash = ?, password_salt = ?, updated_at = ? WHERE id = ?',
      [passwordHash, salt, now, userId]
    )
  } catch (error) {
    console.error('Error updating user password:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('비밀번호 변경에 실패했습니다.')
  }
}