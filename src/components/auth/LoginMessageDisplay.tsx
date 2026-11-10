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
      if (sessionExpired === 'true' || message?.includes('세션') || message?.includes('다른 기기')) {
        alert('세션이 만료되었습니다.\n다시 로그인해주세요.')
      } else if (message) {
        alert(decodeURIComponent(message))
      }
      setHasShownAlert(true)
      
      // 새로고침 시 같은 알림이 다시 뜨지 않도록 쿼리 파라미터를 지운다
      router.replace('/login', { scroll: false })
    }
  }, [message, sessionExpired, hasShownAlert, router])

  return null
}