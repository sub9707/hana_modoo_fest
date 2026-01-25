import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/mysql/server'
import { ArrowLeft, Shield, Lock, Mail } from 'lucide-react'
import Link from 'next/link'
import PageLayout from '@/components/layout/PageLayout'
import { PAGE_SEO, createPageMetadata } from '@/constants'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = createPageMetadata(
  PAGE_SEO.changePasswordOptions.title,
  PAGE_SEO.changePasswordOptions.description,
  { noIndex: true }
)

export default async function ChangePasswordOptionsPage() {
  const user = await getCurrentUser()  //   기존 함수 사용
  
  if (!user) {
    redirect('/login?redirect=/my-page/change-password-options')
  }

  if (user.signup_method !== 'phone') {
    redirect('/my-page?error=sns-user-cannot-change-password')
  }

  const hasEmail = !!user.email

  return (
    <PageLayout variant="gray" className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Shield className="w-8 h-8 mr-3 text-blue-600" />
            비밀번호 변경 방법 선택
          </h1>
          <p className="mt-2 text-gray-600">
            계정 보안을 위해 비밀번호를 변경하세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 현재 비밀번호로 변경 */}
          <Link
            href="/my-page/change-password"
            className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-500"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100">
                  <Lock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">
                  현재 비밀번호로 변경
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  현재 비밀번호를 알고 있는 경우 사용하세요
                </p>
                <ul className="mt-3 text-xs text-gray-500 space-y-1">
                  <li>• 빠르고 간편한 변경</li>
                  <li>• 현재 비밀번호 필요</li>
                  <li>• 즉시 변경 가능</li>
                </ul>
              </div>
            </div>
          </Link>

          {/* 이메일 인증으로 변경 */}
          <div className={`block bg-white rounded-lg shadow-md p-6 border-2 ${
            hasEmail 
              ? 'hover:shadow-lg transition-shadow border-transparent hover:border-green-500'
              : 'border-gray-200 opacity-60'
          }`}>
            {hasEmail ? (
              <Link href="/my-page/change-password-with-email" className="block">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100">
                      <Mail className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      이메일 인증으로 변경
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      현재 비밀번호를 잊었을 때 사용하세요
                    </p>
                    <ul className="mt-3 text-xs text-gray-500 space-y-1">
                      <li>• 이메일 인증 필요</li>
                      <li>• 현재 비밀번호 불필요</li>
                      <li>• 안전한 본인 확인</li>
                    </ul>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gray-100">
                    <Mail className="h-6 w-6 text-gray-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-500">
                    이메일 인증으로 변경
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    이메일 등록이 필요합니다
                  </p>
                  <Link 
                    href="/my-page/register-email"
                    className="mt-3 inline-flex items-center text-xs text-blue-600 hover:text-blue-700"
                  >
                    이메일 등록하러 가기 →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">보안 안내</h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• 주기적으로 비밀번호를 변경하여 계정을 안전하게 보호하세요</li>
            <li>• 강력한 비밀번호는 영문, 숫자, 특수문자를 모두 포함합니다</li>
            <li>• 다른 사이트와 동일한 비밀번호를 사용하지 마세요</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  )
}