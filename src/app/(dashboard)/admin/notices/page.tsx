'use client'

import React, { useState } from 'react'
import Sidebar from '@/components/admin/Sidebar'
import { Bell } from 'lucide-react'

const NoticesManagement = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">공지 관리</h2>
    <div className="text-center py-12">
      <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">공지 관리</h3>
      <p className="text-gray-500">공지사항 작성, 편집, 발행 관리 기능을 구현해주세요.</p>
    </div>
  </div>
)

export default function NoticesPage() {
  const [activeMenu] = useState('notices')
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

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
          <NoticesManagement />
        </div>
      </main>
    </div>
  )
}