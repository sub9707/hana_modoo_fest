'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Partner } from '@/types/partners'

interface PartnerCardProps {
  partner: Partner
  size?: 'small' | 'medium' | 'large'
}

export default function PartnerCard({ partner, size = 'medium' }: PartnerCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleCardClick = () => {
    if (partner.website) {
      window.open(partner.website, '_blank', 'noopener,noreferrer')
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '주최':
      case '주관':
        return {
          text: 'text-purple-600',
          bg: 'bg-purple-100',
          border: 'border-purple-200',
          gradient: 'from-purple-500 to-indigo-600'
        }
      case '후원':
        return {
          text: 'text-indigo-600',
          bg: 'bg-indigo-100', 
          border: 'border-indigo-200',
          gradient: 'from-indigo-500 to-cyan-600'
        }
      case '운영법인':
        return {
          text: 'text-cyan-600',
          bg: 'bg-cyan-100',
          border: 'border-cyan-200', 
          gradient: 'from-cyan-500 to-purple-600'
        }
      case '협력':
      case '참여기관':
        return {
          text: 'text-purple-600',
          bg: 'bg-gradient-to-r from-purple-50 to-cyan-50',
          border: 'border-purple-200',
          gradient: 'from-purple-400 to-pink-500'
        }
      default:
        return {
          text: 'text-gray-600',
          bg: 'bg-gray-100',
          border: 'border-gray-200',
          gradient: 'from-gray-500 to-gray-600'
        }
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'p-4',
          logoHeight: 'h-16',
          logoWidth: 'w-20 h-12',
          title: 'text-sm',
          description: 'text-xs line-clamp-2'
        }
      case 'large':
        return {
          container: 'p-8',
          logoHeight: 'h-32',
          logoWidth: 'w-32 h-20',
          title: 'text-2xl',
          description: 'text-base line-clamp-3'
        }
      default: // medium
        return {
          container: 'p-6',
          logoHeight: 'h-24',
          logoWidth: 'w-24 h-16',
          title: 'text-lg',
          description: 'text-sm line-clamp-2'
        }
    }
  }

  const categoryColors = getCategoryColor(partner.category)
  const sizeClasses = getSizeClasses()

  return (
    <div
      className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer transform hover:scale-105 border border-gray-100 overflow-hidden ${partner.website ? 'hover:border-purple-300' : ''}`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 배경 그라디언트 효과 */}
      <div className={`absolute inset-0 bg-gradient-to-br ${categoryColors.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
      
      {/* 상단 글로우 효과 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* 카드 콘텐츠 */}
      <div className={`relative ${sizeClasses.container} space-y-4`}>
        {/* 헤더 - 카테고리와 링크 아이콘 */}
        <div className="flex justify-between items-start">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${categoryColors.bg} ${categoryColors.text} ${categoryColors.border} border backdrop-blur-sm`}>
            {partner.category}
          </span>
          
          {/* 외부 링크 아이콘 */}
          {partner.website && (
            <div className={`transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0 scale-110' : 'opacity-0 translate-x-2'}`}>
              <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${categoryColors.gradient} flex items-center justify-center shadow-lg`}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* 로고 */}
        <div className={`flex justify-center items-center ${sizeClasses.logoHeight} p-3`}>
          {!imageError && partner.logo ? (
            <div className="relative w-full h-full">
              <Image
                src={partner.logo}
                alt={`${partner.name} 로고`}
                fill
                className="object-contain transition-all duration-500 group-hover:scale-110 filter group-hover:brightness-110"
                onError={() => setImageError(true)}
                priority={false}
              />
            </div>
          ) : (
            <div className={`flex items-center justify-center w-full h-full bg-gradient-to-br ${categoryColors.gradient} rounded-xl text-white shadow-inner`}>
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">
                  {partner.name.substring(0, 2)}
                </div>
                <div className="text-xs opacity-80">LOGO</div>
              </div>
            </div>
          )}
        </div>

        {/* 기관명 */}
        <h3 className={`${sizeClasses.title} font-bold text-gray-900 text-center group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:${categoryColors.gradient} group-hover:bg-clip-text transition-all duration-300`}>
          {partner.name}
        </h3>

        {/* 설명 */}
        <p className={`${sizeClasses.description} text-gray-600 text-center leading-relaxed`}>
          {partner.description}
        </p>

        {/* 호버 시 표시되는 CTA */}
        {partner.website && (
          <div className={`transition-all duration-300 overflow-hidden ${isHovered ? 'max-h-12 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="pt-3 border-t border-gray-100">
              <div className={`flex items-center justify-center text-sm font-medium bg-gradient-to-r ${categoryColors.gradient} bg-clip-text text-transparent`}>
                <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
                웹사이트 방문하기
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 클릭 피드백 */}
      {partner.website && (
        <div className={`absolute inset-0 bg-gradient-to-br ${categoryColors.gradient} opacity-0 group-active:opacity-10 transition-opacity duration-100 rounded-2xl`} />
      )}
    </div>
  )
}