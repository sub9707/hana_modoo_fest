import { Role, User } from '@/types/auth'
import { createBrowserClient } from '@supabase/ssr'

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

// 클라이언트에서 현재 사용자 정보 가져오기
export const getCurrentUserClient = async (): Promise<User | null> => {
  const supabase = createClient()
  
  // 쿠키에서 세션 토큰 읽기
  const sessionToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('session-token='))
    ?.split('=')[1]


  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, username, gender, birth_date, phone, role, created_at, last_login_at, last_activity_at')
      .eq('session_token', sessionToken)
      .maybeSingle()


    if (error || !user) {
      return null
    }

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      gender: user.gender as User['gender'],
      birth_date: user.birth_date,
      phone: user.phone,
      role: user.role as Role,
      created_at: user.created_at,
      last_login_at: user.last_login_at,
      last_activity_at: user.last_activity_at,
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}