// src/app/(site)/my-page/actions.ts
'use server'

import { cookies } from 'next/headers'
import { queryOne } from '@/lib/mysql/connection'
import { unstable_cache } from 'next/cache'
import { User } from '@/types/auth'

// NextJS 15: 향상된 캐싱을 위한 타입 정의
interface UserInfoResponse {
  success: boolean
  user?: User & {
    address?: string
    address_detail?: string
    zip_code?: string
  }
  error?: string
}

// NextJS 15: unstable_cache를 사용한 캐시 최적화
const getCachedUserInfo = unstable_cache(
  async (sessionToken: string): Promise<UserInfoResponse> => {
    return await fetchUserInfoFromDB(sessionToken)
  },
  ['user-info'], // 캐시 키
  {
    revalidate: 300, // 5분 캐시
    tags: ['user-info']
  }
)

async function fetchUserInfoFromDB(sessionToken: string): Promise<UserInfoResponse> {
  try {
    // 사용자 정보 조회 (주소 정보 포함)
    const user = await queryOne(
      `SELECT 
         id, name, username, company, gender, birth_date, phone, 
         address, address_detail, zip_code, email, profile_image,
         role, signup_method, last_login_at, last_activity_at, 
         created_at, updated_at, session_expires_at
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
      // 만료된 세션 정리
      await queryOne(
        'UPDATE users SET session_token = NULL, session_expires_at = NULL WHERE id = ?',
        [user.id]
      )
      
      return {
        success: false,
        error: '세션이 만료되었습니다. 다시 로그인해주세요.'
      }
    }

    // 민감한 정보 제거
    const { session_expires_at, ...safeUser } = user

    return {
      success: true,
      user: safeUser
    }

  } catch (error) {
    console.error('Get user info error:', error)
    return {
      success: false,
      error: '사용자 정보를 불러오는 중 오류가 발생했습니다.'
    }
  }
}

// 사용자 정보 조회 Server Action
export async function getUserInfo(): Promise<UserInfoResponse> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session-token')?.value

    if (!sessionToken) {
      return {
        success: false,
        error: '로그인이 필요합니다.'
      }
    }

    // NextJS 15: 캐시된 데이터 사용
    return await getCachedUserInfo(sessionToken)

  } catch (error) {
    console.error('getUserInfo action error:', error)
    return {
      success: false,
      error: '서버 오류가 발생했습니다.'
    }
  }
}

// 활동 시간 업데이트 Server Action
export async function updateUserActivity(): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session-token')?.value

    if (!sessionToken) {
      return {
        success: false,
        error: '로그인이 필요합니다.'
      }
    }

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
    
    await queryOne(
      'UPDATE users SET last_activity_at = ? WHERE session_token = ?',
      [now, sessionToken]
    )

    // 캐시 무효화
    // revalidateTag('user-info')

    return { success: true }

  } catch (error) {
    console.error('Update user activity error:', error)
    return {
      success: false,
      error: '활동 시간 업데이트 중 오류가 발생했습니다.'
    }
  }
}