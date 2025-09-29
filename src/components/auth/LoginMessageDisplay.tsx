'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface LoginMessageDisplayProps {
  message?: string
  sessionExpired?: string
}

export default function LoginMessageDisplay({ message, sessionExpired }: LoginMessageDisplayProps) {
  const [hasShownAlert, setHasShownAlert] = useState(false)
  const { logout, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      logout()
    }
  }, [user, logout])

  useEffect(() => {
    if (!hasShownAlert && (message || sessionExpired)) {
      // ✅ 어떤 경우든 alert 표시
      if (sessionExpired === 'true' || message?.includes('세션') || message?.includes('다른 기기')) {
        alert('세션이 만료되었습니다.\n다시 로그인해주세요.')
      } else if (message) {
        alert(decodeURIComponent(message))
      }
      setHasShownAlert(true)
      
      // ✅ URL 파라미터 제거 (깨끗한 로그인 페이지)
      router.replace('/login', { scroll: false })
    }
  }, [message, sessionExpired, hasShownAlert, router])

  return null
}