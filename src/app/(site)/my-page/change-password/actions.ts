'use server'

import { cookies } from 'next/headers'
import { createHash, randomBytes } from 'crypto'
import { queryOne, query } from '@/lib/mysql/connection'
import { revalidateTag } from 'next/cache'
import { changePasswordSchema, type ChangePasswordData } from '@/lib/validations/auth'
import { validatePasswordServer } from '@/lib/utils/password'

interface PasswordChangeResponse {
  success: boolean
  error?: string
  message?: string
}

/**
 * NextJS 15: Server Action으로 비밀번호 변경
 * 향상된 보안 검증 및 캐시 무효화 적용
 */
export async function changePassword(data: ChangePasswordData): Promise<PasswordChangeResponse> {
  try {
    // 입력값 검증
    const validation = changePasswordSchema.safeParse(data)
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0].message
      }
    }

    // 새 비밀번호 강도 검증 (서버 사이드)
    const passwordValidation = validatePasswordServer(data.newPassword)
    if (!passwordValidation.isValid) {
      return {
        success: false,
        error: passwordValidation.error
      }
    }

    // NextJS 15: cookies() 함수 사용 (async 필요)
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session-token')?.value

    if (!sessionToken) {
      return {
        success: false,
        error: '로그인이 필요합니다.'
      }
    }

    // 사용자 정보 조회
    const user = await queryOne(
      `SELECT id, password_hash, password_salt, session_expires_at, username, phone
       FROM users 
       WHERE session_token = ?`,
      [sessionToken]
    )

    if (!user) {
      return {
        success: false,
        error: '사용자를 찾을 수 없습니다.'
      }
    }

    // 세션 만료 확인
    if (user.session_expires_at && new Date(user.session_expires_at) < new Date()) {
      return {
        success: false,
        error: '세션이 만료되었습니다. 다시 로그인해주세요.'
      }
    }

    // 현재 비밀번호 확인
    const currentPasswordHash = createHash('sha256')
      .update(data.currentPassword + user.password_salt)
      .digest('hex')

    if (currentPasswordHash !== user.password_hash) {
      return {
        success: false,
        error: '현재 비밀번호가 올바르지 않습니다.'
      }
    }

    // 새 비밀번호가 현재 비밀번호와 같은지 확인
    const newPasswordHash = createHash('sha256')
      .update(data.newPassword + user.password_salt)
      .digest('hex')

    if (newPasswordHash === user.password_hash) {
      return {
        success: false,
        error: '현재 비밀번호와 동일한 비밀번호는 사용할 수 없습니다.'
      }
    }

    // 새 솔트 생성 (보안 강화)
    const newSalt = randomBytes(16).toString('hex')
    const finalNewPasswordHash = createHash('sha256')
      .update(data.newPassword + newSalt)
      .digest('hex')

    // 비밀번호 업데이트
    await query(
      `UPDATE users 
       SET password_hash = ?, 
           password_salt = ?, 
           updated_at = ?,
           last_activity_at = ?
       WHERE id = ?`,
      [
        finalNewPasswordHash,
        newSalt,
        new Date().toISOString().slice(0, 19).replace('T', ' '),
        new Date().toISOString().slice(0, 19).replace('T', ' '),
        user.id
      ]
    )

    // NextJS 15: 향상된 캐시 무효화
    revalidateTag('user-info')
    revalidateTag(`user-${user.id}`)

    // 보안 로그 기록
    await logPasswordChange(user.id, user.username, user.phone)

    return {
      success: true,
      message: '비밀번호가 성공적으로 변경되었습니다.'
    }

  } catch (error) {
    console.error('Change password error:', error)
    return {
      success: false,
      error: '비밀번호 변경 중 오류가 발생했습니다.'
    }
  }
}

/**
 * 비밀번호 변경 로그 기록 (보안 감사용)
 * NextJS 15: 향상된 로깅 시스템
 */
async function logPasswordChange(
  userId: string, 
  username: string, 
  phone: string
): Promise<void> {
  try {
    // admin_actions 테이블이 있는지 확인
    const tableExists = await checkTableExists('admin_actions')
    
    if (tableExists) {
      // DB에 보안 로그 기록
      await query(
        `INSERT INTO admin_actions 
         (admin_id, action_type, target_user_hash, reason, metadata, created_at)
         VALUES (?, 'password_change', ?, ?, ?, NOW())`,
        [
          userId, // 사용자 자신이 변경한 경우
          createHash('sha256').update(userId).digest('hex'),
          `사용자 비밀번호 변경 (${username})`,
          JSON.stringify({
            action: 'password_change',
            method: 'user_self_change',
            username: username,
            phone_masked: `${phone.substring(0, 3)}****${phone.substring(phone.length - 4)}`,
            timestamp: new Date().toISOString(),
            user_agent: process.env.USER_AGENT || 'server-action'
          })
        ]
      )
    }
    
  } catch (error) {
    console.error('Log password change error:', error)
    // 로그 기록 실패는 비밀번호 변경 성공에 영향을 주지 않음
  }
}

/**
 * 테이블 존재 여부 확인 유틸리티
 */
async function checkTableExists(tableName: string): Promise<boolean> {
  try {
    const result = await queryOne(
      `SELECT COUNT(*) as count 
       FROM information_schema.tables 
       WHERE table_schema = DATABASE() AND table_name = ?`,
      [tableName]
    )
    return result && result.count > 0
  } catch (error) {
    console.warn(`테이블 ${tableName} 존재 여부 확인 실패:`, error)
    return false
  }
}

/**
 * 현재 사용자 세션 정보 조회 (다른 컴포넌트에서 사용 가능)
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session-token')?.value

    if (!sessionToken) {
      return null
    }

    const user = await queryOne(
      `SELECT id, name, username, role, email, phone, last_activity_at
       FROM users 
       WHERE session_token = ? AND session_expires_at > NOW()`,
      [sessionToken]
    )

    return user
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

/**
 * 비밀번호 변경 이력 조회 (보안 감사용)
 */
export async function getPasswordChangeHistory(limit: number = 10) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session-token')?.value

    if (!sessionToken) {
      return []
    }

    const user = await queryOne(
      'SELECT id FROM users WHERE session_token = ?',
      [sessionToken]
    )

    if (!user) {
      return []
    }

    // admin_actions 테이블에서 비밀번호 변경 이력 조회
    const history = await query(
      `SELECT created_at, reason, metadata
       FROM admin_actions 
       WHERE admin_id = ? AND action_type = 'password_change'
       ORDER BY created_at DESC
       LIMIT ?`,
      [user.id, limit]
    )

    return history || []
  } catch (error) {
    console.error('Get password change history error:', error)
    return []
  }
}