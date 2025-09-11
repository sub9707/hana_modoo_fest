import { Role } from '@/types/auth'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { cache } from 'react'

export const createClient = cache(async () => {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // 서버 컴포넌트에서는 쿠키 설정이 실패할 수 있음
          }
        },
      },
    }
  )
})

// 현재 로그인된 사용자 정보 가져오기 (캐시됨)
export const getCurrentUser = cache(async () => {
  const supabase = await createClient()
  const cookieStore = await cookies()
  
  const sessionToken = cookieStore.get('session-token')?.value
  
  if (!sessionToken) {
    return null
  }

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('session_token', sessionToken)
      .maybeSingle() // single() 대신 maybeSingle() 사용

    if (error || !user) {
      return null
    }

    // 세션 만료 확인
    if (user.session_expires_at && new Date(user.session_expires_at) < new Date()) {
      // 만료된 세션 정리
      await supabase
        .from('users')
        .update({ session_token: null, session_expires_at: null })
        .eq('id', user.id)
      
      return null
    }

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      gender: user.gender,
      birth_date: user.birth_date,
      phone: user.phone,
      role: user.role,
      created_at: user.created_at,
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

  const roleHierarchy:Record<Role, number> = {
    'user': 1,
    'editor': 2,
    'admin': 3
  }

  return roleHierarchy[user.role as Role] >= roleHierarchy[requiredRole]
})