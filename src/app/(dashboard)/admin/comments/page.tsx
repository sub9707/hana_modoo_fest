'use client'

import React, { useState } from 'react'
import Sidebar from '@/components/admin/Sidebar'
import { MessageSquare } from 'lucide-react'

const CommentsManagement = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">응원댓글 관리</h2>
    <div className="text-center py-12">
      <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">응원댓글 관리</h3>
      <p className="text-gray-500">댓글 목록, 승인/차단 관리, 통계 기능을 구현해주세요.</p>
    </div>
  </div>
)

export default function CommentsPage() {
  const [activeMenu] = useState('comments')
  const [openSubmenu, setOpenSubmenu] = useState<string | null>('online-festival')

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeMenu={activeMenu}
        setActiveMenu={() => {}}
        openSubmenu={openSubmenu}
        setOpenSubmenu={setOpenSubmenu}
      />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <CommentsManagement />
        </div>
      </main>
    </div>
  )
}
