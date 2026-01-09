import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  variant?: 'default' | 'elevated' | 'outline' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  onClick?: () => void
  hover?: boolean
}

/**
 * 범용 Card 컴포넌트
 *
 * 참고: 특화된 카드는 기존 컴포넌트 사용
 * - OverviewCard: 비전/사명/가치 표시
 * - PartnerCard: 파트너 기관 표시
 * - NewsCard: 뉴스 아이템 표시
 * - ProgramCard, QuizCard 등
 *
 * @param children - 카드 콘텐츠
 * @param variant - 스타일 variant
 * @param padding - 패딩 크기
 * @param radius - border-radius 크기
 * @param className - 추가 CSS 클래스
 * @param onClick - 클릭 핸들러
 * @param hover - 호버 효과 활성화
 */
export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  radius = 'lg',
  className = '',
  onClick,
  hover = false
}: CardProps) {
  // Variant 스타일 매핑
  const variantClasses = {
    'default': 'bg-white shadow-md',
    'elevated': 'bg-white shadow-lg',
    'outline': 'bg-white border-2 border-gray-200',
    'glass': 'bg-white/80 backdrop-blur-sm border border-white/20 shadow-md'
  }

  // Padding 매핑
  const paddingClasses = {
    'none': '',
    'sm': 'p-4',
    'md': 'p-6',
    'lg': 'p-8'
  }

  // Border radius 매핑
  const radiusClasses = {
    'none': '',
    'sm': 'rounded-sm',
    'md': 'rounded-md',
    'lg': 'rounded-lg',
    'xl': 'rounded-xl'
  }

  // 호버 효과
  const hoverClasses = hover || onClick
    ? 'transition-all duration-300 hover:shadow-xl hover:scale-[1.02]'
    : ''

  // 클릭 가능 여부
  const clickableClasses = onClick
    ? 'cursor-pointer active:scale-[0.98]'
    : ''

  return (
    <div
      className={`
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${radiusClasses[radius]}
        ${hoverClasses}
        ${clickableClasses}
        ${className}
      `.trim()}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      } : undefined}
    >
      {children}
    </div>
  )
}
