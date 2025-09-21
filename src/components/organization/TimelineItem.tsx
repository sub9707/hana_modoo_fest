// components/common/TimelineItem.tsx
'use client';

import { useState } from 'react';

interface Achievement {
  year: string;
  content: string;
}

interface TimelineItemProps {
  achievement: Achievement;
  index: number;
  isSelected: boolean;
  onSelect: (year: string | null) => void;
}

export default function TimelineItem({ 
  achievement, 
  index, 
  isSelected, 
  onSelect 
}: TimelineItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isEven = index % 2 === 0;

  const handleClick = () => {
    onSelect(isSelected ? null : achievement.year);
  };

  return (
    <div
      className={`relative flex items-center ${
        isEven ? 'md:flex-row' : 'md:flex-row-reverse'
      } group cursor-pointer`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 연도 표시 - 데스크톱 */}
      <div className={`hidden md:flex w-1/2 ${isEven ? 'justify-end pr-8' : 'justify-start pl-8'}`}>
        <div className={`
          text-2xl font-bold transition-all duration-300
          ${isSelected || isHovered 
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent scale-110' 
            : 'text-gray-500'
          }
        `}>
          {achievement.year}
        </div>
      </div>

      {/* 중앙 원 - 데스크톱 */}
      <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 z-10">
        <div className={`
          w-4 h-4 rounded-full transition-all duration-300 border-4 border-white shadow-lg
          ${isSelected || isHovered
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 scale-150'
            : 'bg-gray-300 group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-purple-300'
          }
        `} />
      </div>

      {/* 내용 카드 - 데스크톱 */}
      <div className={`hidden md:flex w-1/2 ${isEven ? 'justify-start pl-8' : 'justify-end pr-8'}`}>
        <div className={`
          max-w-md p-6 bg-white rounded-lg border transition-all duration-300 shadow-sm
          ${isSelected 
            ? 'border-purple-300 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 scale-105' 
            : isHovered 
              ? 'border-blue-300 shadow-md bg-gradient-to-br from-cyan-50 to-indigo-50' 
              : 'border-gray-200 hover:border-gray-300'
          }
        `}>
          <p className={`
            text-gray-700 leading-relaxed font-medium
            ${isSelected ? 'text-gray-900' : ''}
          `}>
            {achievement.content}
          </p>
        </div>
      </div>

      {/* 모바일 레이아웃 */}
      <div className="md:hidden flex items-center">
        {/* 왼쪽 연도와 원 - 고정 폭 영역 */}
        <div className="w-[50px] flex flex-col items-center relative">
          <div className={`
            text-xs font-bold mb-1 transition-all duration-300 text-center
            ${isSelected || isHovered 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent' 
              : 'text-gray-500'
            }
          `}>
            {achievement.year}
          </div>
          <div className={`
            w-4 h-4 rounded-full transition-all duration-300 border-4 border-white shadow-lg relative z-10
            ${isSelected || isHovered
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 scale-125'
              : 'bg-gray-300'
            }
          `} />
        </div>

        {/* 내용 카드 */}
        <div className={`
          flex-1 ml-4 p-4 bg-white rounded-lg border transition-all duration-300 shadow-sm
          ${isSelected 
            ? 'border-purple-300 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50' 
            : isHovered 
              ? 'border-blue-300 shadow-md bg-gradient-to-br from-cyan-50 to-indigo-50' 
              : 'border-gray-200'
          }
        `}>
          <p className={`
            text-gray-700 leading-relaxed text-sm
            ${isSelected ? 'text-gray-900 font-medium' : ''}
          `}>
            {achievement.content}
          </p>
        </div>
      </div>
    </div>
  );
}