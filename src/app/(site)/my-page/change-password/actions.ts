// src/app/my-page/change-password/actions.ts
'use server'

import { cookies } from 'next/headers'
import { createHash, randomBytes } from 'crypto'
import { queryOne, query } from '@/lib/mysql/connection'
import { revalidateTag } from 'next/cache'
import { changePasswordSchema, type ChangePasswordData } from '@/lib/validations/auth'

interface PasswordChangeResponse {
  success: boolean
  error?: string
  message?: string
}

// NextJS 15: Server Action 최적화
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

    // 세션 토큰 확인
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
      `SELECT id, password_hash, password_salt, session_expires_at 
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
       SET password_hash = ?, password_salt = ?, updated_at = ?
       WHERE id = ?`,
      [
        finalNewPasswordHash,
        newSalt,
        new Date().toISOString().slice(0, 19).replace('T', ' '),
        user.id
      ]
    )

    // NextJS 15: 캐시 무효화
    revalidateTag('user-info')

    // 보안 로그 기록 (선택사항)
    await logPasswordChange(user.id)

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

// 비밀번호 변경 로그 기록 (선택사항)
async function logPasswordChange(userId: string): Promise<void> {
  try {
    // admin_actions 테이블이나 별도 로그 테이블에 기록
    // 현재는 콘솔에만 기록
    console.log(`Password changed for user: ${userId} at ${new Date().toISOString()}`)
    
    // 실제 구현 시에는 아래와 같이 DB에 기록
    /*
    await query(
      `INSERT INTO password_change_logs (user_id, changed_at, ip_address, user_agent)
       VALUES (?, ?, ?, ?)`,
      [userId, new Date().toISOString().slice(0, 19).replace('T', ' '), getClientIP(), getUserAgent()]
    )
    */
  } catch (error) {
    console.error('Log password change error:', error)
    // 로그 기록 실패는 비밀번호 변경 성공에 영향을 주지 않음
  }
}

// 비밀번호 강도 점수 계산 (클라이언트에서 사용할 수 있는 유틸리티)
export function calculatePasswordStrength(password: string): {
  score: number
  feedback: string[]
  isStrong: boolean
} {
  let score = 0
  const feedback: string[] = []

  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push('8자 이상 사용하세요')
  }

  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push('소문자를 포함하세요')
  }

  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push('대문자를 포함하세요')
  }

  if (/\d/.test(password)) {
    score += 1
  } else {
    feedback.push('숫자를 포함하세요')
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1
  } else {
    feedback.push('특수문자를 포함하세요')
  }

  if (password.length >= 12) {
    score += 1
  }

  return {
    score,
    feedback,
    isStrong: score >= 4
  }
}