'use client'

import React, { useState } from 'react'
import Sidebar from '@/components/admin/Sidebar'
import RegistrationManagement from '@/components/admin/RegistrationManagement'

export default function RegistrationPage() {
  const [activeMenu] = useState('registration')
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
          <RegistrationManagement />
        </div>
      </main>
    </div>
  )
}