'use client'

import React, { useState } from 'react'
import Sidebar from '@/components/admin/Sidebar'
import QuizManagement from '@/components/admin/QuizManagement'

export default function QuizPage() {
  const [activeMenu] = useState('quiz')
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
          <QuizManagement />
        </div>
      </main>
    </div>
  )
}
