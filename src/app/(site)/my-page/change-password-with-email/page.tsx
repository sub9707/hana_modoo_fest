import { Metadata } from 'next'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/mysql/server'
import { EmailBasedPasswordChangeForm } from '@/components/forms/EmailBasedPasswordChangeForm'
import { ArrowLeft, Shield } from 'lucide-react'
import Link from 'next/link'
import PageLayout from '@/components/layout/PageLayout'
import { PAGE_SEO, createPageMetadata } from '@/constants'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = createPageMetadata(
  PAGE_SEO.changePasswordWithEmail.title,
  PAGE_SEO.changePasswordWithEmail.description,
  { noIndex: true }
)

export default async function ChangePasswordWithEmailPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login?redirect=/my-page/change-password-with-email')
  }

  if (user.signup_method !== 'phone') {
    redirect('/my-page?error=sns-user-cannot-change-password')
  }

  if (!user.email) {
    redirect('/my-page/register-email?redirect=/my-page/change-password-with-email')
  }

  return (
    <PageLayout variant="gray" className="py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              href="/my-page/change-password-options"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              뒤로 가기
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Shield className="w-8 h-8 mr-3 text-green-600" />
            이메일 인증으로 비밀번호 변경
          </h1>
          <p className="mt-2 text-gray-600">
            등록된 이메일로 인증번호를 받아 비밀번호를 변경하세요
          </p>
        </div>

        <Suspense fallback={
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        }>
          <EmailBasedPasswordChangeForm userEmail={user.email} />
        </Suspense>
      </div>
    </PageLayout>
  )
}