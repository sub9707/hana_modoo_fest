'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import RouletteWheel from './RouletteWheel'
import WinnerAnnouncement from './WinnerAnnouncement'
import MyWinnings from './MyWinnings'
import InfoCard from '@/components/common/InfoCard'
import FestivalTabHeader from '../FestivalTabHeader'
import { Prize } from '@/types/online-festival'
import { RecentWinner } from '@/types/event'
import { Gift, RefreshCw, AlertTriangle, Clock, AlertCircle, CheckCircle, User, LogIn, PackageX, Phone } from 'lucide-react'

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
function getPrizeImage(prizeName: string): string | null {
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

// 시간 차이 계산 함수
function getTimeAgo(wonAt: string): string {
  const now = new Date()
  const wonDate = new Date(wonAt)
  const diffMs = now.getTime() - wonDate.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return '방금 전'
  if (diffMins < 60) return `${diffMins}분 전`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}시간 전`

  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}일 전`
}

export default function RandomEvent() {
  const { user } = useAuth()
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [recentWinners, setRecentWinners] = useState<RecentWinner[]>([])
  const [isSpinning, setIsSpinning] = useState(false)
  const [canParticipate, setCanParticipate] = useState(false)
  const [currentRotation, setCurrentRotation] = useState(0)
  const [hasParticipatedToday, setHasParticipatedToday] = useState(false)
  const [serverLoad, setServerLoad] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [winningPrizeIndex, setWinningPrizeIndex] = useState(0)

  // 테스트 앱: 이벤트 항상 진행 중
  const EVENT_ENDED = false

  // 초기 데이터 로드
  useEffect(() => {
    loadInitialData()
  }, [user])

  const loadInitialData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      await Promise.all([
        loadPrizes(),
        loadRecentWinners(),
        user ? checkParticipationStatus() : Promise.resolve(),
      ])
    } catch (err) {
      console.error('Failed to load initial data:', err)
      setError('데이터를 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [user])

  const loadPrizes = async () => {
    try {
      const response = await fetch('/api/event/prizes')
      const data = await response.json()
      if (data.success) {
        setPrizes(data.data)
      }
    } catch (error) {
      console.error('Failed to load prizes:', error)
    }
  }

  const loadRecentWinners = async () => {
    try {
      const response = await fetch('/api/event/winners/recent')
      const data = await response.json()
      if (data.success && data.data) {
        // time_ago 속성 추가
        const winnersWithTimeAgo: RecentWinner[] = data.data.map((winner: any) => ({
          ...winner,
          time_ago: getTimeAgo(winner.won_at)
        }))
        setRecentWinners(winnersWithTimeAgo)
      }
    } catch (error) {
      console.error('Failed to load winners:', error)
    }
  }

  const checkParticipationStatus = async () => {
    if (!user) return

    try {
      const response = await fetch('/api/event/participation/check')
      const data = await response.json()

      if (data.success) {
        setHasParticipatedToday(data.data.hasParticipated)
        setCanParticipate(!data.data.hasParticipated)
        setServerLoad(data.data.serverLoad || 0)
      }
    } catch (error) {
      console.error('Failed to check participation:', error)
    }
  }

  const spin = useCallback(async () => {
    // 테스트 앱: 이벤트 종료 체크 제거
    // if (EVENT_ENDED) {
    //   setError('랜덤 이벤트가 종료되었습니다.')
    //   return
    // }

    if (!user) {
      setError('로그인이 필요합니다.')
      return
    }

    // 테스트 앱: 일일 참여 제한 체크 제거
    // if (hasParticipatedToday) {
    //   setError('오늘은 이미 참여하셨습니다.')
    //   return
    // }

    if (isSpinning) return

    setIsSpinning(true)
    setError(null)

    try {
      const response = await fetch('/api/event/roulette/spin', {
        method: 'POST',
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || '참여에 실패했습니다.')
      }

      const winningPrize = data.data.prize
      const prizeIndex = prizes.findIndex((p) => p.id === winningPrize.id)

      setWinningPrizeIndex(prizeIndex)

      setTimeout(() => {
        setIsSpinning(false)
        // 테스트 앱: 참여 제한 상태 업데이트 제거 - 계속 참여 가능
        // setHasParticipatedToday(true)
        // setCanParticipate(false)
        setCanParticipate(true) // 항상 참여 가능 상태 유지
        loadRecentWinners()
      }, 5500)
    } catch (err) {
      setIsSpinning(false)
      setError(err instanceof Error ? err.message : '참여 중 오류가 발생했습니다.')
    }
  }, [user, hasParticipatedToday, isSpinning, prizes, currentRotation, EVENT_ENDED])

  const handleRefresh = () => {
    loadInitialData()
  }

  return (
    <div className="p-1 py-4 sm:p-8 md:p-12">
      {/* 헤더 */}
      <FestivalTabHeader
        title="랜덤 이벤트"
        description={
          EVENT_ENDED
            ? '랜덤 이벤트가 종료되었습니다. 참여해주신 모든 분들께 감사드립니다.'
            : '룰렛을 돌려 특별한 선물을 받아보세요!'
        }
        titleColorVariant="default"
      >
        {/* 테스트 앱 안내 */}
        {!EVENT_ENDED && (
          <div className="inline-block px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700 font-medium">
              ⚙️ 테스트 앱: 일일 참여 제한 없이 지속적으로 참여 가능합니다
            </p>
          </div>
        )}

        {/* 새로고침 버튼 */}
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="inline-flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-festival-orange transition-colors disabled:opacity-50 mt-4"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>새로고침</span>
        </button>
      </FestivalTabHeader>

      {/* 이벤트 종료 안내 배너 */}
      {EVENT_ENDED && (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-orange-400 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-orange-900 mb-2 text-lg">랜덤 이벤트 종료</h3>
                <p className="text-orange-800 text-sm mb-2">
                  모두하나대축제 2025 랜덤 이벤트가 종료되었습니다.
                </p>
                <p className="text-orange-700 text-sm">
                  당첨 내역은 '나의 당첨 내역' 탭에서 확인하실 수 있으며, 기프티콘은 가입된 전화번호로 전달됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="max-w-2xl mx-auto mb-6">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-xl">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-3" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {EVENT_ENDED ? (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 종료 안내 카드 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 text-center border border-white/20 shadow-lg">
            <CheckCircle className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              랜덤 이벤트가 종료되었습니다
            </h3>
            <p className="text-gray-600 mb-6">
              많은 분들의 참여 감사드립니다. 당첨된 기프티콘은 가입하신 전화번호로 전송됩니다.
            </p>
          </div>

          {/* 나의 당첨 내역 */}
          {user && <MyWinnings />}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* 왼쪽: 룰렛 */}
            <div className="flex justify-center">
              <RouletteWheel
                prizes={prizes}
                isSpinning={isSpinning}
                canParticipate={canParticipate}
                currentRotation={currentRotation}
                onSpin={spin}
                hasParticipatedToday={hasParticipatedToday}
                serverLoad={serverLoad}
                isLoading={isLoading}
                requiresLogin={!user}
                eventEnded={EVENT_ENDED}
                winningPrizeIndex={winningPrizeIndex}
              />
            </div>

            {/* 오른쪽: 당첨자 알림 */}
            <div className="space-y-6">
              <WinnerAnnouncement 
                winners={recentWinners}
                className="lg:sticky lg:top-8"
              />

              {/* 참여 안내 */}
              <InfoCard
                title="이벤트 안내"
                icon={Clock}
                iconColor="text-orange-500"
                variant="gradient"
              >
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-orange-50/50 rounded-lg">
                    <Clock className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">참여 횟수</div>
                      <div className="text-gray-700 text-sm">하루 1회 참여 가능합니다</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-blue-50/50 rounded-lg">
                    <LogIn className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">참여 자격</div>
                      <div className="text-gray-700 text-sm">로그인한 회원만 참여 가능합니다</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-purple-50/50 rounded-lg">
                    <PackageX className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">상품 소진</div>
                      <div className="text-gray-700 text-sm">상품 소진 시 해당 상품은 제외됩니다</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-green-50/50 rounded-lg">
                    <Phone className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">기프티콘 전달</div>
                      <div className="text-gray-700 text-sm">가입된 전화번호로 전달됩니다</div>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </div>

          {/* 상품 안내 */}
          <InfoCard
            title="상품 안내"
            icon={Gift}
            iconColor="text-orange-500"
            variant="glow"
            className="mt-12"
          >
            {prizes.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {prizes.map((prize) => {
                  const prizeImage = getPrizeImage(prize.name)

                  return (
                    <div
                      key={prize.id}
                      className="group bg-gradient-to-br from-white to-gray-50/50 rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    >
                      {prizeImage ? (
                        <div className="relative w-16 h-16 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                          <Image
                            src={prizeImage}
                            alt={prize.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="relative w-16 h-16 mx-auto mb-3 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg group-hover:scale-110 transition-transform duration-300">
                          <Gift className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <div className="font-bold text-gray-900 mb-1 text-sm">{prize.name}</div>
                      {prize.description && (
                        <div className="text-xs text-gray-600 mb-2">{prize.description}</div>
                      )}
                      <div className="mt-2 px-2 py-1 bg-orange-50 rounded-full">
                        <div className="text-xs font-medium text-orange-700">
                          남은 수량: {prize.current_quantity}개
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">상품 정보를 불러오는 중...</div>
            )}
          </InfoCard>

          {/* 나의 당첨 내역 */}
          {user && (
            <div className="mt-8">
              <MyWinnings />
            </div>
          )}
        </div>
      )}
    </div>
  )
}