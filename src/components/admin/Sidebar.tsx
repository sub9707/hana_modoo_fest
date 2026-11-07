'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { menuItems } from '@/config/menuConfig'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const { user, isLoading } = useAuth()
  
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

  // 역할 표시 함수
  const getRoleDisplay = (role?: string) => {
    switch (role) {
      case 'admin':
        return '관리자'
      case 'editor':
        return '편집자'
      case 'user':
        return '사용자'
      default:
        return '역할 미지정'
    }
  }

  return (
    <aside className="w-60 bg-white border-r border-gray-200 h-screen overflow-y-auto flex flex-col">
      {/* 로고 */}
      <button
        type="button"
        onClick={handleLogoClick}
        className="px-6 py-5 border-b border-gray-200 text-left hover:bg-gray-50 transition-colors"
      >
        <p className="text-xs font-semibold tracking-wide text-orange-600">모두하나대축제</p>
        <h1 className="text-lg font-bold text-gray-900 mt-0.5">관리자</h1>
      </button>

      {/* 네비게이션 */}
      <nav className="px-3 py-4 flex-1 space-y-0.5">
        {menuItems.map((item) => {
          const isActive = activeMenu === item.id ||
            (item.submenu && item.submenu.some(sub => sub.id === activeMenu))

          return (
            <div key={item.id}>
              <button
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-left text-sm rounded-md transition-colors ${
                  isActive
                    ? 'bg-orange-50 text-orange-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center">
                  <item.icon className={`w-4 h-4 mr-3 ${isActive ? 'text-orange-600' : 'text-gray-400'}`} />
                  {item.title}
                </span>
                {item.submenu && (
                  <svg
                    className={`w-3.5 h-3.5 transition-transform ${openSubmenu === item.id ? 'rotate-90' : ''} text-gray-400`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>

              {item.submenu && openSubmenu === item.id && (
                <div className="ml-7 mt-0.5 mb-1 space-y-0.5">
                  {item.submenu.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => handleSubmenuClick(subItem.id)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                        activeMenu === subItem.id
                          ? 'text-orange-700 font-semibold'
                          : 'text-gray-500 hover:text-gray-900'
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

      {/* 하단: 사용자 정보 */}
      <div className="border-t border-gray-200 p-4 space-y-3">
        {isLoading ? (
          <div className="flex items-center gap-3">
            <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
            <span className="text-sm text-gray-400">불러오는 중</span>
          </div>
        ) : user ? (
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user.name || user.username || '이름 없음'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {getRoleDisplay(user.role)}{user.company ? ` · ${user.company}` : ''}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-sm font-semibold text-gray-900">인증 필요</p>
            <p className="text-xs text-red-600">로그인해주세요</p>
          </div>
        )}

        <Link
          href="/"
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-center text-sm text-gray-700 hover:border-orange-300 hover:text-orange-600 transition-colors"
        >
          사이트로 돌아가기
        </Link>
      </div>
    </aside>
  )
}
