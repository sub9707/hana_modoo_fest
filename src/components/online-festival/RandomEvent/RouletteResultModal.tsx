'use client'

import { useEffect, useState } from 'react'
import { X, Gift, RotateCcw } from 'lucide-react'
import type { RouletteResult } from '@/types/event'

interface RouletteResultModalProps {
  result: RouletteResult | null
  isOpen: boolean
  onClose: () => void
}

export default function RouletteResultModal({
  result,
  isOpen,
  onClose
}: RouletteResultModalProps) {
  const [showContent, setShowContent] = useState(false)
  const [confetti, setConfetti] = useState<{ id: number; x: number; y: number; color: string }[]>([])

  useEffect(() => {
    if (isOpen && result) {
      // 모달이 열릴 때 약간의 딜레이 후 컨텐츠 표시
      setTimeout(() => setShowContent(true), 200)
      
      // 당첨된 경우 컨페티 효과
      if (result.success && result.prize && result.prize.type !== 'none') {
        generateConfetti()
      }
    } else {
      setShowContent(false)
      setConfetti([])
    }
  }, [isOpen, result])

  const generateConfetti = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD']
    const newConfetti = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)]
    }))
    setConfetti(newConfetti)

    // 3초 후 컨페티 제거
    setTimeout(() => setConfetti([]), 3000)
  }

  const handleClose = () => {
    setShowContent(false)
    setTimeout(() => onClose(), 300)
  }

  if (!isOpen || !result) return null

  return (
    <>
      {/* 백드롭 */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* 모달 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`relative bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-4 transform transition-all duration-300 ${
            showContent
              ? 'scale-100 opacity-100 translate-y-0'
              : 'scale-95 opacity-0 translate-y-4'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 컨페티 효과 */}
          {confetti.map((piece) => (
            <div
              key={piece.id}
              className="absolute w-3 h-3 rounded-full animate-bounce"
              style={{
                backgroundColor: piece.color,
                left: `${piece.x}%`,
                top: `${piece.y}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}

          {/* 닫기 버튼 */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* 모달 내용 */}
          <div className="p-8 text-center">
            {/* 상품 아이콘 */}
            <div className="mb-6">
              <div
                className="text-8xl mx-auto animate-bounce"
                style={{ 
                  filter: result.prize ? `drop-shadow(0 0 30px ${result.prize.color}60)` : 'none',
                  animationDuration: '2s'
                }}
              >
                {result.prize?.icon}
              </div>
            </div>

            {result.success && result.prize ? (
              <>
                {/* 당첨 메시지 */}
                <div className="mb-6">
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">
                    {result.prize.type === 'none' ? (
                      <span className="text-purple-600">아쉽게도!</span>
                    ) : (
                      <span className="text-green-600">축하합니다! 🎉</span>
                    )}
                  </h3>
                  
                  <h4 
                    className="text-2xl font-semibold mb-3" 
                    style={{ color: result.prize.color }}
                  >
                    {result.prize.name}
                  </h4>
                  
                  {result.prize.description && (
                    <p className="text-gray-600 text-lg">
                      {result.prize.description}
                    </p>
                  )}
                </div>

                {/* 기프티콘 당첨 안내 */}
                {result.prize.type === 'giftcard' && result.winner_id && (
                  <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <Gift className="w-6 h-6 text-blue-600" />
                      <h5 className="text-xl font-bold text-blue-900">기프티콘 당첨!</h5>
                    </div>
                    
                    <div className="space-y-3 text-blue-700">
                      <p className="font-medium">
                        기입하신 주소로 기프티콘이 발송될 예정입니다.
                      </p>
                                       
                      <div className="text-sm space-y-1 text-blue-600">
                        <p>문의사항이 있을 시, 02-1234-1234로 연락 부탁드립니다.</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* 꽝인 경우 */}
                {result.prize.type === 'none' && (
                  <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
                    <div className="text-purple-700 space-y-2">
                      <p className="text-xl font-bold">다음 기회에 도전하세요! 💪</p>
                      <p className="text-purple-600">
                        내일 다시 참여하실 수 있습니다
                      </p>
                    </div>
                  </div>
                )}

                {/* 참여 완료 안내 */}
                <div className="mb-6 bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-600 text-sm">
                    🗓️ 오늘의 룰렛 참여가 완료되었습니다<br />
                    내일 다시 도전해보세요!
                  </p>
                </div>
              </>
            ) : (
              /* 오류 발생 시 */
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-red-600 mb-3">오류 발생</h3>
                <p className="text-gray-600">{result.error}</p>
              </div>
            )}
            
            {/* 확인 버튼 */}
            <button
              onClick={handleClose}
              className="w-full px-8 py-4 bg-gradient-to-r from-festival-orange to-festival-pink text-white rounded-2xl hover:shadow-lg transition-all duration-300 font-bold text-lg flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>확인</span>
            </button>
          </div>

          {/* 배경 글로우 효과 */}
          {result.success && result.prize && result.prize.type !== 'none' && (
            <div 
              className="absolute inset-0 rounded-3xl blur-2xl opacity-20 -z-10"
              style={{ backgroundColor: result.prize.color }}
            />
          )}
        </div>
      </div>
    </>
  )
}