'use client'

import { Prize } from '@/types/online-festival'
import { Play, Lock, Clock, AlertCircle } from 'lucide-react'

interface RouletteWheelProps {
  prizes: Prize[]
  isSpinning: boolean
  canParticipate: boolean
  currentRotation: number
  onSpin: () => void
  hasParticipatedToday: boolean
  serverLoad: number
  isLoading: boolean
  requiresLogin: boolean
  eventEnded?: boolean
}

export default function RouletteWheel({
  prizes,
  isSpinning,
  canParticipate,
  currentRotation,
  onSpin,
  hasParticipatedToday,
  serverLoad,
  isLoading,
  requiresLogin,
  eventEnded = false
}: RouletteWheelProps) {
  
  const getButtonContent = () => {
    if (eventEnded) {
      return (
        <>
          <AlertCircle className="w-5 h-5" />
          <span>이벤트 종료</span>
        </>
      )
    }

    if (requiresLogin) {
      return (
        <>
          <Lock className="w-5 h-5" />
          <span>로그인 필요</span>
        </>
      )
    }

    if (isLoading) {
      return (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
          <span>확인 중...</span>
        </>
      )
    }

    if (hasParticipatedToday) {
      return (
        <>
          <Clock className="w-5 h-5" />
          <span>오늘 참여 완료</span>
        </>
      )
    }

    if (isSpinning) {
      return (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
          <span>추첨 중...</span>
        </>
      )
    }

    return (
      <>
        <Play className="w-5 h-5" />
        <span>룰렛 돌리기</span>
      </>
    )
  }

  if (prizes.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-festival-orange border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600">룰렛 준비 중...</p>
        </div>
      </div>
    )
  }

  const degreesPerPrize = 360 / prizes.length

  return (
    <div className="relative">
      {/* 룰렛 컨테이너 */}
      <div className="relative w-80 h-80 md:w-96 md:h-96">
        {/* 화살표 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
          <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[30px] border-l-transparent border-r-transparent border-t-red-500 drop-shadow-lg" />
        </div>

        {/* 룰렛 휠 */}
        <div
          className="absolute inset-0 rounded-full shadow-2xl overflow-hidden border-8 border-white"
          style={{
            transform: `rotate(${currentRotation}deg)`,
            transition: isSpinning ? 'transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
          }}
        >
          {prizes.map((prize, index) => {
            const rotation = index * degreesPerPrize
            return (
              <div
                key={prize.id}
                className="absolute w-full h-full origin-center"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + Math.tan((degreesPerPrize * Math.PI) / 360) * 50}% 0%)`,
                  backgroundColor: prize.color,
                }}
              >
                <div
                  className="absolute top-8 left-1/2 -translate-x-1/2 text-center"
                  style={{
                    transform: `rotate(${degreesPerPrize / 2}deg)`,
                  }}
                >
                  <div className="text-2xl mb-1">{prize.icon}</div>
                  <div className="text-xs font-bold text-white drop-shadow-md whitespace-nowrap">
                    {prize.name}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 중앙 버튼 */}
        <button
          onClick={onSpin}
          disabled={eventEnded || !canParticipate || isSpinning || hasParticipatedToday || requiresLogin || isLoading}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 
                     w-24 h-24 md:w-28 md:h-28 rounded-full 
                     bg-gradient-to-br from-yellow-400 to-orange-500 
                     flex flex-col items-center justify-center gap-2
                     border-4 border-white shadow-xl
                     disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed
                     hover:scale-110 active:scale-95 transition-transform
                     text-white font-bold text-sm"
        >
          {getButtonContent()}
        </button>
      </div>

      {/* 서버 부하 표시 (개발/테스트용) */}
      {serverLoad > 0 && !eventEnded && (
        <div className="mt-4 text-center text-xs text-gray-500">
          서버 부하: {serverLoad.toFixed(1)}%
        </div>
      )}

      {/* 이벤트 종료 안내 */}
      {eventEnded && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full">
            <AlertCircle className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700 font-medium">이벤트가 종료되었습니다</span>
          </div>
        </div>
      )}
    </div>
  )
}