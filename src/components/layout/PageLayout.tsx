import { ReactNode } from 'react'

interface PageLayoutProps {
  children: ReactNode
  variant?: 'default' | 'white' | 'gray' | 'gradient-purple' | 'gradient-orange' | 'gradient-blue-purple' | 'gradient-partners'
  className?: string
  useFontPaper?: boolean
}

/**
 * 페이지 최상위 레이아웃 래퍼 컴포넌트
 *
 * @param children - 페이지 콘텐츠
 * @param variant - 배경 스타일 variant
 * @param className - 추가 클래스
 * @param useFontPaper - font-paper 클래스 사용 여부 (기본값: true)
 */
export default function PageLayout({
  children,
  variant = 'default',
  className = '',
  useFontPaper = true
}: PageLayoutProps) {
  // 배경 variant 매핑
  const variantClasses = {
    'default': 'bg-white',
    'white': 'bg-white',
    'gray': 'bg-gray-50',
    'gradient-purple': 'bg-gradient-to-b from-white to-purple-50',
    'gradient-orange': 'bg-gradient-to-b from-orange-50 to-white',
    'gradient-blue-purple': 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
    'gradient-partners': 'bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50'
  }

  return (
    <div
      className={`
        min-h-screen
        ${variantClasses[variant]}
        ${useFontPaper ? 'font-paper' : ''}
        ${className}
      `.trim()}
    >
      {children}
    </div>
  )
}
