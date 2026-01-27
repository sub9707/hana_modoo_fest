'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Modal from '@/components/common/Modal'
import type { RouletteResult } from '@/types/event'

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

function getPrizeImage(prizeName: string): string | null {
  if (PRIZE_IMAGE_MAP[prizeName]) {
    return PRIZE_IMAGE_MAP[prizeName]
  }

  for (const [key, value] of Object.entries(PRIZE_IMAGE_MAP)) {
    if (prizeName.includes(key) || key.includes(prizeName)) {
      return value
    }
  }

  return null
}

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

  useEffect(() => {
    if (isOpen && result) {
      setTimeout(() => setShowContent(true), 100)
    } else {
      setShowContent(false)
    }
  }, [isOpen, result])

  const handleClose = () => {
    setShowContent(false)
    setTimeout(() => onClose(), 200)
  }

  if (!result) return null

  const prizeImage = result.prize ? getPrizeImage(result.prize.name) : null
  const isWin = result.success && result.prize && result.prize.type !== 'none'

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      showCloseButton={true}
      closeOnBackdrop={true}
    >
      <div className={`p-8 text-center transition-opacity duration-200 ${
        showContent ? 'opacity-100' : 'opacity-0'
      }`}>
        {result.success && result.prize ? (
          <>
            {/* 상품 이미지 */}
            <div className="mb-6">
              {prizeImage ? (
                <div className="relative w-32 h-32 mx-auto">
                  <Image
                    src={prizeImage}
                    alt={result.prize.name}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="text-7xl mx-auto">
                  {result.prize.icon}
                </div>
              )}
            </div>

            {/* 상품명 */}
            <h3
              className="text-2xl font-bold mb-2"
              style={{ color: result.prize.color || '#333' }}
            >
              {result.prize.name}
            </h3>

            {result.prize.description && (
              <p className="text-gray-600 mb-6">
                {result.prize.description}
              </p>
            )}

            {/* 안내 문구 */}
            {isWin ? (
              <p className="text-sm text-gray-500 mb-6">
                상품은 이벤트 종료 후 기재하신 번호로 안내드립니다
              </p>
            ) : (
              <p className="text-sm text-gray-500 mb-6">
                다음 기회에 도전해보세요
              </p>
            )}
          </>
        ) : (
          <div className="mb-6">
            <h3 className="text-xl font-bold text-red-600 mb-3">오류 발생</h3>
            <p className="text-gray-600">{result.error}</p>
          </div>
        )}

        {/* 확인 버튼 */}
        <button
          onClick={handleClose}
          className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all font-semibold"
        >
          확인
        </button>
      </div>
    </Modal>
  )
}
