// src/app/my-page/page.tsx
import { Suspense } from 'react'
import { Metadata } from 'next'
import { getUserInfo } from './actions'
import { ClientWrapper } from '@/components/my-page/ClientWrapper'
import { LoadingSkeleton } from '@/components/my-page/LoadingSkeleton'
import { MyPageContent } from '@/components/my-page/MyPageContent'

export const metadata: Metadata = {
  title: '마이페이지 | 모두하나대축제',
  description: '사용자 정보를 확인하고 관리하세요',
}

// NextJS 15: 향상된 캐싱 사용
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function MyPage() {
  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md">
            <div className="border-b border-gray-200 px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-900">마이페이지</h1>
              <p className="text-gray-600 mt-1">계정 정보를 확인하고 관리하세요</p>
            </div>
            
            <Suspense fallback={<LoadingSkeleton />}>
              <MyPageContentWrapper />
            </Suspense>
          </div>
        </div>
      </div>
    </ClientWrapper>
  )
}

// NextJS 15: 서버 컴포넌트 최적화
async function MyPageContentWrapper() {
  try {
    const userInfo = await getUserInfo()
    
    if (!userInfo.success || !userInfo.user) {
      return <LoginRedirectComponent error={userInfo.error} />
    }

    return <MyPageContent user={userInfo.user} />
  } catch (error) {
    console.error('MyPage error:', error)
    return <LoginRedirectComponent error="오류가 발생했습니다. 잠시 후 다시 시도해주세요." />
  }
}

// 로그인 리다이렉트 컴포넌트
function LoginRedirectComponent({ error }: { error?: string }) {
  return (
    <div className="p-6">
      <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800">로그인이 필요합니다</h3>
            <div className="mt-2 text-sm text-amber-700">
              <p>마이페이지에 접근하려면 로그인이 필요합니다.</p>
              {error && <p className="mt-1 text-amber-600">{error}</p>}
            </div>
            <div className="mt-4">
              <a
                href="/login?callbackUrl=/my-page"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                로그인하기
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}