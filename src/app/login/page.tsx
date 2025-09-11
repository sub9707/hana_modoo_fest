'use client'

import LoginForm from '@/components/forms/LoginForm'
import { useAuth } from '@/contexts/AuthContext'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && user) {
      redirect('/dashboard')
    }
  }, [user, isLoading])

  // 로딩 중이거나 리다이렉트 중이면 로딩 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 -mt-16">
        <LoginForm />
      </div>
    </div>
  )
}