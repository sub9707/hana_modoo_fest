'use client'

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useState, useTransition, useEffect } from "react"
import { Loader2 } from "lucide-react"

interface HeaderCTAButtonProps {
  title: string
  type?: "primary" | "secondary"
  href: string
}

function HeaderCTAButton({ title, type = "primary", href }: HeaderCTAButtonProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [isClicked, setIsClicked] = useState(false)

  // pathname이 변경되면 클릭 상태 리셋
  useEffect(() => {
    setIsClicked(false)
  }, [pathname])

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()

    if (isClicked || pathname === href) return

    setIsClicked(true)

    startTransition(() => {
      router.push(href)
    })
  }

  // 로딩 중이거나 클릭된 상태
  const isLoading = isPending || isClicked
  const isDisabled = isLoading || pathname === href

  if (type === "primary") {
    const primaryStyle = `
      inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm xl:text-base px-2 sm:px-4 xl:px-5 py-1.5 sm:py-2
      rounded-lg font-semibold shadow-md transition-all duration-200 text-center whitespace-nowrap
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
    <div className="inline-block bg-gradient-to-r from-purple-200 via-blue-200 to-green-100 p-[1.5px] rounded-lg shadow-md">
      <Link
        href={href}
        onClick={handleClick}
        className={`
          inline-flex items-center justify-center gap-1.5 px-3 xl:px-4 py-1.5 rounded-lg font-semibold
          transition-all duration-200 text-center bg-white text-gray-600 text-sm whitespace-nowrap
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