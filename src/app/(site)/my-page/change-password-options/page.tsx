// src/app/(site)/my-page/change-password-options/page.tsx
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { queryOne } from '@/lib/mysql/connection'
import { ArrowLeft, Shield, Lock, Mail } from 'lucide-react'
import Link from 'next/link'

// NextJS 15: 메타데이터 최적화
export const metadata: Metadata = {
  title: '비밀번호 변경 방법 선택 | 모두하나축제',
  description: '비밀번호 변경 방법을 선택하세요',
  robots: {
    index: false,
    follow: false
  }
}

// 사용자 인증 확인
async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session-token')?.value

    if (!sessionToken) {
      return null
    }

    const user = await queryOne(
      `SELECT id, name, username, role, email, signup_method
       FROM users 
       WHERE session_token = ? AND session_expires_at > NOW()`,
      [sessionToken]
    )

    return user
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

export default async function ChangePasswordOptionsPage() {
  // 사용자 인증 확인
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login?redirect=/my-page/change-password-options')
  }

  // SNS 로그인 사용자는 비밀번호 변경 불가
  if (user.signup_method !== 'phone') {
    redirect('/my-page?error=sns-user-cannot-change-password')
  }

  const hasEmail = !!user.email

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-paper">
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
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Shield className="w-8 h-8 mr-3 text-blue-600" />
            비밀번호 변경 방법 선택
          </h1>
          <p className="mt-2 text-gray-600">
            계정 보안을 위해 비밀번호를 변경하세요
          </p>
        </div>

        {/* 옵션 카드들 */}
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
              ? 'hover:shadow-lg transition-shadow border-transparent hover:border-green-500 cursor-pointer'
              : 'border-gray-200 opacity-60 cursor-not-allowed'
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
                      비밀번호를 잊어버린 경우 사용하세요
                    </p>
                    <ul className="mt-3 text-xs text-gray-500 space-y-1">
                      <li>• 이메일 인증 필요</li>
                      <li>• 현재 비밀번호 불필요</li>
                      <li>• 안전한 본인 확인</li>
                    </ul>
                    <p className="mt-3 text-xs text-green-600 font-medium">
                      등록된 이메일: {user.email}
                    </p>
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
                  <h3 className="text-lg font-medium text-gray-400">
                    이메일 인증으로 변경
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    이메일을 먼저 등록해야 사용할 수 있습니다
                  </p>
                  <Link
                    href="/my-page"
                    className="mt-3 inline-block text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    마이페이지에서 이메일 등록하기 →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 안내사항 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-blue-900 mb-3 flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            보안 안내
          </h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• 비밀번호는 영문, 숫자, 특수문자를 모두 포함하여 8자 이상으로 설정해주세요</li>
            <li>• 다른 사이트와 동일한 비밀번호를 사용하지 마세요</li>
            <li>• 비밀번호를 잊어버렸다면 이메일 인증을 통해 변경할 수 있습니다</li>
            {!hasEmail && (
              <li className="text-orange-700 font-medium">
                • 이메일을 등록하면 비밀번호를 잊어버렸을 때 쉽게 재설정할 수 있습니다
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}