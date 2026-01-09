import { ReactNode } from 'react'

interface SectionProps {
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '7xl' | 'full'
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  id?: string
}

/**
 * 공통 섹션 컨테이너 컴포넌트
 *
 * @param children - 섹션 콘텐츠
 * @param maxWidth - 최대 너비 (기본값: 7xl)
 * @param padding - 패딩 크기 (기본값: md)
 * @param className - 추가 CSS 클래스
 * @param id - 섹션 ID (스크롤 링크용)
 */
export default function Section({
  children,
  maxWidth = '7xl',
  padding = 'md',
  className = '',
  id
}: SectionProps) {
  // 최대 너비 매핑
  const maxWidthClasses = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '7xl': 'max-w-7xl',
    'full': 'max-w-full'
  }

  // 패딩 매핑
  const paddingClasses = {
    'none': '',
    'xs': 'py-4',
    'sm': 'py-8',
    'md': 'py-12',
    'lg': 'py-16',
    'xl': 'py-20'
  }

  return (
    <section
      id={id}
      className={`
        ${maxWidthClasses[maxWidth]}
        mx-auto
        px-4 sm:px-6 lg:px-8
        ${paddingClasses[padding]}
        ${className}
      `.trim()}
    >
      {children}
    </section>
  )
}
