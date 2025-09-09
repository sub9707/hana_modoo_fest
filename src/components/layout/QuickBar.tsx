'use client'

import Link from 'next/link'
import { Home, Calendar, UserPlus, Play, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

const quickBarItems = [
  { icon: Home, label: '홈', href: '/' },
  { icon: Calendar, label: '프로그램', href: '/programs' },
  { icon: UserPlus, label: '신청', href: '/register' },
  { icon: Play, label: '참여하기', href: '/online-festival' },
  { icon: MapPin, label: '오시는 길', href: '/location' }
]

export default function QuickBar() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 lg:hidden">
      <nav className="flex justify-around py-2" role="navigation" aria-label="하단 퀵 메뉴">
        {quickBarItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-2 text-xs transition-colors min-w-0 flex-1",
                isActive 
                  ? "text-blue-600" 
                  : "text-slate-600 hover:text-blue-600"
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}