'use client'

import { useEffect } from 'react'

interface Photo {
  id: string
  src: string
  title: string
  category: string
  year: string
  description: string
  photographer?: string
}

interface LightboxProps {
  photo: Photo
  onClose: () => void
}

export default function Lightbox({ photo, onClose }: LightboxProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      {/* 배경 클릭으로 닫기 */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-10"
        aria-label="닫기"
      >
        ×
      </button>
      
      {/* 이미지 컨테이너 */}
      <div className="relative max-w-4xl max-h-full flex flex-col">
        {/* 이미지 */}
        <div className="flex-1 flex items-center justify-center mb-4">
          <div className="max-w-full max-h-[70vh] bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center aspect-video">
            <div className="text-center text-gray-500">
              <div className="text-6xl mb-4">📸</div>
              <div className="text-xl">{photo.title}</div>
            </div>
          </div>
        </div>
        
        {/* 정보 패널 */}
        <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{photo.title}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  {photo.category}
                </span>
                <span>{photo.year}년</span>
                {photo.photographer && <span>📷 {photo.photographer}</span>}
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 mb-6">{photo.description}</p>
          
          {/* 액션 버튼들 */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                <span>💗</span>
                <span>좋아요</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <span>📤</span>
                <span>공유</span>
              </button>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              <span>📥</span>
              <span>다운로드</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}