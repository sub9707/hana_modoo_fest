'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
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
              <button>
               사전참가 신청하기
              </button>
              <button className='hidden lg:flex'>
                로그인/회원가입
              </button>
              <select className='hidden lg:flex'>
                <option>한국어</option>
                <option>중국어</option>
                <option>일본어</option>
              </select>
            </div>

            {/* 모바일 메뉴 버튼 */}
          </div>
        </div>

        {/* 모바일 메뉴 */}

      </header>
    </>
  )
}