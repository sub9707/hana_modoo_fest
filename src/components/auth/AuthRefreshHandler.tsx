'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export function AuthRefreshHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { refreshUser } = useAuth()

  useEffect(() => {
    const authRefresh = searchParams.get('auth_refresh')
    const signupSuccess = searchParams.get('signup_success')
    
    if (authRefresh === 'true' || signupSuccess === 'true') {
      // URL에서 파라미터 제거
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('auth_refresh')
      newUrl.searchParams.delete('signup_success')
      router.replace(newUrl.pathname + newUrl.search)
      
      // 인증 상태 새로고침
      console.log('AuthRefreshHandler: Refreshing user state')
      setTimeout(() => {
        refreshUser()
      }, 100)
    }
  }, [searchParams, router, refreshUser])

  return null
}