// src/app/my-page/change-password/page.tsx
import { ChangePasswordForm } from '@/components/forms/ChangePasswordForm'
import { ClientWrapper } from '@/components/my-page/ClientWrapper'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '비밀번호 변경 | 모두하나대축제',
  description: '계정 비밀번호를 변경하세요',
}

// NextJS 15: 동적 렌더링 최적화
export const dynamic = 'force-dynamic'

export default function ChangePasswordPage() {
  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {/* 헤더 */}
          <div className="mb-6">
            <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
              <Link href="/my-page" className="hover:text-blue-600">
                마이페이지
              </Link>
              <span>/</span>
              <span className="text-gray-900">비밀번호 변경</span>
            </nav>
            
            <h1 className="text-2xl font-bold text-gray-900">비밀번호 변경</h1>
            <p className="text-gray-600 mt-1">
              보안을 위해 현재 비밀번호를 입력한 후 새 비밀번호로 변경하세요
            </p>
          </div>

          {/* 메인 컨텐츠 */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              {/* 보안 알림 */}
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg 
                      className="h-5 w-5 text-amber-400" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">
                      보안 주의사항
                    </h3>
                    <div className="mt-2 text-sm text-amber-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>비밀번호는 8자 이상으로 설정하세요</li>
                        <li>영문, 숫자, 특수문자를 조합하여 사용하세요</li>
                        <li>이전에 사용한 비밀번호는 재사용하지 마세요</li>
                        <li>다른 사이트와 동일한 비밀번호는 사용하지 마세요</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* 비밀번호 변경 폼 */}
              <ChangePasswordForm />
            </div>
          </div>

          {/* 하단 링크 */}
          <div className="mt-6 text-center">
            <Link 
              href="/my-page"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              마이페이지로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </ClientWrapper>
  )
}