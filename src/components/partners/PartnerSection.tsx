'use client';

import { useState } from 'react';
import PartnerCard from './PartnerCard';
import { Partner } from '@/types/partners';

interface PartnerSectionProps {
  title: string;
  subtitle: string;
  description: string;
  partners: Partner[];
  icon: React.ReactNode;
  gradient: string;
  bgGradient: string;
  cardSize?: 'small' | 'medium' | 'large';
  showViewMore?: boolean;
  initialDisplay?: number;
}

export default function PartnerSection({
  title,
  subtitle, 
  description,
  partners,
  icon,
  gradient,
  bgGradient,
  cardSize = 'medium',
  showViewMore = false,
  initialDisplay = 12
}: PartnerSectionProps) {
  const [showAll, setShowAll] = useState(!showViewMore);
  const [isAnimating, setIsAnimating] = useState(false);

  const displayedPartners = showAll ? partners : partners.slice(0, initialDisplay);

  const handleToggleView = () => {
    setIsAnimating(true);
    setShowAll(!showAll);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const getGridClasses = () => {
    switch (cardSize) {
      case 'small':
        return 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8';
      case 'large':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
  };

  return (
    <section className={`py-20 ${bgGradient}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* 섹션 헤더 */}
          <div className="text-center space-y-6 mb-16">
            <div className={`inline-flex items-center px-8 py-3 bg-gradient-to-r ${gradient} text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
              <div className="mr-3 text-lg">
                {icon}
              </div>
              {title}
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              {subtitle}
            </h2>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>

            {/* 파트너 수 표시 */}
            <div className="inline-flex items-center space-x-2 text-gray-500">
              <span className="text-sm">총</span>
              <span className={`text-2xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                {partners.length}
              </span>
              <span className="text-sm">개 기관</span>
            </div>
          </div>

          {/* 파트너 그리드 */}
          <div className={`grid ${getGridClasses()} gap-6 transition-all duration-500 ${isAnimating ? 'opacity-75 scale-95' : 'opacity-100 scale-100'}`}>
            {displayedPartners.map((partner, index) => (
              <div
                key={partner.id}
                className="transition-all duration-300 hover:z-10"
                style={{
                  animationDelay: `${(index % 12) * 50}ms`
                }}
              >
                <PartnerCard partner={partner} size={cardSize} />
              </div>
            ))}
          </div>

          {/* 더보기/접기 버튼 */}
          {showViewMore && partners.length > initialDisplay && (
            <div className="text-center mt-12">
              <button
                onClick={handleToggleView}
                className={`group inline-flex items-center px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-full hover:border-purple-300 hover:text-purple-600 transition-all duration-300 hover:scale-105 hover:shadow-lg`}
              >
                <span className="mr-2">
                  {showAll ? `접기` : `${partners.length - initialDisplay}개 더보기`}
                </span>
                <svg 
                  className={`w-5 h-5 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}