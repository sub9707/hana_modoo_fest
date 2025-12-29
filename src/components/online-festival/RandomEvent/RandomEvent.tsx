'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import RouletteWheel from './RouletteWheel'
import WinnerAnnouncement from './WinnerAnnouncement'
import MyWinnings from './MyWinnings'
import { Prize } from '@/types/online-festival'
import { RecentWinner } from '@/types/event'
import { Gift, RefreshCw, AlertTriangle, Clock, AlertCircle } from 'lucide-react'

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

  // 이벤트 종료 상태
  const EVENT_ENDED = true

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
    if (EVENT_ENDED) {
      setError('랜덤 이벤트가 종료되었습니다.')
      return
    }

    if (!user) {
      setError('로그인이 필요합니다.')
      return
    }

    if (hasParticipatedToday) {
      setError('오늘은 이미 참여하셨습니다.')
      return
    }

    if (isSpinning) return

    setIsSpinning(true)
    setError(null)

    try {
      const response = await fetch('/api/event/participation/spin', {
        method: 'POST',
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || '참여에 실패했습니다.')
      }

      const winningPrize = data.data.prize
      const prizeIndex = prizes.findIndex((p) => p.id === winningPrize.id)

      const spins = 5
      const degreesPerPrize = 360 / prizes.length
      const targetRotation = 360 * spins + prizeIndex * degreesPerPrize

      setCurrentRotation(currentRotation + targetRotation)

      setTimeout(() => {
        setIsSpinning(false)
        setHasParticipatedToday(true)
        setCanParticipate(false)
        loadRecentWinners()
      }, 5000)
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
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
          <span className="text-2xl">🎰</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          랜덤 이벤트
        </h2>
        <p className="text-md sm:text-lg text-gray-600">
          {EVENT_ENDED 
            ? '랜덤 이벤트가 종료되었습니다. 참여해주신 모든 분들께 감사드립니다.'
            : '룰렛을 돌려 특별한 선물을 받아보세요!'
          }
        </p>
        
        {/* 새로고침 버튼 */}
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="inline-flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-festival-orange transition-colors disabled:opacity-50 mt-4"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>새로고침</span>
        </button>
      </div>

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
            <div className="text-6xl mb-6">🎁</div>
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
              />
            </div>

            {/* 오른쪽: 당첨자 알림 */}
            <div className="space-y-6">
              <WinnerAnnouncement 
                winners={recentWinners}
                className="lg:sticky lg:top-8"
              />

              {/* 참여 안내 */}
              <div className="bg-white/70 rounded-2xl p-6 border border-white/20 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-festival-orange" />
                  이벤트 안내
                </h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start space-x-3">
                    <span className="text-festival-orange font-bold">•</span>
                    <span>하루 1회 참여 가능합니다</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-festival-orange font-bold">•</span>
                    <span>로그인한 회원만 참여 가능합니다</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-festival-orange font-bold">•</span>
                    <span>상품 소진 시 해당 상품은 제외됩니다</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-festival-orange font-bold">•</span>
                    <span>기프티콘은 가입된 전화번호로 전달됩니다.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 상품 안내 */}
          <div className="mt-12 bg-white/80 rounded-3xl p-8 border border-white/20 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center">
              <Gift className="w-6 h-6 mr-3 text-festival-orange" />
              상품 안내
            </h3>
            
            {prizes.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {prizes.map((prize) => (
                  <div
                    key={prize.id}
                    className="bg-white/60 rounded-xl p-4 text-center border border-white/40 hover:shadow-md transition-shadow"
                  >
                    <div className="text-3xl mb-2">{prize.icon}</div>
                    <div className="font-semibold text-gray-900 mb-1">{prize.name}</div>
                    {prize.description && (
                      <div className="text-xs text-gray-600">{prize.description}</div>
                    )}
                    <div className="mt-2 text-xs text-gray-500">
                      남은 수량: {prize.current_quantity}개
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">상품 정보를 불러오는 중...</div>
            )}
          </div>

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