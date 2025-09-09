'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MobileMenu from './MobileMenu'
import { cn } from '@/lib/utils'

const navigation = [
  { name: '축제 소개', href: '/festival' },
  { name: '기관 소개', href: '/about' },
  { name: '온라인 축제', href: '/online-festival' },
  { name: '행사 프로그램', href: '/programs' },
  { name: '공지/소식', href: '/news' },
  { name: '오시는 길', href: '/location' },
  { name: '갤러리', href: '/gallery' },
  { name: '함께하는 기관', href: '/partners' },
  { name: '사전참가 신청', href: '/register', isPrimary: true },
]

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

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
      {/* 상단 정보바 */}
      <div className="bg-slate-50 border-b border-slate-200 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2 text-sm text-slate-600">
            <div className="flex items-center space-x-6">
              <span className="font-medium text-slate-800">
                2025년 10월 18일(토) 11:00-16:00 | 여의도공원 문화의마당
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="tel:02-123-4567" 
                className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                aria-label="전화 문의"
              >
                <Phone className="w-3 h-3" />
                <span>02-123-4567</span>
              </a>
              <a 
                href="mailto:info@moduhana2025.seoul.kr" 
                className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                aria-label="이메일 문의"
              >
                <Mail className="w-3 h-3" />
                <span>문의하기</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 헤더 */}
      <header 
        className={cn(
          "sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 transition-all duration-200",
          isScrolled && "shadow-sm"
        )}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* 로고 */}
            <div className="flex items-center">
              <Link 
                href="/" 
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                aria-label="모두하나대축제 홈페이지로 이동"
              >
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">모</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl lg:text-2xl font-bold text-slate-900">
                    모두하나대축제
                  </h1>
                  <p className="text-xs lg:text-sm text-slate-600 -mt-1">
                    서울시 대표 가족축제
                  </p>
                </div>
              </Link>
            </div>

            {/* 데스크톱 네비게이션 */}
            <nav className="hidden lg:flex items-center space-x-1" role="navigation" aria-label="주요 메뉴">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                const isPrimary = item.isPrimary

                if (isPrimary) {
                  return (
                    <Button
                      key={item.name}
                      asChild
                      className="ml-4 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                    >
                      <Link href={item.href}>
                        {item.name}
                      </Link>
                    </Button>
                  )
                }

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

            {/* 모바일 메뉴 버튼 */}
            <div className="flex items-center lg:hidden">
              <Button
                asChild
                size="sm"
                className="mr-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Link href="/register">신청</Link>
              </Button>
              
              <button
                type="button"
                className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                onClick={handleMobileMenuToggle}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label="메뉴 열기"
              >
                <span className="sr-only">메뉴</span>
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" aria-hidden="true" />
                ) : (
                  <Menu className="w-6 h-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        <MobileMenu 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)}
          navigation={navigation}
        />
      </header>
    </>
  )
}