// src/app/(site)/login/page.tsx
'use client'

import LoginForm from '@/components/forms/LoginForm'
import { useAuth } from '@/contexts/AuthContext'
import { redirect, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const { user, isLoading } = useAuth()
  const searchParams = useSearchParams()
  const message = searchParams.get("message")
  
  // callbackUrl과 redirect 모두 지원
  const callbackUrl = searchParams.get("callbackUrl")
  const redirectParam = searchParams.get("redirect")
  const redirectPath = callbackUrl || redirectParam || "/"

  useEffect(() => {
    if (!isLoading && user) {
      // 로그인 완료 → 원래 요청한 페이지로
      redirect(redirectPath)
    }
  }, [user, isLoading, redirectPath])

  useEffect(() => {
    if (message) {
      alert(decodeURIComponent(message))
    }
  }, [message])

  // 로딩 중이거나 리다이렉트 중이면 로딩 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 font-paper" >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return null // 리다이렉트 중
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 font-paper">
      <div className="w-full max-w-md space-y-8 -mt-16">
        <LoginForm redirectTo={redirectPath} />
      </div>
    </div>
  )
}