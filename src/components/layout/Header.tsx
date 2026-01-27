'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import LanguageSelect from '../ui/LanguageSelect'
import LogoutButton from '../auth/LogoutButton'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'
import HeaderCTAButton from './HeaderCTAButton'
import { MAIN_NAVIGATION, ROUTES } from '@/constants'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { user, isLoading: isLoadingAuth, error } = useAuth()
  const pathname = usePathname()

  // 클라이언트 마운트 상태 (hydration 에러 방지)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (error) {
      console.error('[Header] Auth error:', error)
    }
  }, [error])

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

  // 사용자 이름 표시 함수
  const getUserDisplayName = () => {
    if (!user) return ''
    const name = user.name || user.username || '사용자'
    return name
  }

  return (
    <>
      <header
        className={cn(
          "font-paper sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 transition-all duration-200",
          isScrolled && "shadow-sm"
        )}
        role="banner"
      >
        <div className="container mx-auto px-4 lg:px-8 sm:px-6">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                aria-label="모두하나대축제 홈페이지로 이동"
              >
                <div className="relative mt-2 w-35 sm:w-50 h-7 sm:h-10 lg:w-80 lg:h-15 flex">
                  <Image src={'/icons/logo.png'} fill alt='모두하나대축제 로고' priority />
                </div>
              </Link>
            </div>

            <nav className="hidden xl:flex items-center" role="navigation" aria-label="주요 메뉴">
              {MAIN_NAVIGATION.map((item) => {
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "px-2 xl:px-3 py-2 text-sm xl:text-base font-medium rounded-md transition-colors relative whitespace-nowrap",
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-slate-700 hover:text-blue-600"
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

            <div className='flex items-center gap-2 sm:gap-3'>
              <HeaderCTAButton href={ROUTES.registration} type='primary' title='사전참가 신청' />

              {/* 로그인 상태에 따른 분기 처리 - 데스크톱에서만 표시 */}
              <div className="hidden xl:flex items-center">
                {!isMounted || isLoadingAuth ? (
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-5 bg-gray-200 animate-pulse rounded" />
                    <div className="w-px h-4 bg-slate-200" />
                    <div className="w-12 h-5 bg-gray-200 animate-pulse rounded" />
                  </div>
                ) : user ? (
                  <div className="flex items-center gap-3">
                    <Link
                      href={ROUTES.myPage}
                      className="flex items-center gap-1 px-2 py-1.5 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-md transition-colors whitespace-nowrap"
                    >
                      <User className="h-4 w-4 flex-shrink-0" />
                      <span className="max-w-[80px] truncate">{getUserDisplayName()}</span>
                      <span>님</span>
                    </Link>
                    <div className="w-px h-4 bg-slate-300" />
                    <LogoutButton
                      type="link"
                      size="sm"
                      showIcon={false}
                      className="text-sm"
                    />
                  </div>
                ) : (
                  <Link
                    href={ROUTES.login}
                    className="text-sm text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    로그인
                  </Link>
                )}
              </div>

              {/* 모바일 메뉴 버튼 */}
              <button
                className="xl:hidden p-2 rounded-md text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors"
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
        </div>

        {isMobileMenuOpen && (
          <div className="xl:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-2 space-y-1">
              {MAIN_NAVIGATION.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "block px-3 py-2 text-base font-medium rounded-md transition-colors",
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-slate-700 hover:text-blue-600"
                    )}
                  >
                    {item.name}
                  </Link>
                )
              })}

              {/* 모바일 하단 메뉴 */}
              <div className="pt-2 border-t border-gray-200 space-y-1">
                {!isMounted || isLoadingAuth ? (
                  <div className="px-3 py-2">
                    <div className="w-24 h-5 bg-gray-200 animate-pulse rounded" />
                  </div>
                ) : user ? (
                  <>
                    <Link
                      href={ROUTES.myPage}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 rounded-md transition-colors"
                    >
                      <User className="h-4 w-4" />
                      마이페이지
                    </Link>
                    <div className="px-3 py-2">
                      <LogoutButton type="link" size="sm" />
                    </div>
                  </>
                ) : (
                  <Link
                    href={ROUTES.login}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-blue-600 rounded-md transition-colors"
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