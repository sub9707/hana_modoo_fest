'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Home, Users, Clock } from 'lucide-react'

export default function AccountDeletedPage() {
  const searchParams = useSearchParams()
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const successParam = searchParams.get('success')
    if (successParam === 'true') {
      setSuccess(true)
    }
  }, [searchParams])

  if (!success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">잘못된 접근입니다.</p>
          <Link 
            href="/" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            홈으로 가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full">
        {/* 성공 아이콘 */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            회원탈퇴가 완료되었습니다
          </h1>
          <p className="text-gray-600">
            그동안 모두하나대축제를 이용해주셔서 감사했습니다.
          </p>
        </div>

        {/* 안내 메시지 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">탈퇴 완료 안내</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-700">
                  모든 개인정보가 안전하게 삭제되었습니다
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-700">
                  SNS 계정 연결이 해제되었습니다
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-700">
                  모든 로그인 세션이 종료되었습니다
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 재가입 제한 안내 */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <Clock className="h-5 w-5 text-amber-400 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-amber-800 mb-1">
                재가입 제한 안내
              </h3>
              <p className="text-sm text-amber-700">
                탈퇴 후 <strong>12시간 이내</strong>에는 동일한 정보로 재가입하실 수 없습니다.
                12시간 후 다시 가입을 원하시면 언제든지 회원가입을 진행해주세요.
              </p>
            </div>
          </div>
        </div>

        {/* 피드백 요청 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <Users className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-800 mb-1">
                서비스 개선을 위한 부탁
              </h3>
              <p className="text-sm text-blue-700">
                더 나은 서비스를 위해 탈퇴 사유와 개선사항을 알려주시면 큰 도움이 됩니다.
                언제든지 고객센터로 의견을 전해주세요.
              </p>
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="space-y-3">
          <Link
            href="/"
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
          >
            <Home className="h-4 w-4 mr-2" />
            홈페이지로 이동
          </Link>
          
          <Link
            href="/register"
            className="w-full bg-gray-200 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
          >
            <Users className="h-4 w-4 mr-2" />
            다시 회원가입 (12시간 후)
          </Link>
        </div>

        {/* 하단 안내 */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            앞으로도 모두하나대축제에 많은 관심 부탁드립니다.
          </p>
        </div>
      </div>
    </div>
  )
}