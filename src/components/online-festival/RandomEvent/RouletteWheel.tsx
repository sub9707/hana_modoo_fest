// components/RouletteWheel.tsx
'use client'

import { useRef, useEffect } from 'react'
import { Play, Loader2 } from 'lucide-react'
import type { PrizeWithProbability } from '@/types/event'

interface RouletteWheelProps {
  prizes: PrizeWithProbability[]
  isSpinning: boolean
  canParticipate: boolean
  currentRotation: number
  onSpin: () => void
  hasParticipatedToday: boolean
  serverLoad: 'low' | 'medium' | 'high'
  isLoading: boolean
  requiresLogin: boolean
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
  requiresLogin
}: RouletteWheelProps) {
  const wheelRef = useRef<HTMLDivElement>(null)

  // 룰렛 섹션 각도 계산
  const sectionAngle = prizes.length > 0 ? 360 / prizes.length : 0

  // 서버 부하 상태 색상
  const getLoadColor = () => {
    switch (serverLoad) {
      case 'low': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'high': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  // 서버 부하 텍스트
  const getLoadText = () => {
    switch (serverLoad) {
      case 'low': return '원활'
      case 'medium': return '보통'
      case 'high': return '혼잡'
      default: return '확인중'
    }
  }

  // 버튼 상태 텍스트
  const getButtonText = () => {
    if (isLoading) return '로딩 중...'
    if (requiresLogin) return '로그인 필요'
    if (hasParticipatedToday) return '오늘 참여 완료'
    if (isSpinning) return '돌리는 중...'
    if (serverLoad === 'high') return '서버 혼잡 - 잠시만 기다려주세요'
    return '룰렛 돌리기!'
  }

  // 버튼 비활성화 조건
  const isButtonDisabled = () => {
    return isLoading ||
      requiresLogin ||
      hasParticipatedToday ||
      isSpinning ||
      (canParticipate !== null && canParticipate === false) || 
      serverLoad === 'high'
  }

  // 룰렛 회전 애니메이션 스타일
  const getWheelStyle = () => {
    if (isSpinning) {
      // 스핀 중일 때: 부드러운 감속 애니메이션
      return {
        transform: `rotate(${currentRotation}deg)`,
        transition: 'transform 4s cubic-bezier(0.23, 1, 0.32, 1)' // 더 부드러운 감속 곡선
      }
    } else {
      // 정지 상태일 때: 트랜지션 없음
      return {
        transform: `rotate(${currentRotation}deg)`,
        transition: 'none'
      }
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* 서버 상태 표시 */}
      <div className="mb-4 flex items-center space-x-2 text-sm">
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${serverLoad === 'low' ? 'bg-green-500' :
              serverLoad === 'medium' ? 'bg-yellow-500' :
                'bg-red-500'
            } ${serverLoad === 'high' ? 'animate-pulse' : ''}`}></div>
          <span className="text-gray-600">서버 상태:</span>
          <span className={getLoadColor()}>{getLoadText()}</span>
        </div>
      </div>

      {/* 룰렛 휠 */}
      <div className="relative mb-8">

        {/* 룰렛 원판 */}
        <div className="relative">
          <div
            ref={wheelRef}
            className="relative w-80 h-80 md:w-96 md:h-96 rounded-full border-8 border-white shadow-2xl overflow-hidden bg-white"
            style={getWheelStyle()}
          >
            {prizes.length > 0 ? prizes.map((prize, index) => {
              const startAngle = index * sectionAngle
              const endAngle = (index + 1) * sectionAngle

              // SVG 경로를 사용한 원형 섹션
              const centerX = 50
              const centerY = 50
              const radius = 45

              const startAngleRad = (startAngle - 90) * (Math.PI / 180)
              const endAngleRad = (endAngle - 90) * (Math.PI / 180)

              const x1 = centerX + radius * Math.cos(startAngleRad)
              const y1 = centerY + radius * Math.sin(startAngleRad)
              const x2 = centerX + radius * Math.cos(endAngleRad)
              const y2 = centerY + radius * Math.sin(endAngleRad)

              const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

              const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ')

              return (
                <div
                  key={prize.id}
                  className="absolute inset-0"
                >
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full"
                  >
                    <path
                      d={pathData}
                      fill={prize.color}
                      opacity={0.9}
                      stroke="#ffffff"
                      strokeWidth="0.5"
                    />
                  </svg>

                  {/* 텍스트 및 아이콘 */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      transform: `rotate(${startAngle + sectionAngle / 2}deg)`,
                      transformOrigin: '50% 50%'
                    }}
                  >
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div
                        className="flex flex-col items-center text-white font-bold translate-y-[-80px] md:translate-y-[-90px]"
                        style={{
                          transform: `rotate(${-(startAngle + sectionAngle / 2)}deg)`
                        }}
                      >
                        <div className="text-2xl md:text-3xl mb-1 drop-shadow-lg">
                          {prize.icon}
                        </div>
                        <div className="text-xs md:text-sm text-center leading-tight drop-shadow-lg font-bold max-w-16">
                          {prize.name.length > 6 ? (
                            // 긴 이름은 두 줄로 분할
                            prize.name.split(' ').length > 1 ?
                              prize.name.split(' ').map((word, i) => (
                                <div key={i} className="whitespace-nowrap">
                                  {word}
                                </div>
                              )) :
                              // 공백이 없으면 글자 수로 분할
                              [
                                prize.name.slice(0, Math.ceil(prize.name.length / 2)),
                                prize.name.slice(Math.ceil(prize.name.length / 2))
                              ].map((part, i) => (
                                <div key={i} className="whitespace-nowrap">
                                  {part}
                                </div>
                              ))
                          ) : (
                            <div className="whitespace-nowrap">{prize.name}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }) : (
              // 로딩 상태
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-festival-orange animate-spin" />
              </div>
            )}

            {/* 중앙 원 */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-white to-gray-100 rounded-full border-4 border-gray-300 flex items-center justify-center shadow-lg z-10">
              <span className="text-2xl md:text-3xl">🎰</span>
            </div>
          </div>
        </div>

        {/* 룰렛 그림자 효과 */}
        <div className="absolute inset-0 w-80 h-80 md:w-96 md:h-96 rounded-full bg-black/20 blur-xl transform translate-y-4 -z-10"></div>

        {/* 스핀 중 글로우 효과 */}
        {isSpinning && (
          <div className="absolute inset-0 w-80 h-80 md:w-96 md:h-96 rounded-full bg-gradient-to-r from-festival-orange/30 via-festival-pink/30 to-festival-purple/30 blur-2xl animate-pulse -z-10"></div>
        )}
      </div>

      {/* 룰렛 버튼 */}
      <div className="text-center">
        <button
          onClick={onSpin}
          disabled={isButtonDisabled()}
          className={`px-8 py-4 rounded-2xl font-bold text-white inline-flex items-center space-x-3 transform transition-all duration-300 text-lg ${isButtonDisabled()
              ? 'bg-gray-400 cursor-not-allowed scale-95'
              : 'bg-gradient-to-r from-festival-orange to-festival-pink hover:shadow-2xl hover:scale-105 active:scale-95'
            } ${isSpinning ? 'animate-pulse' : ''}`}
        >
          {isSpinning ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>{getButtonText()}</span>
            </>
          ) : (
            <>
              <Play className="w-6 h-6" />
              <span>{getButtonText()}</span>
            </>
          )}
        </button>

        {/* 추가 안내 메시지 */}
        {serverLoad === 'high' && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm animate-pulse">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>서버가 혼잡합니다. 잠시 후 다시 시도해주세요.</span>
            </div>
          </div>
        )}

        {requiresLogin && (
          <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-xl text-sm">
            룰렛 참여를 위해 로그인이 필요합니다.
          </div>
        )}

        {hasParticipatedToday && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-xl text-sm">
            오늘 이미 참여하셨습니다. 내일 다시 도전하세요!
          </div>
        )}

        {/* 스핀 중 안내 */}
        {isSpinning && (
          <div className="mt-4 p-3 bg-festival-orange/10 text-festival-orange rounded-xl text-sm animate-bounce">
            <div className="flex items-center justify-center space-x-2">
              <span className="animate-spin">🎰</span>
              <span className="font-medium">행운을 빌어요!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}