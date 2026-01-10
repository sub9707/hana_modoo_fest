// src/components/online-festival/Quiz/LoginRequired.tsx
'use client'

import { memo } from 'react'
import {  Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const LoginRequired = memo(() => {
  const router = useRouter()

  const handleLoginClick = () => {
    // 현재 페이지를 redirect 파라미터로 전달
    const currentPath = window.location.pathname
    router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)
  }

  const handleRegisterClick = () => {
    const currentPath = window.location.pathname
    router.push(`/register?redirect=${encodeURIComponent(currentPath)}`)
  }

  return (
    <div className="min-h-screen p-8 md:p-12 relative">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center mb-4">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-yellow-300 bg-clip-text text-transparent">
            모두하나 퀴즈 이벤트
          </h1>
        </div>
        <p className="text-md sm:text-lg text-gray-600 mb-2">
          가족과 관련된 다양한 퀴즈를 풀어보세요!
        </p>
        <p className="text-sm text-gray-500">
          아래 퀴즈는 여러번 풀 수 있고, 만점 시 추첨을 통해 100명에게 경품을 제공합니다.
        </p>
      </div>

      {/* 로그인 필요 메시지 */}
      <div className="max-w-md mx-auto">
        <div className="bg-white/90 p-8 border border-white/20">
          {/* 아이콘 */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-100 to-red-100 rounded-full mb-4">
              <Shield className="w-10 h-10 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              로그인이 필요합니다
            </h2>
            <p className="text-gray-600 text-sm">
              퀴즈 이벤트에 참여하려면 먼저 로그인해주세요
            </p>
          </div>
            

          {/* 추가 안내 */}
          <div className="mt-6 pt-4 text-center">
            <p className="text-xs text-gray-500">
              로그인 후 바로 퀴즈에 참여할 수 있습니다
            </p>
          </div>
        </div>
      </div>
    </div>
  )
})

LoginRequired.displayName = 'LoginRequired'