// src/app/(site)/my-page/change-password-with-email/page.tsx
import { Metadata } from 'next'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { queryOne } from '@/lib/mysql/connection'
import { EmailBasedPasswordChangeForm } from '@/components/forms/EmailBasedPasswordChangeForm'
import { ArrowLeft, Shield } from 'lucide-react'
import Link from 'next/link'

// NextJS 15: 메타데이터 최적화
export const metadata: Metadata = {
  title: '이메일 인증으로 비밀번호 변경 | 모두하나축제',
  description: '이메일 인증을 통해 비밀번호를 변경하세요',
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

// 로딩 컴포넌트
function ChangePasswordSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
        </div>
        
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-40 mb-6"></div>
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mb-2"></div>
                <div className="h-12 bg-gray-200 rounded animate-pulse w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// 메인 페이지 컴포넌트
export default async function ChangePasswordWithEmailPage() {
  // 사용자 인증 확인
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login?redirect=/my-page/change-password-with-email')
  }

  // SNS 로그인 사용자는 접근 불가
  if (user.signup_method !== 'phone') {
    redirect('/my-page?error=sns-user-cannot-change-password')
  }

  // 이메일이 등록되지 않은 경우
  if (!user.email) {
    redirect('/my-page?error=email-not-registered')
  }

  return (
    <Suspense fallback={<ChangePasswordSkeleton />}>
      <div className="min-h-screen bg-gray-50 py-8 font-paper">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 페이지 헤더 */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Link
                href="/my-page/change-password-options"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                다른 방법 선택
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Shield className="w-8 h-8 mr-3 text-blue-600" />
              이메일 인증으로 비밀번호 변경
            </h1>
            <p className="mt-2 text-gray-600">
              등록된 이메일로 인증을 완료하고 새 비밀번호를 설정하세요
            </p>
          </div>

          {/* 폼 */}
          <EmailBasedPasswordChangeForm userEmail={user.email} />
        </div>
      </div>
    </Suspense>
  )
}