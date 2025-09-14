'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, RotateCcw, Gift, Trophy, Sparkles, Clock } from 'lucide-react'

interface Prize {
  id: number
  name: string
  description: string
  icon: string
  probability: number // 확률 (%)
  color: string
  type: 'instant' | 'coupon' | 'physical' | 'special'
}

interface SpinResult {
  prize: Prize
  timestamp: string
  spinCount: number
}

// 룰렛 상품 데이터
const prizes: Prize[] = [
  {
    id: 1,
    name: "축제 굿즈 세트",
    description: "모두하나대축제 기념 에코백 + 스티커",
    icon: "🎁",
    probability: 15,
    color: "#2563eb",
    type: "physical"
  },
  {
    id: 2,
    name: "커피 쿠폰",
    description: "인근 카페 아메리카노 1잔",
    icon: "☕",
    probability: 25,
    color: "#059669",
    type: "coupon"
  },
  {
    id: 3,
    name: "응원 메시지",
    description: "따뜻한 응원의 한마디",
    icon: "💝",
    probability: 30,
    color: "#7c3aed",
    type: "instant"
  },
  {
    id: 4,
    name: "베이커리 쿠폰",
    description: "동네 빵집 크로와상 1개",
    icon: "🥐",
    probability: 15,
    color: "#ea580c",
    type: "coupon"
  },
  {
    id: 5,
    name: "VIP 초대권",
    description: "축제 VIP 라운지 이용권",
    icon: "🌟",
    probability: 5,
    color: "#db2777",
    type: "special"
  },
  {
    id: 6,
    name: "다음 기회에!",
    description: "아쉽지만 다음에 다시 도전해보세요",
    icon: "🍀",
    probability: 10,
    color: "#6b7280",
    type: "instant"
  }
]

const encouragementMessages = [
  "오늘도 행복한 하루 보내세요! 💕",
  "가족의 사랑이 늘 함께하길 바라요! 🏠",
  "모든 순간이 소중한 추억이 되길! ✨",
  "따뜻한 마음으로 세상을 밝혀주세요! 🌟",
  "당신은 누군가의 소중한 사람입니다! 💝",
  "오늘의 작은 행복을 놓치지 마세요! 🌸",
  "가족과 함께하는 시간을 소중히 여기세요! 👨‍👩‍👧‍👦"
]

export default function RandomEvent() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentRotation, setCurrentRotation] = useState(0)
  const [result, setResult] = useState<SpinResult | null>(null)
  const [dailySpins, setDailySpins] = useState(0)
  const [totalSpins, setTotalSpins] = useState(247) // 전체 참여자 수
  const [lastSpinTime, setLastSpinTime] = useState<string | null>(null)
  const [canSpin, setCanSpin] = useState(true)
  const [timeUntilNextSpin, setTimeUntilNextSpin] = useState(0)
  const wheelRef = useRef<HTMLDivElement>(null)

  const maxDailySpins = 3 // 일일 최대 룰렛 횟수

  // 쿨다운 타이머 (5분)
  useEffect(() => {
    if (lastSpinTime) {
      const lastSpin = new Date(lastSpinTime).getTime()
      const now = Date.now()
      const cooldown = 5 * 60 * 1000 // 5분
      const timeLeft = cooldown - (now - lastSpin)
      
      if (timeLeft > 0) {
        setCanSpin(false)
        setTimeUntilNextSpin(Math.ceil(timeLeft / 1000))
        
        const timer = setInterval(() => {
          const currentTimeLeft = cooldown - (Date.now() - lastSpin)
          if (currentTimeLeft <= 0) {
            setCanSpin(true)
            setTimeUntilNextSpin(0)
            clearInterval(timer)
          } else {
            setTimeUntilNextSpin(Math.ceil(currentTimeLeft / 1000))
          }
        }, 1000)
        
        return () => clearInterval(timer)
      }
    }
  }, [lastSpinTime])

  // 룰렛 결과 계산
  const getRandomPrize = (): Prize => {
    const random = Math.random() * 100
    let accumulator = 0
    
    for (const prize of prizes) {
      accumulator += prize.probability
      if (random <= accumulator) {
        return prize
      }
    }
    
    return prizes[prizes.length - 1] // 기본값
  }

  // 룰렛 실행
  const handleSpin = () => {
    if (!canSpin || isSpinning || dailySpins >= maxDailySpins) return

    setIsSpinning(true)
    const selectedPrize = getRandomPrize()
    
    // 룰렛 애니메이션 계산
    const prizeIndex = prizes.findIndex(p => p.id === selectedPrize.id)
    const sectionAngle = 360 / prizes.length
    const targetAngle = (360 - (prizeIndex * sectionAngle + sectionAngle / 2)) % 360
    const spins = 5 + Math.random() * 3 // 5-8바퀴 회전
    const finalRotation = currentRotation + spins * 360 + targetAngle
    
    setCurrentRotation(finalRotation)
    
    // 애니메이션 완료 후 결과 표시
    setTimeout(() => {
      const newResult: SpinResult = {
        prize: selectedPrize,
        timestamp: new Date().toLocaleString('ko-KR'),
        spinCount: dailySpins + 1
      }
      
      setResult(newResult)
      setDailySpins(prev => prev + 1)
      setTotalSpins(prev => prev + 1)
      setLastSpinTime(new Date().toISOString())
      setIsSpinning(false)
      setCanSpin(false)
    }, 3000)
  }

  // 결과 초기화
  const resetResult = () => {
    setResult(null)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="p-8 md:p-12">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-festival-orange/10 rounded-full mb-6">
          <span className="text-2xl">🎰</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          행운의 룰렛 이벤트
        </h2>
        <p className="text-lg text-gray-600">
          룰렛을 돌려 특별한 선물을 받아보세요!
        </p>
      </div>

      {/* 통계 및 제한 정보 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
        <div className="text-center p-4 bg-white/50 rounded-2xl">
          <div className="text-xl md:text-2xl font-bold text-festival-orange mb-1">
            {dailySpins}
          </div>
          <div className="text-sm text-gray-600">오늘 참여</div>
        </div>
        <div className="text-center p-4 bg-white/50 rounded-2xl">
          <div className="text-xl md:text-2xl font-bold text-festival-green mb-1">
            {maxDailySpins - dailySpins}
          </div>
          <div className="text-sm text-gray-600">남은 기회</div>
        </div>
        <div className="text-center p-4 bg-white/50 rounded-2xl">
          <div className="text-xl md:text-2xl font-bold text-festival-purple mb-1">
            {totalSpins}
          </div>
          <div className="text-sm text-gray-600">전체 참여</div>
        </div>
        <div className="text-center p-4 bg-white/50 rounded-2xl">
          <div className="text-xl md:text-2xl font-bold text-festival-pink mb-1">
            5분
          </div>
          <div className="text-sm text-gray-600">쿨타임</div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* 룰렛 휠 */}
        <div className="relative mb-8">
          <div className="flex justify-center">
            <div className="relative">
              {/* 룰렛 바늘 */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500"></div>
              </div>
              
              {/* 룰렛 원판 */}
              <div
                ref={wheelRef}
                className="relative w-80 h-80 rounded-full border-4 border-white shadow-2xl overflow-hidden"
                style={{
                  transform: `rotate(${currentRotation}deg)`,
                  transition: isSpinning ? 'transform 3s cubic-bezier(0.23, 1, 0.320, 1)' : 'none'
                }}
              >
                {prizes.map((prize, index) => {
                  const angle = (360 / prizes.length) * index
                  const nextAngle = (360 / prizes.length) * (index + 1)
                  
                  return (
                    <div
                      key={prize.id}
                      className="absolute w-full h-full flex items-center justify-center"
                      style={{
                        background: `conic-gradient(from ${angle}deg, ${prize.color} 0deg, ${prize.color} ${360/prizes.length}deg, transparent ${360/prizes.length}deg)`,
                        clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((angle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((angle - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos((nextAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((nextAngle - 90) * Math.PI / 180)}%)`
                      }}
                    >
                      <div
                        className="absolute text-white text-center font-bold"
                        style={{
                          transform: `rotate(${angle + (360/prizes.length)/2}deg) translateY(-60px)`,
                          transformOrigin: 'center'
                        }}
                      >
                        <div className="text-2xl mb-1">{prize.icon}</div>
                        <div className="text-xs leading-tight px-2">
                          {prize.name.split(' ').map((word, i) => (
                            <div key={i}>{word}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
                
                {/* 중앙 원 */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full border-4 border-gray-200 flex items-center justify-center">
                  <span className="text-2xl">🎰</span>
                </div>
              </div>
            </div>
          </div>

          {/* 룰렛 버튼 */}
          <div className="text-center mt-8">
            {!canSpin && timeUntilNextSpin > 0 ? (
              <div className="bg-gray-200 text-gray-500 px-8 py-4 rounded-2xl font-bold inline-flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>다음 참여까지 {formatTime(timeUntilNextSpin)}</span>
              </div>
            ) : dailySpins >= maxDailySpins ? (
              <div className="bg-red-100 text-red-600 px-8 py-4 rounded-2xl font-bold">
                오늘의 참여 기회를 모두 사용했어요! 내일 다시 도전하세요 🌅
              </div>
            ) : (
              <button
                onClick={handleSpin}
                disabled={isSpinning}
                className={`px-8 py-4 rounded-2xl font-bold text-white inline-flex items-center space-x-2 transform transition-all duration-300 ${
                  isSpinning 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-festival-orange to-festival-pink hover:shadow-lg hover:scale-105 rainbow-shadow'
                }`}
              >
                {isSpinning ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>돌리는 중...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>룰렛 돌리기!</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* 결과 표시 */}
        {result && (
          <div className="bg-white/80 rounded-2xl p-8 text-center mb-8">
            <div className="text-6xl mb-4">{result.prize.icon}</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">축하합니다! 🎉</h3>
            <h4 className="text-xl font-semibold mb-3" style={{ color: result.prize.color }}>
              {result.prize.name}
            </h4>
            <p className="text-gray-600 mb-6">{result.prize.description}</p>
            
            {result.prize.type === 'instant' && result.prize.name === '응원 메시지' && (
              <div className="bg-purple-50 rounded-xl p-4 mb-4">
                <p className="text-purple-700 font-medium">
                  {encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)]}
                </p>
              </div>
            )}
            
            {result.prize.type === 'coupon' && (
              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <p className="text-blue-700 text-sm">
                  🎫 쿠폰은 축제 당일 현장에서 교환 가능합니다
                </p>
              </div>
            )}
            
            {result.prize.type === 'physical' && (
              <div className="bg-green-50 rounded-xl p-4 mb-4">
                <p className="text-green-700 text-sm">
                  📦 상품은 축제 현장 안내데스크에서 수령 가능합니다
                </p>
              </div>
            )}
            
            {result.prize.type === 'special' && (
              <div className="bg-yellow-50 rounded-xl p-4 mb-4">
                <p className="text-yellow-700 text-sm">
                  ⭐ 특별한 혜택입니다! 축제 당일 VIP 라운지를 이용하세요
                </p>
              </div>
            )}
            
            <div className="text-sm text-gray-500 mb-4">
              {result.timestamp} · {result.spinCount}번째 참여
            </div>
            
            <button
              onClick={resetResult}
              className="px-6 py-3 bg-festival-orange text-white rounded-xl hover:bg-festival-orange/90 transition-colors inline-flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>확인</span>
            </button>
          </div>
        )}

        {/* 상품 안내 */}
        <div className="bg-white/70 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">🎁 상품 안내</h3>
          <div className="grid gap-3">
            {prizes.map((prize) => (
              <div key={prize.id} className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{prize.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-900">{prize.name}</div>
                    <div className="text-sm text-gray-600">{prize.description}</div>
                  </div>
                </div>
                <div className="text-sm font-semibold" style={{ color: prize.color }}>
                  {prize.probability}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 주의사항 */}
        <div className="mt-6 p-4 bg-yellow-50/80 rounded-2xl border-l-4 border-yellow-400">
          <h4 className="font-semibold text-yellow-800 mb-2">📢 이벤트 안내</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• 1일 최대 3회까지 참여 가능합니다</li>
            <li>• 룰렛 참여 후 5분간 쿨타임이 있습니다</li>
            <li>• 상품 수령은 축제 당일 현장에서만 가능합니다</li>
            <li>• 이벤트는 축제 종료와 함께 마감됩니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}