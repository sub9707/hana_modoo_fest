'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavigationItem {
  name: string
  href: string
  isPrimary?: boolean
  description?: string
}

interface NavigationProps {
  items: NavigationItem[]
  className?: string
}

export default function Navigation({ items, className }: NavigationProps) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex items-center space-x-1", className)} role="navigation" aria-label="주요 메뉴">
      {items.map((item) => {
        const isActive = pathname === item.href
        const isPrimary = item.isPrimary

        if (isPrimary) {
          return (
            <button
              key={item.name}
              className="ml-4 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              <Link href={item.href} title={item.description}>
                {item.name}
              </Link>
            </button>
          )
        }

        return (
          <Link
            key={item.name}
            href={item.href}
            title={item.description}
            className={cn(
              "px-3 py-2 text-sm font-medium rounded-md transition-colors relative group",
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
            
            {/* 호버 툴팁 (선택사항) */}
            {item.description && (
              <span className="invisible group-hover:visible absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-slate-900 rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                {item.description}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}