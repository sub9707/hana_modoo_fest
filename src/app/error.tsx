'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Application Error:', error)
  }, [error])

  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-orange-100 to-pink-100 px-4 py-8 font-paper">
      <div className="max-w-md w-full">
        {/* 메인 에러 카드 */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 text-center relative overflow-hidden">
          {/* 배경 장식 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full blur-3xl opacity-50 -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-50 -ml-16 -mb-16"></div>
          
          {/* 에러 아이콘 */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <AlertTriangle className="w-10 h-10 text-red-600" strokeWidth={2.5} />
            </div>
          </div>
          
          {/* 제목 */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            앗, 문제가 발생했어요
          </h1>
          
          {/* 설명 */}
          <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed">
            일시적인 오류가 발생했습니다.<br />
            페이지를 새로고침하면 해결될 수 있어요.
          </p>
          
          {/* 새로고침 버튼 */}
          <button 
            onClick={reset}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-base sm:text-lg"
          >
            <RefreshCw className="w-5 h-5" />
            페이지 새로고침
          </button>
          
          {/* 개발 환경 에러 정보 */}
          {isDevelopment && (
            <div className="mt-6 bg-gray-50 rounded-xl p-4 text-left border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                개발자 정보
              </h3>
              <p className="text-xs text-gray-700 font-mono break-all leading-relaxed">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-gray-500 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}
        </div>
        
        {/* 문의 안내 카드 */}
        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/50">
          <h3 className="font-semibold text-gray-900 mb-4 text-center text-base sm:text-lg">
            문제가 계속될 경우 연락주세요
          </h3>
          <div className="space-y-3 text-sm sm:text-base">
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <span className="font-medium text-gray-900">전화</span>
              <span className="text-gray-400">|</span>
              <a 
                href="tel:02-861-3020" 
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                02-861-3020
              </a>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <span className="font-medium text-gray-900">이메일</span>
              <span className="text-gray-400">|</span>
              <a 
                href="mailto:hanbumo1@seoul.go.kr" 
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors break-all"
              >
                hanbumo1@seoul.go.kr
              </a>
            </div>
          </div>
        </div>

        {/* 추가 안내 메시지 */}
        <p className="text-center text-sm text-gray-500 mt-6">
          모두하나대축제 2025
        </p>
      </div>
    </div>
  )
}