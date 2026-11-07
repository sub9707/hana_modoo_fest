'use client'

import Link from 'next/link'
import { Settings } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

/**
 * 관리자 계정으로 로그인했을 때만 좌하단에 보이는 관리자 페이지 바로가기.
 * 일반 사용자에게는 렌더링하지 않는다. (실제 접근 권한은 미들웨어/admin 레이아웃에서 따로 검사)
 */
export default function AdminFloatingButton() {
  const { user, isLoading } = useAuth()

  if (isLoading || user?.role !== 'admin') return null

  return (
    <Link
      href="/admin"
      aria-label="관리자 페이지로 이동"
      className="fixed bottom-25 left-6 lg:bottom-8 lg:left-8 z-50 inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 h-12 md:h-14 md:px-5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-orange-500 touch-manipulation"
    >
      <Settings className="w-4 h-4" aria-hidden="true" />
      관리자
    </Link>
  )
}
