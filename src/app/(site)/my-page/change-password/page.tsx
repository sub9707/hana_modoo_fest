// src/app/(site)/my-page/change-password/page.tsx
import { Metadata } from 'next'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { queryOne } from '@/lib/mysql/connection'
import { ChangePasswordForm } from '@/components/forms/ChangePasswordForm'
import { ArrowLeft, Shield, Lock } from 'lucide-react'
import Link from 'next/link'

// NextJS 15: 메타데이터 최적화
export const metadata: Metadata = {
  title: '비밀번호 변경 | 모두하나축제',
  description: '계정 보안을 위해 비밀번호를 변경하세요.',
  robots: {
    index:false,
    follow:false
  }
}

// NextJS 15: 향상된 사용자 인증 확인
async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session-token')?.value

    if (!sessionToken) {
      return null
    }

    const user = await queryOne(
      `SELECT id, name, username, role, last_login_at
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
  // 사용자 인증 확인
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/login?redirect=/my-page/change-password')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
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

        {/* NextJS 15: Suspense를 활용한 비동기 로딩 */}
        <Suspense fallback={<ChangePasswordSkeleton />}>
          <ChangePasswordForm />
        </Suspense>

      </div>
    </div>
  )
}

// NextJS 15: 정적 생성 비활성화 (개인 설정 페이지이므로)
export const dynamic = 'force-dynamic'
export const revalidate = 0