'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Partner } from '@/types/partners'

interface PartnerCardProps {
  partner: Partner
}

export default function PartnerCard({ partner }: PartnerCardProps) {
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
        return 'text-blue-600'
      case '후원':
      case '협력':
        return 'text-green-600'
      case '참여기관':
        return 'text-purple-600'
      default:
        return 'text-gray-600'
    }
  }

  const getCardHoverEffect = (category: string) => {
    switch (category) {
      case '주최':
      case '주관':
        return 'hover:shadow-blue-100'
      case '후원':
      case '협력':
        return 'hover:shadow-green-100'
      case '참여기관':
        return 'hover:shadow-purple-100'
      default:
        return 'hover:shadow-gray-100'
    }
  }

  return (
    <div
      className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105 border border-gray-100 overflow-hidden ${getCardHoverEffect(partner.category)}`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 배경 그라디언트 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* 카드 콘텐츠 */}
      <div className="relative p-6 space-y-4">
        {/* 카테고리 배지 */}
        <div className="flex justify-between items-start">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 ${getCategoryColor(partner.category)}`}>
            {partner.category}
          </span>
          
          {/* 외부 링크 아이콘 */}
          <div className={`transition-all duration-200 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}>
            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </div>

        {/* 로고 */}
        <div className="flex justify-center items-center h-24 p-4">
          {!imageError ? (
            <Image
              src={partner.logo}
              alt={`${partner.name} 로고`}
              width={120}
              height={80}
              className="max-w-full max-h-full object-contain transition-all duration-300 group-hover:scale-110"
              onError={() => setImageError(true)}
              priority={false}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-lg text-gray-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          )}
        </div>

        {/* 기관명 */}
        <h3 className="text-xl font-bold text-gray-900 text-center group-hover:text-blue-600 transition-colors duration-200">
          {partner.name}
        </h3>

        {/* 설명 */}
        <p className="text-sm text-gray-600 text-center leading-relaxed line-clamp-2">
          {partner.description}
        </p>

        {/* 호버 시 표시되는 추가 정보 */}
        <div className={`transition-all duration-200 overflow-hidden ${isHovered ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-center text-sm text-blue-600 font-medium">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
              </svg>
              웹사이트 방문하기
            </div>
          </div>
        </div>
      </div>

      {/* 클릭 효과 */}
      <div className="absolute inset-0 bg-blue-600 opacity-0 group-active:opacity-5 transition-opacity duration-100 rounded-2xl" />
    </div>
  )
}