'use client'

import React from 'react'
import { menuItems } from '@/config/menuConfig'

interface SidebarProps {
  activeMenu: string
  setActiveMenu: (menu: string) => void
  openSubmenu: string | null
  setOpenSubmenu: (submenu: string | null) => void
}

export default function Sidebar({ 
  activeMenu, 
  setActiveMenu, 
  openSubmenu, 
  setOpenSubmenu 
}: SidebarProps) {
  const handleMenuClick = (menuId: string) => {
    const menuItem = menuItems.find(item => item.id === menuId)
    
    if (menuItem?.submenu) {
      setOpenSubmenu(openSubmenu === menuId ? null : menuId)
    } else {
      setActiveMenu(menuId)
      setOpenSubmenu(null)
    }
  }

  return (
    <aside className="w-64 bg-white shadow-sm h-screen overflow-y-auto">
      {/* 헤더 */}
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900">백오피스 관리</h1>
        <p className="text-sm text-gray-500 mt-1">모두하나대축제</p>
      </div>
      
      {/* 네비게이션 메뉴 */}
      <nav className="px-4 pb-6">
        {menuItems.map((item) => (
          <div key={item.id} className="mb-2">
            {/* 메인 메뉴 버튼 */}
            <button
              onClick={() => handleMenuClick(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-md transition-colors ${
                activeMenu === item.id 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.title}</span>
              </div>
              {/* 서브메뉴가 있는 경우 화살표 표시 */}
              {item.submenu && (
                <svg 
                  className={`w-4 h-4 transition-transform ${
                    openSubmenu === item.id ? 'rotate-90' : ''
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
            
            {/* 서브메뉴 */}
            {item.submenu && openSubmenu === item.id && (
              <div className="ml-8 mt-2 space-y-1">
                {item.submenu.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => setActiveMenu(subItem.id)}
                    className={`w-full text-left px-4 py-2 text-sm rounded-md transition-colors ${
                      activeMenu === subItem.id 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {subItem.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}