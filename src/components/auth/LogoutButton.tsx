'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { logoutAction } from '@/lib/actions/auth'

interface LogoutButtonProps {
  type?: 'button' | 'link'
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
  showIcon?: boolean
  children?: React.ReactNode
  redirectTo?: string
}

export default function LogoutButton({ 
  type = 'button',
  variant = 'default',
  size = 'default',
  className = '',
  showIcon = true,
  children,
  redirectTo = '/'
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { logout } = useAuth();
  const router = useRouter()

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      logout();
      await logoutAction()
      
      // refresh 로 서버 컴포넌트의 인증 상태까지 갱신한다
      router.push(redirectTo)
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoading(false)
      
      // 로그아웃 요청이 실패해도 사용자는 홈으로 보낸다
      router.push(redirectTo)
    }
  }

  const baseStyles = "inline-flex items-center font-medium transition-all duration-200 focus:outline-none"
  
  const buttonVariantStyles = {
    default: "text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-md shadow-sm",
    outline: "text-red-600 bg-white border border-red-600 hover:bg-red-50 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-md",
    ghost: "text-red-600 bg-transparent hover:bg-red-50 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-md"
  }

  const linkStyles = "text-slate-700 hover:text-red-600"

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2 text-sm", 
    lg: "px-6 py-3 text-base"
  }

  const linkSizeStyles = {
    sm: "text-xs",
    default: "text-sm",
    lg: "text-base"
  }

  const iconSizes = {
    sm: "h-3 w-3",
    default: "h-4 w-4", 
    lg: "h-5 w-5"
  }

  const combinedClassName = `
    ${baseStyles}
    ${type === 'button' ? buttonVariantStyles[variant] : linkStyles}
    ${type === 'button' ? sizeStyles[size] : linkSizeStyles[size]}
    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim()

  const iconElement = showIcon && (
    <>
      {isLoading ? (
        <Loader2 className={`${iconSizes[size]} animate-spin ${type === 'button' ? 'mr-2' : 'mr-1'}`} />
      ) : (
        <LogOut className={`${iconSizes[size]} ${type === 'button' ? 'mr-2' : 'mr-1'}`} />
      )}
    </>
  )

  const textContent = children || (isLoading ? '로그아웃 중...' : '로그아웃')

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={combinedClassName}
    >
      {iconElement}
      {textContent}
    </button>
  )
}