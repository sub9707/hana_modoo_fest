'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-orange-50 px-4">
      <div className="max-w-lg w-full text-center">
        {/* 에러 아이콘 */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          문제가 발생했습니다
        </h1>
        
        <p className="text-lg text-slate-600 mb-8">
          일시적인 오류가 발생했습니다.<br />
          잠시 후 다시 시도해주세요.
        </p>
        
        {/* 개발 환경에서만 에러 상세 정보 표시 */}
        {isDevelopment && (
          <div className="bg-slate-100 rounded-lg p-4 mb-8 text-left">
            <h3 className="font-semibold text-slate-900 mb-2">에러 정보 (개발용)</h3>
            <p className="text-sm text-slate-700 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-slate-500 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}
        
        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={reset}
            className="bg-blue-600 hover:bg-blue-700 px-6"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            다시 시도
          </button>
          
          <button className="px-6">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              홈으로 돌아가기
            </Link>
          </button>
        </div>
        
        {/* 문의 안내 */}
        <div className="mt-12 p-6 bg-white rounded-lg border">
          <h3 className="font-semibold text-slate-900 mb-3">
            문제가 계속될 경우
          </h3>
          <div className="space-y-2 text-sm text-slate-600">
            <p>
              <span className="font-medium">전화:</span> 
              <a href="tel:02-861-3020" className="text-blue-600 hover:text-blue-700 ml-1">
                02-861-3020
              </a>
            </p>
            <p>
              <span className="font-medium">이메일:</span>
              <a href="mailto:hanbumo1@seoul.go.kr" className="text-blue-600 hover:text-blue-700 ml-1">
                hanbumo1@seoul.go.kr
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}