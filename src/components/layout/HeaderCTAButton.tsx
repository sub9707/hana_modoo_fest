'use client'

import Link from "next/link"
import { useGA4Tracking } from '@/hooks/useGA4Tracking'
import { useRouter, usePathname } from "next/navigation"
import { useState, useTransition } from "react"
import { Loader2 } from "lucide-react"

interface HeaderCTAButtonProps {
  title: string
  type?: "primary" | "secondary"
  href: string
}

function HeaderCTAButton({ title, type = "primary", href }: HeaderCTAButtonProps) {
  const { trackButtonClick } = useGA4Tracking()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [isClicked, setIsClicked] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()

    // 이미 클릭되었거나 현재 페이지면 무시
    if (isClicked || pathname === href) return

    // 클릭 상태 설정
    setIsClicked(true)

    // GA4 트래킹
    const buttonName = title.replace(/\s+/g, '_').toLowerCase()
    trackButtonClick(`${buttonName}_cta`, 'header')

    // Next.js 15 useTransition 활용한 페이지 전환
    startTransition(() => {
      router.push(href)
    })

    // 5초 후 클릭 상태 해제 (페이지 전환 실패 대비)
    setTimeout(() => {
      setIsClicked(false)
    }, 5000)
  }

  // 로딩 중이거나 클릭된 상태
  const isLoading = isPending || isClicked
  const isDisabled = isLoading || pathname === href

  if (type === "primary") {
    const primaryStyle = `
      inline-flex items-center justify-center gap-2 text-sm sm:text-lg px-2 sm:px-6 py-2 
      rounded-lg font-semibold shadow-md transition-all duration-200 text-center 
      bg-gradient-to-r from-purple-200 via-blue-200 to-green-100 text-white border border-white
      ${isDisabled ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-105 active:scale-95'}
    `
    const primaryTextShadow = { textShadow: "2px 2px 4px rgba(0,0,0,0.7)" }
    
    return (
      <Link 
        href={href} 
        onClick={handleClick}
        className={primaryStyle} 
        style={primaryTextShadow}
        prefetch={true}
        aria-disabled={isDisabled}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {title}
      </Link>
    )
  }

  // secondary type
  return (
    <div className="inline-block bg-gradient-to-r from-purple-200 via-blue-200 to-green-100 p-[2px] rounded-lg shadow-md">
      <Link 
        href={href} 
        onClick={handleClick}
        className={`
          inline-flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-semibold 
          transition-all duration-200 text-center bg-white text-gray-600
          ${isDisabled ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-50 active:scale-95'}
        `}
        prefetch={true}
        aria-disabled={isDisabled}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {title}
      </Link>
    </div>
  )
}

export default HeaderCTAButton