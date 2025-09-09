'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Phone, Mail, ExternalLink, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavigationItem {
  name: string
  href: string
  isPrimary?: boolean
}

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  navigation: NavigationItem[]
}

export default function MobileMenu({ isOpen, onClose, navigation }: MobileMenuProps) {
  const pathname = usePathname()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* 오버레이 */}
      <div 
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 메뉴 패널 */}
      <div 
        id="mobile-menu"
        className="fixed top-0 right-0 z-70 h-full w-full max-w-sm bg-white shadow-xl lg:hidden transform transition-transform duration-300 ease-in-out"
        role="dialog"
        aria-modal="true"
        aria-label="모바일 메뉴"
      >
        <div className="flex h-full flex-col">
          {/* 헤더 */}
          <div className="border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">메뉴</h2>
              <button
                type="button"
                className="rounded-md p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                onClick={onClose}
                aria-label="메뉴 닫기"
              >
                <span className="sr-only">메뉴 닫기</span>
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* 네비게이션 */}
          <nav className="flex-1 overflow-y-auto px-6 py-6" role="navigation" aria-label="모바일 메뉴">
            <div className="space-y-1">
              {navigation
                .filter(item => !item.isPrimary)
                .map((item) => {
                  const isActive = pathname === item.href
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "block rounded-lg px-4 py-3 text-base font-medium transition-colors",
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      )}
                      onClick={onClose}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                  )
                })}
            </div>

            {/* 사전참가 신청 버튼 */}
            <div className="mt-8">
              <Link
                href="/register"
                className="block w-full rounded-lg bg-blue-600 px-4 py-3 text-center text-base font-medium text-white hover:bg-blue-700 transition-colors"
                onClick={onClose}
              >
                사전참가 신청하기
              </Link>
            </div>

            {/* 축제 정보 */}
            <div className="mt-8 rounded-lg bg-slate-50 p-4">
              <h3 className="text-sm font-medium text-slate-900 mb-3">축제 정보</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <div>
                  <span className="font-medium">일시:</span> 2025.10.18(토) 11:00-16:00
                </div>
                <div>
                  <span className="font-medium">장소:</span> 여의도공원 문화의마당
                </div>
                <div>
                  <span className="font-medium">참가비:</span> <span className="text-green-600 font-medium">무료</span>
                </div>
              </div>
            </div>

            {/* 연락처 */}
            <div className="mt-6 space-y-3">
              <h3 className="text-sm font-medium text-slate-900">문의하기</h3>
              
              <a
                href="tel:02-123-4567"
                className="flex items-center space-x-3 rounded-lg px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                onClick={onClose}
              >
                <Phone className="h-5 w-5 text-slate-400" />
                <div>
                  <div className="text-sm font-medium">전화 문의</div>
                  <div className="text-xs text-slate-500">02-123-4567</div>
                </div>
              </a>
              
              <a
                href="mailto:info@moduhana2025.seoul.kr"
                className="flex items-center space-x-3 rounded-lg px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                onClick={onClose}
              >
                <Mail className="h-5 w-5 text-slate-400" />
                <div>
                  <div className="text-sm font-medium">이메일 문의</div>
                  <div className="text-xs text-slate-500">info@moduhana2025.seoul.kr</div>
                </div>
              </a>

              <a
                href="https://seoul.go.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 rounded-lg px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                onClick={onClose}
              >
                <ExternalLink className="h-5 w-5 text-slate-400" />
                <div>
                  <div className="text-sm font-medium">센터 홈페이지</div>
                  <div className="text-xs text-slate-500">seoul.go.kr</div>
                </div>
              </a>
            </div>

            {/* 소셜 링크 */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-slate-900 mb-3">SNS 팔로우</h3>
              <div className="flex space-x-3">
                <a
                  href="https://instagram.com/moduhana2025"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors"
                  aria-label="인스타그램"
                >
                  <span className="text-sm">📷</span>
                </a>
                <a
                  href="https://youtube.com/@moduhana2025"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors"
                  aria-label="유튜브"
                >
                  <span className="text-sm">📹</span>
                </a>
                <a
                  href="https://blog.seoul.go.kr/moduhana"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors"
                  aria-label="블로그"
                >
                  <span className="text-sm">📝</span>
                </a>
              </div>
            </div>
          </nav>

          {/* 푸터 */}
          <div className="border-t border-slate-200 px-6 py-4">
            <p className="text-xs text-slate-500 text-center">
              © 2025 서울특별시한부모가족지원센터
            </p>
          </div>
        </div>
      </div>
    </>
  )
}