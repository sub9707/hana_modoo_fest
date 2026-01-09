'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

type Theme = 'purple' | 'orange' | 'blue' | 'gray' | 'red' | 'green'
type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
  children: ReactNode
  theme?: Theme
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  loading?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

/**
 * 확장된 Button 컴포넌트 (ThemedButton 기반)
 *
 * @param children - 버튼 텍스트 또는 콘텐츠
 * @param theme - 색상 테마
 * @param variant - 스타일 variant
 * @param size - 버튼 크기
 * @param fullWidth - 전체 너비 사용
 * @param loading - 로딩 상태
 * @param icon - 아이콘
 * @param iconPosition - 아이콘 위치
 */
export default function Button({
  children,
  theme = 'purple',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'left',
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'rounded-lg font-semibold transition-all duration-300 inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95'

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  const getThemeStyles = () => {
    // Primary variant
    if (variant === 'primary') {
      const primaryThemes = {
        purple: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:from-blue-700 hover:to-purple-700 focus:ring-purple-500',
        orange: 'bg-gradient-to-r from-orange-400 to-pink-500 text-white hover:shadow-lg hover:from-orange-500 hover:to-pink-600 focus:ring-orange-500',
        blue: 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg focus:ring-blue-500',
        gray: 'bg-gray-800 text-white hover:bg-gray-700 hover:shadow-lg focus:ring-gray-500',
        red: 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg focus:ring-red-500',
        green: 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg focus:ring-green-500'
      }
      return `${primaryThemes[theme]} md:hover:scale-105`
    }

    // Secondary variant
    if (variant === 'secondary') {
      const secondaryThemes = {
        purple: 'bg-white border-2 border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400 focus:ring-purple-500',
        orange: 'bg-white border-2 border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 focus:ring-orange-500',
        blue: 'bg-white border-2 border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400 focus:ring-blue-500',
        gray: 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500',
        red: 'bg-white border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 focus:ring-red-500',
        green: 'bg-white border-2 border-green-300 text-green-600 hover:bg-green-50 hover:border-green-400 focus:ring-green-500'
      }
      return `${secondaryThemes[theme]} md:hover:scale-105`
    }

    // Ghost variant
    if (variant === 'ghost') {
      const ghostThemes = {
        purple: 'bg-transparent text-purple-600 hover:bg-purple-50 focus:ring-purple-500',
        orange: 'bg-transparent text-orange-600 hover:bg-orange-50 focus:ring-orange-500',
        blue: 'bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
        gray: 'bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
        red: 'bg-transparent text-red-600 hover:bg-red-50 focus:ring-red-500',
        green: 'bg-transparent text-green-600 hover:bg-green-50 focus:ring-green-500'
      }
      return ghostThemes[theme]
    }

    // Danger variant
    if (variant === 'danger') {
      return 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg focus:ring-red-500 md:hover:scale-105'
    }

    // Link variant
    if (variant === 'link') {
      const linkThemes = {
        purple: 'bg-transparent text-purple-600 hover:text-purple-700 underline-offset-4 hover:underline focus:ring-purple-500',
        orange: 'bg-transparent text-orange-600 hover:text-orange-700 underline-offset-4 hover:underline focus:ring-orange-500',
        blue: 'bg-transparent text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline focus:ring-blue-500',
        gray: 'bg-transparent text-gray-700 hover:text-gray-900 underline-offset-4 hover:underline focus:ring-gray-500',
        red: 'bg-transparent text-red-600 hover:text-red-700 underline-offset-4 hover:underline focus:ring-red-500',
        green: 'bg-transparent text-green-600 hover:text-green-700 underline-offset-4 hover:underline focus:ring-green-500'
      }
      return linkThemes[theme]
    }

    return ''
  }

  const themeStyles = getThemeStyles()
  const widthStyles = fullWidth ? 'w-full' : ''
  const isDisabled = disabled || loading

  return (
    <button
      disabled={isDisabled}
      className={`${baseStyles} ${sizeStyles[size]} ${themeStyles} ${widthStyles} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && icon && iconPosition === 'left' && icon}
      {children}
      {!loading && icon && iconPosition === 'right' && icon}
    </button>
  )
}
