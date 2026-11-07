import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/mysql/server'
import LoginForm from '@/components/forms/LoginForm'
import { cookies } from 'next/headers'
import LoginMessageDisplay from '@/components/auth/LoginMessageDisplay'
import PageLayout from '@/components/layout/PageLayout'
import { PAGE_SEO, createPageMetadata } from '@/constants'

export const metadata: Metadata = createPageMetadata(
  PAGE_SEO.login.title,
  PAGE_SEO.login.description,
  { noIndex: true }
)

// 캐시 무효화
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  searchParams: Promise<{
    message?: string
    session_expired?: string
    callbackUrl?: string
    redirect?: string
  }>
}

export default async function LoginPage({ searchParams }: PageProps) {

  // 서버에서 사용자 확인
  const user = await getCurrentUser()
  const params = await searchParams


  // 이미 로그인된 사용자는 리다이렉트
  if (user) {
    const redirectPath = params.callbackUrl || params.redirect || '/'
    redirect(redirectPath)
  }

  const redirectPath = params.callbackUrl || params.redirect || '/'

  return (
    <PageLayout variant="gray" className="flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 -mt-16">
        {/* 메시지 표시를 위한 Client Component 추가 */}
        <LoginMessageDisplay
          message={params.message}
          sessionExpired={params.session_expired}
        />
        <LoginForm redirectTo={redirectPath} />
      </div>
    </PageLayout>
  )
}