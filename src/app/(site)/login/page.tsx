import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/mysql/server'
import LoginForm from '@/components/forms/LoginForm'
import { cookies } from 'next/headers'
import LoginMessageDisplay from '@/components/auth/LoginMessageDisplay'

export const metadata: Metadata = {
  title: '로그인',
  description: '모두하나대축제 2025 로그인',
}

// ✅ 캐시 무효화
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  searchParams: {
    message?: string
    session_expired?: string
    callbackUrl?: string
    redirect?: string
  }
}

export default async function LoginPage({ searchParams }: PageProps) {
  console.log('[LoginPage] 페이지 로드')
  
  // ✅ 서버에서 사용자 확인
  const user = await getCurrentUser()
  
  // ✅ 세션 만료 파라미터가 있으면 쿠키 강제 삭제
  const params = await searchParams
  if (params.session_expired === 'true') {
    console.log('[LoginPage] 세션 만료 - 쿠키 삭제')
    const cookieStore = await cookies()
    cookieStore.delete('session-token')
  }
  
  // ✅ 이미 로그인된 사용자는 리다이렉트
  if (user) {
    const redirectPath = params.callbackUrl || params.redirect || '/'
    console.log('[LoginPage] 이미 로그인됨 - 리다이렉트:', redirectPath)
    redirect(redirectPath)
  }
  
  const redirectPath = params.callbackUrl || params.redirect || '/'
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 font-paper">
      <div className="w-full max-w-md space-y-8 -mt-16">
        {/* ✅ 메시지 표시를 위한 Client Component 추가 */}
        <LoginMessageDisplay
          message={params.message}
          sessionExpired={params.session_expired}
        />
        <LoginForm redirectTo={redirectPath} />
      </div>
    </div>
  )
}