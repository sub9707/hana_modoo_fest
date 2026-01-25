'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { MyPageContent } from '@/components/my-page/MyPageContent'
import { ClientWrapper } from '@/components/my-page/ClientWrapper'
import { Loader2 } from 'lucide-react'

export default function MyPageClient() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        const message = encodeURIComponent('로그인이 필요한 서비스입니다.')
        router.push(`/login?callbackUrl=${encodeURIComponent('/my-page')}&message=${message}`)
        return
      }
      setIsChecking(false)
    }
  }, [user, isLoading, router])

  if (isLoading || isChecking) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">페이지를 로딩 중입니다...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <ClientWrapper>
      <div className="max-w-4xl mx-auto">
        <MyPageContent user={user} />
      </div>
    </ClientWrapper>
  )
}
