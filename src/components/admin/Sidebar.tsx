'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { LogOut, User } from 'lucide-react'
import { menuItems } from '@/config/menuConfig'

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  
  // pathname에서 activeMenu 추출
  const getActiveMenuFromPath = () => {
    if (pathname === '/admin') return 'admin'
    const pathSegments = pathname.split('/')
    return pathSegments[2] || 'admin'
  }
  
  const activeMenu = getActiveMenuFromPath()

  // 현재 경로에 맞는 서브메뉴 자동 열기
  useEffect(() => {
    const currentMenuItem = menuItems.find(item => {
      if (item.submenu) {
        return item.submenu.some(subItem => subItem.id === activeMenu)
      }
      return item.id === activeMenu
    })
    
    if (currentMenuItem?.submenu) {
      setOpenSubmenu(currentMenuItem.id)
    }
  }, [activeMenu])

  const handleMenuClick = (menuId: string) => {
    const menuItem = menuItems.find(item => item.id === menuId)
    
    if (menuItem?.submenu) {
      setOpenSubmenu(openSubmenu === menuId ? null : menuId)
    } else {
      router.push(`/admin/${menuId}`)
      setOpenSubmenu(null)
    }
  }

  const handleSubmenuClick = (submenuId: string) => {
    router.push(`/admin/${submenuId}`)
  }

  const handleLogoClick = () => {
    router.push('/admin')
  }

  const handleLogout = () => {
    if (confirm('이벤트 페이지로 이동합니다.')) {
      router.push('/')
    }
  }

  // 현재 관리자 정보 (실제로는 컨텍스트나 API에서 가져옴)
  const adminInfo = {
    name: '홍길동',
    role: '최고 관리자',
    department: '시스템 관리부',
    avatar: '홍'
  }

  return (
    <aside className="w-64 bg-white shadow-lg h-screen overflow-y-auto flex flex-col">
      {/* 헤더 - 클릭 가능한 로고 */}
      <div 
        onClick={handleLogoClick}
        className="p-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <h1 className="text-xl font-bold text-gray-900">백오피스 관리</h1>
        <p className="text-sm text-gray-500 mt-1">모두하나대축제</p>
      </div>
      
      {/* 네비게이션 메뉴 - flex-1로 공간 차지 */}
      <nav className="px-4 py-6 flex-1">
        {menuItems.map((item) => {
          const isActive = activeMenu === item.id || 
            (item.submenu && item.submenu.some(sub => sub.id === activeMenu))
          
          return (
            <div key={item.id} className="mb-2">
              {/* 메인 메뉴 버튼 */}
              <button
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center">
                  <item.icon className={`w-5 h-5 mr-3 ${
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                  <span className="font-medium">{item.title}</span>
                </div>
                {/* 서브메뉴가 있는 경우 화살표 표시 */}
                {item.submenu && (
                  <svg 
                    className={`w-4 h-4 transition-transform ${
                      openSubmenu === item.id ? 'rotate-90' : ''
                    } ${isActive ? 'text-blue-600' : 'text-gray-400'}`} 
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
                      onClick={() => handleSubmenuClick(subItem.id)}
                      className={`w-full text-left px-4 py-2 text-sm rounded-md transition-colors ${
                        activeMenu === subItem.id 
                          ? 'bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-500' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {subItem.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* 하단 영역 */}
      <div className="border-t border-gray-200 bg-gray-50">
        {/* 관리자 프로필 카드 */}
        <div className="p-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3 gap-1">
    
              {/* 프로필 아이콘 */}
              <User className="w-8 h-8 text-gray-400 flex-shrink-0" />
              {/* 프로필 정보 */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {adminInfo.name}
                </p>
                <p className="text-xs text-blue-600 font-medium">
                  {adminInfo.role}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {adminInfo.department}
                </p>
              </div>
              
            </div>
          </div>
        </div>

        {/* 로그아웃 버튼 */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm font-medium"
          >
            <LogOut className="w-4 h-4 mr-2" />
            나가기
          </button>
        </div>
      </div>
    </aside>
  )
}