'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { MyPageContent } from '@/components/my-page/MyPageContent'
import { ClientWrapper } from '@/components/my-page/ClientWrapper'
import { Loader2 } from 'lucide-react'

export default function MyPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // 인증 로딩이 완료되면 체크 시작
    if (!isLoading) {
      if (!user) {
        // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
        const message = encodeURIComponent('로그인이 필요한 서비스입니다.')
        router.push(`/login?callbackUrl=${encodeURIComponent('/my-page')}&message=${message}`)
        return
      }
      setIsChecking(false)
    }
  }, [user, isLoading, router])

  // 로딩 중이거나 인증 체크 중인 경우
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">페이지를 로딩 중입니다...</p>
        </div>
      </div>
    )
  }

  // 사용자가 없으면 (리다이렉트 처리 중) 빈 화면
  if (!user) {
    return null
  }

  // 정상적인 경우 마이페이지 렌더링
  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <MyPageContent user={user} />
        </div>
      </div>
    </ClientWrapper>
  )
}