'use client'

import React, { useState } from 'react'
import Sidebar from '@/components/admin/Sidebar'
import GalleryManagement from '@/components/admin/GalleryManagement'

export default function GalleryPage() {
  const [activeMenu] = useState('gallery')
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
          <GalleryManagement />
        </div>
      </main>
    </div>
  )
}
