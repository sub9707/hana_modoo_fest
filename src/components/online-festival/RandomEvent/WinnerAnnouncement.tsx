// components/WinnerAnnouncement.tsx
'use client'

import { useState, useEffect } from 'react'
import { Trophy, Sparkles } from 'lucide-react'
import type { RecentWinner } from '@/types/event'

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

  // 당첨자가 없을 때 표시할 기본 메시지들
  const defaultMessages = [
    { text: '🎉 첫 번째 당첨자가 되어보세요!', icon: '🎯' },
    { text: '🌟 행운의 주인공을 기다리고 있어요!', icon: '✨' },
    { text: '🎁 특별한 선물이 여러분을 기다려요!', icon: '🎊' },
    { text: '🍀 오늘의 운을 시험해보세요!', icon: '🎰' },
  ]

  useEffect(() => {
    if (winners.length === 0) return

    const interval = setInterval(() => {
      setIsVisible(false)
      
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % winners.length)
        setIsVisible(true)
      }, 300) // 페이드아웃 시간
    }, 4000) // 4초마다 변경

    return () => clearInterval(interval)
  }, [winners])

  // 기본 메시지 순환
  useEffect(() => {
    if (winners.length > 0) return

    const interval = setInterval(() => {
      setIsVisible(false)
      
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % defaultMessages.length)
        setIsVisible(true)
      }, 300)
    }, 3000) // 3초마다 변경

    return () => clearInterval(interval)
  }, [winners.length, defaultMessages.length])

  const currentWinner = winners[currentIndex]
  const currentMessage = defaultMessages[currentIndex]

  return (
    <div className={`relative ${className}`}>
      <div className="bg-gradient-to-r from-festival-orange/10 via-festival-pink/10 to-festival-purple/10 rounded-2xl p-6 border border-white/20 backdrop-blur-sm">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-gray-900">
              실시간 당첨 소식
            </h3>
          </div>
        </div>

        <div className="min-h-[80px] flex items-center justify-center">
          <div
            className={`transition-all duration-300 transform ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 -translate-y-2'
            }`}
          >
            {winners.length > 0 && currentWinner ? (
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <span 
                    className="text-2xl"
                    style={{ filter: `drop-shadow(0 0 8px ${currentWinner.prize_color}40)` }}
                  >
                    {currentWinner.prize_icon}
                  </span>
                  <div className="text-lg font-bold text-gray-900">
                    당첨을 축하합니다! 🎉
                  </div>
                </div>
                
                <div className="text-center">
                  <span className="text-festival-orange font-bold text-lg">
                    {currentWinner.masked_name}
                  </span>
                  <span className="text-gray-700 mx-2">님</span>
                  <span 
                    className="font-semibold text-lg"
                    style={{ color: currentWinner.prize_color }}
                  >
                    {currentWinner.prize_name}
                  </span>
                  <span className="text-gray-700 mx-2">당첨!</span>
                </div>
                
                <div className="text-sm text-gray-500 mt-1">
                  {currentWinner.time_ago}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <span className="text-2xl">
                    {currentMessage?.icon}
                  </span>
                </div>
                <div className="text-lg font-medium text-gray-700">
                  {currentMessage?.text}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 진행 표시기 */}
        <div className="flex justify-center mt-4 space-x-1">
          {(winners.length > 0 ? winners : defaultMessages).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-festival-orange scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 글로우 효과 */}
      <div className="absolute inset-0 bg-gradient-to-r from-festival-orange/5 via-festival-pink/5 to-festival-purple/5 rounded-2xl blur-xl -z-10"></div>
    </div>
  )
}