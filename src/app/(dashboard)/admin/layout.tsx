import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'
import { getCurrentUser } from '@/lib/mysql/server'

export const metadata: Metadata = {
  title: '백오피스 관리 | 모두하나대축제',
  description: '모두하나대축제 관리자 시스템',
  robots: {
    index: false,
    follow: false,
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 서버 사이드 권한 재검증.
  // 지금까지 /admin 의 방어선은 미들웨어 role 체크 단 하나였다.
  // 미들웨어 matcher 를 벗어나는 경로나 미들웨어 변경 실수 한 번에 관리자 화면이
  // 통째로 열리므로, 레이아웃에서도 독립적으로 한 번 더 확인한다.
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login?callbackUrl=/admin&message=' + encodeURIComponent('로그인이 필요합니다.'))
  }

  if (user.role !== 'admin') {
    redirect('/unauthorized?message=' + encodeURIComponent('관리자 권한이 필요합니다.'))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
