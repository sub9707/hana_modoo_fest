import type { Metadata } from 'next'

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
  return children
}
