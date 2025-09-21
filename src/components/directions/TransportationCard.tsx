'use client';

import { useState } from 'react';

interface Route {
  line: string;
  station: string;
  exit: string;
  walkTime: string;
  color: string;
}

interface TransportationData {
  type: string;
  routes: Route[];
}

interface TransportationCardProps {
  data: TransportationData;
  index: number;
  isSelected: boolean;
  onSelect: (type: string | null) => void;
}

const colorClasses = {
  purple: 'bg-purple-100 text-purple-800',
  amber: 'bg-amber-100 text-amber-800',
  blue: 'bg-blue-100 text-blue-800',
  green: 'bg-green-100 text-green-800',
  gray: 'bg-gray-100 text-gray-800',
  orange: 'bg-orange-100 text-orange-800',
  pink: 'bg-pink-100 text-pink-800'
};

export default function TransportationCard({ 
  data, 
  index, 
  isSelected, 
  onSelect 
}: TransportationCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    onSelect(isSelected ? null : data.type);
  };

  const getTransportIcon = (type: string) => {
    switch (type) {
      case '지하철': return '🚇';
      case '버스': return '🚌';
      case '자가용': return '🚗';
      default: return '🚇';
    }
  };

  return (
    <div 
      className={`
        relative bg-white rounded-lg border transition-all duration-300 cursor-pointer
        ${isSelected || isHovered 
          ? 'border-orange-300 shadow-lg scale-105' 
          : 'border-gray-200 shadow-sm hover:border-gray-300'
        }
      `}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${index * 150}ms`
      }}
    >
      {/* 상단 헤더 */}
      <div className={`
        p-6 border-b border-gray-100 transition-all duration-300
        ${isSelected || isHovered ? 'bg-gradient-to-r from-orange-50 to-pink-50' : ''}
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getTransportIcon(data.type)}</span>
            <h3 className="text-lg font-bold text-gray-900">
              {data.type}
            </h3>
          </div>
          
          <div className={`
            w-3 h-3 rounded-full transition-all duration-300
            ${isSelected || isHovered
              ? 'bg-gradient-to-r from-orange-400 to-pink-400 scale-125'
              : 'bg-gray-300'
            }
          `} />
        </div>
      </div>

      {/* 루트 정보 */}
      <div className="p-6 space-y-4">
        {data.routes.map((route, routeIndex) => (
          <div key={routeIndex} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`
                px-2 py-1 rounded text-xs font-medium
                ${colorClasses[route.color as keyof typeof colorClasses] || colorClasses.gray}
              `}>
                {route.line}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                {route.walkTime}
              </span>
            </div>
            
            <div className="text-sm text-gray-700">
              <p className="font-medium">{route.station}</p>
              <p className="text-gray-500">{route.exit}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 선택 표시 */}
      {isSelected && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-pink-400 rounded-t-lg"></div>
      )}

      {/* 호버/선택 시 배경 효과 */}
      <div className={`
        absolute inset-0 bg-gradient-to-br from-orange-400/5 to-pink-400/5 rounded-lg opacity-0 transition-opacity duration-300 pointer-events-none
        ${isSelected || isHovered ? 'opacity-100' : ''}
      `} />
    </div>
  );
}