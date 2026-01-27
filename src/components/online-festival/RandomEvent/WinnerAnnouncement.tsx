// components/WinnerAnnouncement.tsx
'use client'

import { useState, useEffect } from 'react'
import { Trophy } from 'lucide-react'
import type { RecentWinner } from '@/types/event'

// 당첨자가 없을 때 표시할 기본 메시지들 (컴포넌트 외부 상수)
const DEFAULT_MESSAGES = [
  { text: '첫 번째 당첨자가 되어보세요!', icon: '' },
  { text: '행운의 주인공을 기다리고 있어요!', icon: '' },
  { text: '특별한 선물이 여러분을 기다려요!', icon: '' },
  { text: '오늘의 운을 시험해보세요!', icon: '' },
] as const

interface WinnerAnnouncementProps {
  winners: RecentWinner[]
  className?: string
}

export default function WinnerAnnouncement({
  winners,
  className = ''
}: WinnerAnnouncementProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (winners.length === 0) return

    const interval = setInterval(() => {
      setIsVisible(false)
      
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % winners.length)
        setIsVisible(true)
      }, 300)
    }, 4000) // 4초마다 변경

    return () => clearInterval(interval)
  }, [winners])

  // 기본 메시지 순환
  useEffect(() => {
    if (winners.length > 0) return

    const interval = setInterval(() => {
      setIsVisible(false)
      
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % DEFAULT_MESSAGES.length)
        setIsVisible(true)
      }, 300)
    }, 3000) // 3초마다 변경

    return () => clearInterval(interval)
  }, [winners.length, DEFAULT_MESSAGES.length])

  const currentWinner = winners[currentIndex]
  const currentMessage = DEFAULT_MESSAGES[currentIndex]

  return (
    <div className={`relative ${className}`}>
      <div className="bg-gradient-to-br from-white/95 via-orange-50/50 to-pink-50/50 rounded-2xl p-6 backdrop-blur-sm shadow-lg">
        {/* 헤더 */}
        <div className="flex items-center justify-center mb-4">
          <Trophy className="w-5 h-5 text-orange-500 mr-2" />
          <h3 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            실시간 당첨 소식
          </h3>
        </div>

        {/* 당첨 정보 */}
        <div className="min-h-[100px] flex items-center justify-center rounded-xl p-4">
          <div
            className={`transition-all duration-300 transform ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 -translate-y-2'
            }`}
          >
            {winners.length > 0 && currentWinner ? (
              <div className="text-center">
                <div className="text-base font-bold text-gray-900 mb-3">
                  당첨을 축하합니다!
                </div>

                <div className="text-center p-3">
                  <span className="text-orange-600 font-bold text-lg">
                    {currentWinner.masked_name}
                  </span>
                  <span className="text-gray-700 mx-2">님</span>
                  <span
                    className="font-bold text-lg"
                    style={{ color: currentWinner.prize_color }}
                  >
                    {currentWinner.prize_name}
                  </span>
                  <span className="text-gray-700 mx-2">당첨!</span>
                </div>

                <div className="text-xs text-gray-500 mt-2">
                  {currentWinner.time_ago}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-lg font-medium text-gray-700 mb-2">
                  {currentMessage?.text}
                </div>
                <div className="text-sm text-gray-500">
                  행운을 기다리고 있어요!
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 진행 표시기 */}
        <div className="flex justify-center mt-4 space-x-2">
          {(winners.length > 0 ? winners : DEFAULT_MESSAGES).map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-gradient-to-r from-orange-500 to-pink-500'
                  : 'w-4 bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 글로우 효과 */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-purple-500/10 rounded-2xl blur-2xl -z-10 animate-pulse"></div>
    </div>
  )
}