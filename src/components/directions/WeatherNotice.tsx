'use client'

import { useState } from 'react'

export default function WeatherNotice() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-yellow-400 text-yellow-900 py-4 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 모바일 레이아웃 */}
        <div className="block sm:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center space-x-2 min-w-0">
              <span className="text-lg">🌤️</span>
              <span className="font-medium text-sm truncate">
                맑음 22°C | 미세먼지 보통 | 편안한 복장 권장
              </span>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-yellow-900 hover:text-yellow-700 font-bold text-xl flex-shrink-0"
              aria-label="공지 닫기"
            >
              ×
            </button>
          </div>
        </div>

        {/* 데스크톱 레이아웃 */}
        <div className="hidden sm:flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🌤️</span>
            <span className="font-medium">
              행사 당일 날씨: 맑음, 기온 22°C | 미세먼지: 보통 | 
              <span className="ml-2 font-bold">야외 행사로 편안한 복장을 권장합니다</span>
            </span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-yellow-900 hover:text-yellow-700 font-bold text-xl"
            aria-label="공지 닫기"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}