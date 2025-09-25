'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Home, Users, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export default function AccountDeletedPage() {
  const searchParams = useSearchParams()
  const [showContent, setShowContent] = useState(false)
  const success = searchParams.get('success') === 'true'

  useEffect(() => {
    // 페이지 로드 후 약간의 딜레이를 두고 내용을 표시 (애니메이션 효과)
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  if (!success) {
    // 잘못된 접근
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
        <div className="max-w-md mx-auto text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">잘못된 접근</h1>
          <p className="text-gray-600 mb-6">
            올바르지 않은 방법으로 페이지에 접근했습니다.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <Home className="mr-2 h-5 w-5" />
            홈으로 가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 애니메이션 효과를 위한 래퍼 */}
      <div className={`transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="flex items-center justify-center min-h-screen py-8 px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* 성공 아이콘 */}
            <div className="mb-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
            </div>

            {/* 메인 메시지 */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              회원탈퇴가 완료되었습니다
            </h1>
            
            <div className="text-lg text-gray-600 mb-8 space-y-2">
              <p>모두하나대축제 2025를 이용해 주셔서 감사했습니다.</p>
              <p>귀하의 모든 개인정보가 안전하게 삭제되었습니다.</p>
            </div>

            {/* 처리 완료 내용 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8 text-left">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">처리 완료된 항목</h2>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>계정 정보 완전 삭제 (이름, 전화번호, 이메일 등)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>SNS 계정 연결 해제 (네이버, 카카오)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>세션 및 인증 정보 삭제</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>전화번호 인증 기록 삭제</span>
                </li>
              </ul>
            </div>

            {/* 재가입 안내 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">재가입 안내</h3>
              <div className="text-sm text-blue-800 space-y-2">
                <p>• 동일한 전화번호나 SNS 계정으로 언제든 재가입하실 수 있습니다.</p>
                <p>• 다만, 악의적인 가입/탈퇴 반복 시 일시적으로 가입이 제한될 수 있습니다.</p>
                <p>• 재가입 시에는 새로운 계정으로 처리되며, 이전 정보는 복구되지 않습니다.</p>
              </div>
            </div>

            {/* 피드백 섹션 */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">서비스 개선을 위한 의견</h3>
              <p className="text-sm text-gray-600 mb-4">
                탈퇴 사유를 제공해 주셔서 감사합니다. 
                귀하의 의견은 더 나은 서비스 제공을 위해 소중히 활용하겠습니다.
              </p>
              <div className="flex items-center text-xs text-gray-500">
                <Users className="h-3 w-3 mr-1" />
                <span>개인정보는 완전히 삭제되었으며, 통계 목적으로만 활용됩니다.</span>
              </div>
            </div>

            {/* 액션 버튼들 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Home className="mr-2 h-5 w-5" />
                홈페이지로 가기
              </Link>
              
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Users className="mr-2 h-5 w-5" />
                새로 가입하기
              </Link>
            </div>

            {/* 하단 메시지 */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                모두하나대축제 2025를 이용해 주셔서 진심으로 감사드립니다. 
                앞으로 더 나은 서비스로 찾아뵙겠습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}