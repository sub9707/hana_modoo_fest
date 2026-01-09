'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Prize } from '@/types/online-festival'
import { Play, Lock, Clock, AlertCircle } from 'lucide-react'

const Wheel = dynamic(
  () => import('react-custom-roulette').then((mod) => mod.Wheel),
  { ssr: false }
)

// 상품명에 따른 이미지 매핑
const PRIZE_IMAGE_MAP: Record<string, string> = {
  '바나나우유': '/images/prizes/banana_milk.png',
  '치킨': '/images/prizes/chicken.png',
  '스타벅스': '/images/prizes/coffee.png',
  '커피': '/images/prizes/coffee.png',
  '꽝': '/images/prizes/no luck.png',
  '홈런볼': '/images/prizes/snack.png',
  '스낵': '/images/prizes/snack.png',
  '과자': '/images/prizes/snack.png',
}

// 상품 이미지 가져오기 함수
const getPrizeImage = (prizeName: string): string | null => {
  // 정확한 매칭
  if (PRIZE_IMAGE_MAP[prizeName]) {
    return PRIZE_IMAGE_MAP[prizeName]
  }

  // 부분 매칭 (상품명에 키워드가 포함되어 있는지 확인)
  for (const [key, value] of Object.entries(PRIZE_IMAGE_MAP)) {
    if (prizeName.includes(key) || key.includes(prizeName)) {
      return value
    }
  }

  return null
}

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
  winningPrizeIndex?: number
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
  eventEnded = false,
  winningPrizeIndex = 0
}: RouletteWheelProps) {
  const [mustSpin, setMustSpin] = useState(false)
  const [prizeNumber, setPrizeNumber] = useState(0)

  useEffect(() => {
    if (isSpinning && !mustSpin) {
      setMustSpin(true)
    }
  }, [isSpinning, mustSpin])

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

  // 주황색, 노랑색, 옅은 노랑색 팔레트 (3개씩 교차)
  const orangeYellowColors = [
    '#FF8C00', // 주황색
    '#FFD700', // 노랑색
    '#FFEC8B', // 옅은 노랑색
  ]

  // react-custom-roulette 데이터 형식으로 변환 (이미지 또는 아이콘 표시)
  const wheelData = prizes.map((prize, index) => {
    const prizeImage = getPrizeImage(prize.name)

    return {
      option: prizeImage ? '' : (prize.icon || '🎁'),
      image: prizeImage ? {
        uri: prizeImage,
        offsetX: 0,
        offsetY: 50,
        sizeMultiplier: 1.0,
        landscape: false
      } : undefined,
      style: {
        backgroundColor: orangeYellowColors[index % orangeYellowColors.length],
        textColor: '#ffffff',
      },
    }
  })

  const degreesPerPrize = 360 / prizes.length

  return (
    <div className="relative">
      {/* 룰렛 컨테이너 */}
      <div className="relative w-80 h-80 md:w-96 md:h-96 mx-auto flex items-center justify-center">
        <div className="rounded-full shadow-2xl">
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={winningPrizeIndex}
            data={wheelData}
            onStopSpinning={() => {
              setMustSpin(false)
            }}
            outerBorderColor="#ffffff"
            outerBorderWidth={8}
            innerBorderColor="#ffffff"
            innerBorderWidth={0}
            radiusLineColor="#ffffff"
            radiusLineWidth={2}
            fontSize={prizes.length <= 6 ? 45 : prizes.length <= 10 ? 40 : 35}
            textDistance={60}
            spinDuration={0.5}
          />
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
