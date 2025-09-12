'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import LanguageSelect from '../ui/LanguageSelect'
import LogoutButton from '../auth/LogoutButton'
import { useAuth } from '@/contexts/AuthContext'

const navigation = [
  { name: '축제 소개', href: '/about' },
  { name: '기관 소개', href: '/organization' },
  { name: '온라인 축제', href: '/online-festival' },
  { name: '행사 프로그램', href: '/programs' },
  { name: '공지/소식', href: '/news' },
  { name: '오시는 길', href: '/directions' },
  { name: '갤러리', href: '/gallery' },
  { name: '함께하는 기관', href: '/partners' },
]

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, isLoading: isLoadingAuth } = useAuth()
  const pathname = usePathname()

  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])


  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }
  

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 transition-all duration-200",
          isScrolled && "shadow-sm"
        )}
        role="banner"
      >
        <div className="container mx-auto px-4 lg:px-8 sm:px-6">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* 로고 */}
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                aria-label="모두하나대축제 홈페이지로 이동"
              >
                <div className="flex">
                  <h1 className="text-xl lg:text-2xl font-bold text-slate-900">
                    모두하나대축제
                  </h1>
                </div>
              </Link>
            </div>

            {/* 데스크톱 네비게이션 */}
            <nav className="hidden md:hidden lg:flex items-center space-x-1" role="navigation" aria-label="주요 메뉴">
              {navigation.map((item) => {
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-md transition-colors relative",
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-slate-700 hover:text-blue-600 hover:bg-slate-50"
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.name}
                    {isActive && (
                      <span className="absolute inset-x-0 -bottom-px h-0.5 bg-blue-600" />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* CTA 버튼 그룹 */}
            <div className='flex items-center gap-8'>
              <Link href={'/registration'} className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors">
                사전참가 신청하기
              </Link>

              {/* 로그인 상태에 따른 분기 처리 */}
              <div className='hidden lg:flex items-center'>
                {isLoadingAuth ? (
                  // 로딩 중
                  <div className="w-20 h-5 bg-gray-200 animate-pulse rounded" />
                ) : user ? (
                  // 로그인된 상태 - 로그아웃만 표시
                  <LogoutButton type="link" />
                ) : (
                  // 로그인되지 않은 상태 - 로그인/회원가입 링크 표시
                  <Link
                    href='/login'
                    className='text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors cursor-pointer'
                  >
                    로그인/회원가입
                  </Link>
                )}
              </div>

              <LanguageSelect />
            </div>

            {/* 모바일 메뉴 버튼 */}
            <button
              className="lg:hidden p-2 rounded-md text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
              onClick={handleMobileMenuToggle}
              aria-label="메뉴 열기"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "block px-3 py-2 text-base font-medium rounded-md transition-colors",
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-slate-700 hover:text-blue-600 hover:bg-slate-50"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              })}

              {/* 모바일 로그인/로그아웃 */}
              <div className="pt-2 border-t border-gray-200">
                <button className="block w-full text-left px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-md transition-colors">
                  사전참가 신청하기
                </button>

                {isLoadingAuth ? (
                  <div className="px-3 py-2">
                    <div className="w-24 h-5 bg-gray-200 animate-pulse rounded" />
                  </div>
                ) : user ? (
                  <div className="px-3 py-2">
                    <LogoutButton type="link" showIcon={false} className="text-base" />
                  </div>
                ) : (
                  <Link
                    href='/login'
                    className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    로그인/회원가입
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}