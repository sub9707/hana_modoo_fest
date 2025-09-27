// components/RandomEvent.tsx
'use client'

import { useEffect, useState } from 'react'
import { Gift, AlertTriangle, Clock, RefreshCw } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouletteEvent } from '@/hooks/useRoulette'
import RouletteWheel from './RouletteWheel'
import WinnerAnnouncement from './WinnerAnnouncement'
import RouletteResultModal from './RouletteResultModal'
import MyWinnings from './MyWinnings'

export default function RandomEvent() {
  const { user } = useAuth()
  const {
    isSpinning,
    canParticipate,
    hasParticipatedToday,
    currentRotation,
    result,
    isLoading,
    error,
    prizes,
    recentWinners,
    serverLoad,
    spin,
    resetResult,
    refreshData
  } = useRouletteEvent()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleRefresh = async () => {
    await refreshData()
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    resetResult()
  }

  // 결과가 나오면 모달 열기
  useEffect(() => {
    if (result && !isSpinning) {
      setIsModalOpen(true)
    }
  }, [result, isSpinning])

  return (
    <div className="p-8 md:p-12">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-festival-orange/10 rounded-full mb-6 relative">
          <span className="text-3xl">🎰</span>
          {isLoading && (
            <div className="absolute inset-0 rounded-full border-4 border-festival-orange/30 border-t-festival-orange animate-spin"></div>
          )}
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          행운의 룰렛 이벤트
        </h2>
        <p className="text-lg text-gray-600 mb-4">
          하루 한 번! 룰렛을 돌려 특별한 선물을 받아보세요!
        </p>
        
        {/* 새로고침 버튼 */}
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="inline-flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-festival-orange transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>새로고침</span>
        </button>
      </div>

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
            <div className="grid gap-4 md:grid-cols-2">
              {prizes
                .filter(prize => prize.current_quantity > 0)
                .map((prize) => (
                <div 
                  key={prize.id} 
                  className="flex items-center justify-between p-4 bg-white/60 rounded-2xl hover:bg-white/80 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-xl group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${prize.color}20` }}
                    >
                      {prize.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {prize.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {prize.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-500">상품 정보를 불러오는 중...</div>
            </div>
          )}
        </div>

        {/* 내 당첨 내역 - 로그인한 유저만 표시 */}
        <MyWinnings />
      </div>

      {/* 룰렛 결과 모달 */}
      <RouletteResultModal
        result={result}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  )
}