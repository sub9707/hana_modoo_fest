'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home, Bug, Copy, Check } from 'lucide-react'
import { logger } from '@/lib/logging/logger'
import { useState } from 'react'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // 간단한 에러 로깅만
    logger.error('Application Error', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      component: 'error-page'
    })
  }, [error])

  const isDevelopment = process.env.NODE_ENV === 'development'
  const errorId = error.digest || `error_${Date.now()}`

  const copyErrorId = async () => {
    try {
      await navigator.clipboard.writeText(errorId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // 클립보드 API 실패 시 대체 방법
      const textArea = document.createElement('textarea')
      textArea.value = errorId
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center border border-red-100">
          {/* 에러 아이콘 */}
          <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-8 relative">
            <AlertTriangle className="w-12 h-12 text-red-600" />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <Bug className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            앗! 문제가 발생했어요
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            예상치 못한 오류가 발생했습니다.<br />
            불편을 드려 죄송합니다. 잠시 후 다시 시도해주세요.
          </p>
          
          {/* 에러 ID */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-8">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">오류 ID</p>
              <button
                onClick={copyErrorId}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? '복사됨' : '복사'}</span>
              </button>
            </div>
            <p className="font-mono text-sm text-gray-700 bg-white px-3 py-2 rounded-lg border break-all">
              {errorId}
            </p>
          </div>
          
          {/* 개발 환경에서만 에러 상세 정보 표시 */}
          {isDevelopment && (
            <details className="bg-red-50 rounded-2xl p-6 mb-8 text-left border border-red-200">
              <summary className="font-semibold text-red-800 cursor-pointer hover:text-red-900 mb-4">
                개발자 정보 (클릭하여 상세 보기)
              </summary>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-red-800 mb-2">에러 메시지:</h4>
                  <p className="text-sm text-red-700 font-mono bg-white p-3 rounded-lg border break-all">
                    {error.message}
                  </p>
                </div>
                {error.stack && (
                  <div>
                    <h4 className="font-medium text-red-800 mb-2">스택 트레이스:</h4>
                    <pre className="text-xs text-red-700 font-mono bg-white p-3 rounded-lg border overflow-auto max-h-40 whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}
          
          {/* 액션 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button 
              onClick={reset}
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              다시 시도
            </button>
            
            <Link 
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-2xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Home className="w-5 h-5 mr-2" />
              홈으로 돌아가기
            </Link>
          </div>
          
          {/* 문의 안내 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="font-bold text-gray-900 mb-4">문제가 계속될 경우</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-gray-600">전화:</span>
                <a 
                  href="tel:02-123-4567" 
                  className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                >
                  02-123-4567
                </a>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-gray-600">이메일:</span>
                <a 
                  href="mailto:info@moduhana2025.seoul.kr" 
                  className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                >
                  문의하기
                </a>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              오류 ID를 함께 알려주시면 더 빠른 해결이 가능합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}