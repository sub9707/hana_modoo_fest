'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import RouletteWheel from './RouletteWheel'
import RouletteResultModal from './RouletteResultModal'
import WinnerAnnouncement from './WinnerAnnouncement'
import MyWinnings from './MyWinnings'
import InfoCard from '@/components/common/InfoCard'
import FestivalTabHeader from '../FestivalTabHeader'
import { Prize } from '@/types/online-festival'
import { RecentWinner, RouletteResult } from '@/types/event'
import { formatRelativeTime } from '@/lib/utils/date'
import { Gift, RefreshCw } from 'lucide-react'
import Notice from '@/components/ui/Notice'

const EVENT_GUIDE = [
  { title: '참여 횟수', desc: '하루 1회 참여 가능합니다' },
  { title: '참여 자격', desc: '로그인한 회원만 참여 가능합니다' },
  { title: '상품 소진', desc: '상품 소진 시 해당 상품은 제외됩니다' },
  { title: '기프티콘 전달', desc: '가입된 전화번호로 전달됩니다' },
]

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
  const [rouletteResult, setRouletteResult] = useState<RouletteResult | null>(null)
  const [showResultModal, setShowResultModal] = useState(false)
  const pendingResultRef = useRef<RouletteResult | null>(null)

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
        const winnersWithTimeAgo: RecentWinner[] = data.data.map((winner: any) => ({
          ...winner,
          time_ago: formatRelativeTime(winner.won_at)
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
    if (!user) {
      setError('로그인이 필요합니다.')
      return
    }

    if (isSpinning || isLoading) return

    setError(null)
    pendingResultRef.current = null

    // API 호출 중임을 표시 (버튼 비활성화)
    setIsLoading(true)

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

      // 먼저 결과와 인덱스를 저장
      const result: RouletteResult = {
        success: true,
        prize: winningPrize,
        winner_id: data.data.winner_id
      }
      pendingResultRef.current = result
      setWinningPrizeIndex(prizeIndex >= 0 ? prizeIndex : 0)

      // 그 다음 스피닝 시작 (이 시점에 winningPrizeIndex가 올바른 값)
      setIsLoading(false)
      setIsSpinning(true)
    } catch (err) {
      setIsLoading(false)
      setError(err instanceof Error ? err.message : '참여 중 오류가 발생했습니다.')
    }
  }, [user, isSpinning, isLoading, prizes])

  // 룰렛 애니메이션 완료 시 호출
  const handleSpinComplete = useCallback(() => {
    setIsSpinning(false)

    // ref를 사용하므로 항상 최신 값 참조
    if (pendingResultRef.current) {
      setRouletteResult(pendingResultRef.current)
      setShowResultModal(true)
      pendingResultRef.current = null
    }

    // 테스트 앱: 참여 제한 상태 업데이트 제거 - 계속 참여 가능
    setCanParticipate(true)
    loadRecentWinners()
  }, [])

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
          <div className="inline-block px-4 py-2 border border-gray-200 rounded-md">
            <p className="text-sm text-gray-600">
              테스트 앱: 일일 참여 제한 없이 지속적으로 참여 가능합니다
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
          <Notice title="랜덤 이벤트 종료">
            <p>모두하나대축제 2025 랜덤 이벤트가 종료되었습니다.</p>
            <p>당첨 내역은 '나의 당첨 내역' 탭에서 확인하실 수 있으며, 기프티콘은 가입된 전화번호로 전달됩니다.</p>
          </Notice>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="max-w-2xl mx-auto mb-6">
          <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        </div>
      )}

      {EVENT_ENDED ? (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 종료 안내 카드 */}
          <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              랜덤 이벤트가 종료되었습니다
            </h3>
            <p className="text-gray-600">
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
                onSpinComplete={handleSpinComplete}
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
              <InfoCard title="이벤트 안내">
                <ol className="space-y-4">
                  {EVENT_GUIDE.map((item, i) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white tabular-nums">
                        {i + 1}
                      </span>
                      <div className="text-sm">
                        <p className="font-semibold text-gray-900">{item.title}</p>
                        <p className="text-gray-600">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </InfoCard>
            </div>
          </div>

          {/* 상품 안내 */}
          <InfoCard title="상품 안내" className="mt-12">
            {prizes.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {prizes.map((prize) => {
                  const prizeImage = getPrizeImage(prize.name)

                  return (
                    <div
                      key={prize.id}
                      className="rounded-lg border border-gray-100 p-4 text-center"
                    >
                      {prizeImage ? (
                        <div className="relative w-16 h-16 mx-auto mb-3">
                          <Image
                            src={prizeImage}
                            alt={prize.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="relative w-16 h-16 mx-auto mb-3 flex items-center justify-center bg-gray-50 rounded-lg">
                          <Gift className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <div className="font-bold text-gray-900 mb-1 text-sm">{prize.name}</div>
                      {prize.description && (
                        <div className="text-xs text-gray-600 mb-2">{prize.description}</div>
                      )}
                      <div className="mt-2 text-xs text-gray-500 tabular-nums">
                        남은 수량 <span className="font-semibold text-orange-600">{prize.current_quantity}</span>개
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

      {/* 결과 모달 */}
      <RouletteResultModal
        result={rouletteResult}
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
      />
    </div>
  )
}