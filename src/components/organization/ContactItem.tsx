'use client';

import { useState } from 'react';

interface ContactItemData {
  label: string;
  value: string;
  type: 'address' | 'phone' | 'email' | 'website' | 'fax' | 'hours';
  action?: () => void;
}

interface ContactItemProps {
  item: ContactItemData;
  index: number;
}

export default function ContactItem({ item, index }: ContactItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isClickable = !!item.action;

  return (
    <div 
      className={`
        group relative overflow-hidden bg-white border border-gray-200 rounded-lg
        transition-all duration-300 hover:shadow-md
        ${isClickable ? 'cursor-pointer hover:border-purple-300' : 'hover:border-gray-300'}
      `}
      onClick={item.action}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${index * 100}ms`
      }}
    >
      {/* 왼쪽 그라데이션 바 */}
      <div className={`
        absolute left-0 top-0 w-1 h-full transition-all duration-300
        ${isHovered && isClickable
          ? 'bg-gradient-to-b from-blue-600 to-purple-600 w-2'
          : 'bg-gradient-to-b from-cyan-300 to-purple-300'
        }
      `} />

      <div className="flex items-center justify-between p-6 pl-8">
        {/* 왼쪽 레이블과 값 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-4">
            <h4 className={`
              font-semibold text-gray-800 text-sm uppercase tracking-wider min-w-[80px]
              ${isHovered && isClickable ? 'text-purple-600' : ''}
            `}>
              {item.label}
            </h4>
            <p className={`
              text-gray-700 leading-relaxed transition-colors duration-300
              ${isHovered && isClickable ? 'text-gray-900 font-medium' : ''}
              ${isClickable ? 'group-hover:underline underline-offset-4 decoration-purple-300' : ''}
            `}>
              {item.value}
            </p>
          </div>
        </div>

        {/* 오른쪽 인터랙션 표시 */}
        {isClickable && (
          <div className={`
            flex items-center transition-all duration-300 ml-4
            ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'}
          `}>
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
              ${isHovered 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 scale-110' 
                : 'bg-gray-200'
              }
            `}>
              <div className={`
                w-2 h-2 border-t-2 border-r-2 rotate-45 transition-colors duration-300
                ${isHovered ? 'border-white' : 'border-gray-500'}
              `} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}