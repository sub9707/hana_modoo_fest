'use client'

import { ReactNode } from 'react'
import HeroAnimation from './HeroAnimation'

interface PageHeroProps {
  title: string | ReactNode
  subtitle?: string | ReactNode
  variant?: 'orange' | 'purple' | 'gradient-orange-pink' | 'gradient-purple-pink' | 'gradient-orange-pink-full'
  className?: string
  children?: ReactNode
  size?: 'default' | 'large'
  useAnimation?: boolean
}

/**
 * 공통 페이지 Hero 섹션 컴포넌트
 *
 * @param title - 메인 타이틀 (문자열 또는 ReactNode)
 * @param subtitle - 서브 타이틀 (선택)
 * @param variant - 배경 그라데이션 스타일
 * @param className - 추가 클래스
 * @param children - 추가 콘텐츠 (통계, 버튼 등)
 * @param size - 섹션 크기 (default: py-12, large: py-20)
 * @param useAnimation - HeroAnimation 래퍼 사용 여부 (기본값: true)
 */
export default function PageHero({
  title,
  subtitle,
  variant = 'orange',
  className = '',
  children,
  size = 'default',
  useAnimation = true
}: PageHeroProps) {
  // 배경 그라데이션 variant 매핑
  const variantClasses = {
    'orange': 'orange-gradient',
    'purple': 'bg-gradient-to-r from-purple-600 to-pink-600',
    'gradient-orange-pink': 'bg-gradient-to-br from-orange-300 to-pink-400',
    'gradient-purple-pink': 'bg-gradient-to-r from-purple-600 to-indigo-600',
    'gradient-orange-pink-full': 'bg-gradient-to-r from-orange-400 to-pink-500'
  }

  // 섹션 크기 매핑
  const sizeClasses = {
    'default': 'py-12 xl:py-12',
    'large': 'py-20'
  }

  const content = (
    <>
      {/* 타이틀 */}
      <h1 className="text-3xl sm:text-4xl mb-6 md:text-4xl lg:text-6xl xl:text-5xl font-bold leading-tight">
        {title}
      </h1>

      {/* 서브타이틀 */}
      {subtitle && (
        <p className="text-sm sm:text-xl md:text-2xl opacity-90 max-w-3xl mx-auto break-keep">
          {subtitle}
        </p>
      )}

      {/* 추가 콘텐츠 */}
      {children}
    </>
  )

  return (
    <section
      className={`relative ${variantClasses[variant]} text-white ${sizeClasses[size]} ${className}`}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {useAnimation ? (
          <HeroAnimation>{content}</HeroAnimation>
        ) : (
          <div className="text-center space-y-8 xl:space-y-12">
            {content}
          </div>
        )}
      </div>
    </section>
  )
}
