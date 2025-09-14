import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '백오피스 관리 | 모두하나대축제',
  description: '모두하나대축제 관리자 시스템',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}