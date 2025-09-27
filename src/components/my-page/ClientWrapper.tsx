// src/components/my-page/ClientWrapper.tsx
'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface ClientWrapperProps {
  children: React.ReactNode
}

export function ClientWrapper({ children }: ClientWrapperProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { refreshUser } = useAuth()
  const hasProcessedAuthRefresh = useRef(false)

  useEffect(() => {
    // URL 파라미터 확인
    const message = searchParams.get('message')
    const authRefresh = searchParams.get('auth_refresh')
    const loginSuccess = searchParams.get('login_success')
    
    // 로그인 성공 메시지
    if (loginSuccess === 'true') {
      // URL에서 파라미터 제거
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('login_success')
      router.replace(newUrl.pathname + newUrl.search)
      
      alert('로그인이 완료되었습니다.')
      return
    }

    // 로그인 필요 메시지가 있으면 alert 표시 후 로그인 페이지로
    if (message && !authRefresh) {
      const decodedMessage = decodeURIComponent(message)
      alert(decodedMessage)
      
      // 로그인 페이지로 리다이렉트 (callbackUrl 포함)
      const currentPath = window.location.pathname + window.location.search
      router.push(`/login?callbackUrl=${encodeURIComponent('/my-page')}`)
      return
    }

    // SNS 로그인 후 인증 상태 새로고침이 필요한 경우
    if (authRefresh === 'true' && !hasProcessedAuthRefresh.current) {
      hasProcessedAuthRefresh.current = true
      
      // URL에서 auth_refresh 파라미터 제거
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('auth_refresh')
      router.replace(newUrl.pathname + newUrl.search)
      
      // Context의 refreshUser를 사용하여 인증 상태 새로고침
      // window.location.reload() 대신 사용하여 무한 루프 방지
      refreshUser()
    }
  }, [searchParams, router, refreshUser])

  return <>{children}</>
}