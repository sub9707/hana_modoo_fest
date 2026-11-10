'use client'

import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { QUICK_BAR_ITEMS } from '@/constants'

export default function QuickBar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [clickedHref, setClickedHref] = useState<string | null>(null)

  const handleNavigation = (e: React.MouseEvent, href: string) => {
    e.preventDefault()

    // 이미 현재 페이지면 무시
    if (pathname === href || clickedHref === href) return

    setClickedHref(href)

    // 모바일 진동 피드백
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }

    startTransition(() => {
      router.push(href)
    })

    // 5초 후 리셋
    setTimeout(() => {
      setClickedHref(null)
    }, 5000)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 lg:hidden overflow-x-hidden">
      <nav className="flex justify-around py-2" role="navigation" aria-label="하단 퀵 메뉴">
        {QUICK_BAR_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          const isLoading = (isPending || clickedHref === item.href) && pathname !== item.href
          const isHighlight = 'isHighlight' in item && item.isHighlight

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavigation(e, item.href)}
              className={cn(
                "flex flex-col items-center justify-center p-2 text-xs transition-all min-w-0 flex-1 relative",
                isActive
                  ? "text-blue-600"
                  : "text-slate-600 hover:text-blue-600",
                isLoading && "opacity-70",
                isHighlight && !isActive && "text-orange-500 font-semibold"
              )}
              aria-current={isActive ? 'page' : undefined}
              aria-disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 mb-1 animate-spin" />
              ) : (
                <Icon className="w-5 h-5 mb-1" />
              )}
              <span className="truncate">{item.label}</span>
              {isHighlight && !isActive && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
