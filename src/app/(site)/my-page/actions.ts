'use server'

import { cookies } from 'next/headers'
import { query } from '@/lib/mysql/connection'
import { revalidateTag } from 'next/cache'

/**
 * 사용자 활동 시간 업데이트
 */
export async function updateUserActivity(): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session-token')?.value

    if (!sessionToken) {
      return {
        success: false,
        error: '인증이 필요합니다.'
      }
    }

    // 현재 시간으로 업데이트
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
    
    const result = await query(
      'UPDATE users SET last_activity_at = ?, updated_at = ? WHERE session_token = ?',
      [now, now, sessionToken]
    )

    if (result.affectedRows === 0) {
      return {
        success: false,
        error: '사용자를 찾을 수 없습니다.'
      }
    }

    // 캐시 무효화
    revalidateTag('user-info')

    return {
      success: true
    }

  } catch (error) {
    console.error('Update user activity error:', error)
    return {
      success: false,
      error: '활동 시간 업데이트에 실패했습니다.'
    }
  }
}