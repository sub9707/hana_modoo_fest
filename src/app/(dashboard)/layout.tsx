// app/(dashboard)/layout.tsx - 관리자용 (최소한의 메타데이터)
import type { Metadata } from 'next'
import Sidebar from '@/components/admin/Sidebar'

export const metadata: Metadata = {
  title: {
    default: '관리자 시스템',
    template: '%s | 관리자'
  },
  robots: {
    index: false,
    follow: false,
  }
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <div className="flex h-screen bg-gray-50">
        <main className="flex-1 overflow-y-auto">
            {children}
        </main>
      </div>
  )
}