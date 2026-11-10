import { Metadata } from 'next'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/mysql/server'
import { ChangePasswordForm } from '@/components/forms/ChangePasswordForm'
import { ArrowLeft, Shield, Lock } from 'lucide-react'
import Link from 'next/link'
import PageLayout from '@/components/layout/PageLayout'
import { PAGE_SEO, createPageMetadata } from '@/constants'

export const metadata: Metadata = createPageMetadata(
  PAGE_SEO.changePassword.title,
  PAGE_SEO.changePassword.description,
  { noIndex: true }
)

export const dynamic = 'force-dynamic'
export const revalidate = 0

// 로딩 컴포넌트
function ChangePasswordSkeleton() {
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 스켈레톤 */}
        <div className="mb-8">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
        </div>
        
        {/* 폼 스켈레톤 */}
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-40 mb-6"></div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mb-2"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse w-full"></div>
              </div>
            ))}
            <div className="flex gap-3 pt-4">
              <div className="h-12 bg-gray-200 rounded animate-pulse flex-1"></div>
              <div className="h-12 bg-gray-200 rounded animate-pulse flex-1"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 메인 페이지 컴포넌트
export default async function ChangePasswordPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?redirect=/my-page/change-password')
  }

  return (
    <PageLayout variant="gray" className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              href="/my-page"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              마이페이지로 돌아가기
            </Link>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">비밀번호 변경</h1>
              <p className="text-gray-600 mt-1">
                계정 보안을 위해 정기적으로 비밀번호를 변경하세요
              </p>
            </div>
          </div>
        </div>

        {/* 사용자 정보 표시 */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <Shield className="w-5 h-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                현재 로그인: {user.name} ({user.username})
              </p>
              <p className="text-xs text-blue-700">
                마지막 로그인: {user.last_login_at ? 
                  new Date(user.last_login_at).toLocaleString('ko-KR') : 
                  '정보 없음'
                }
              </p>
            </div>
          </div>
        </div>

        <Suspense fallback={<ChangePasswordSkeleton />}>
          <ChangePasswordForm isTestAccount={user.username === 'test_admin'} />
        </Suspense>

      </div>
    </PageLayout>
  )
}