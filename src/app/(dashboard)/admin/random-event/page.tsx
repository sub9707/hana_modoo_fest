'use client'

import React, { useState } from 'react'
import Sidebar from '@/components/admin/Sidebar'
import { Gift } from 'lucide-react'

const RandomEventManagement = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">랜덤이벤트</h2>
    <div className="text-center py-12">
      <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">랜덤이벤트</h3>
      <p className="text-gray-500">랜덤이벤트 관리 페이지입니다.</p>
    </div>
  </div>
)

export default function RandomEventPage() {
  const [activeMenu] = useState('random-event')
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
          <RandomEventManagement />
        </div>
      </main>
    </div>
  )
}
