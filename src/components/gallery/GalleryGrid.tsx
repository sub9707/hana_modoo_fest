'use client'

import { useState } from 'react'
import Lightbox from './LightBox'

interface Photo {
  id: string
  src: string
  title: string
  category: string
  year: string
  description: string
  photographer?: string
}

export default function GalleryGrid() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  
  // 샘플 데이터 - 실제로는 props나 API에서 받아옴
  const photos: Photo[] = [
    {
      id: '1',
      src: '/images/gallery/sample1.jpg',
      title: '2024 개막식 현장',
      category: '개막식',
      year: '2024',
      description: '모든 가족이 함께하는 축제의 시작을 알리는 개막식',
      photographer: '서울시한부모가족지원센터'
    },
    {
      id: '2',
      src: '/images/gallery/sample2.jpg',
      title: '아이들의 즐거운 체험',
      category: '체험부스',
      year: '2024',
      description: '다양한 체험 프로그램을 즐기는 아이들의 모습'
    },
    {
      id: '3',
      src: '/images/gallery/sample3.jpg',
      title: '가족 단위 참가자들',
      category: '순간포착',
      year: '2024',
      description: '온 가족이 함께 참여한 행복한 순간'
    },
    // 더 많은 샘플 데이터...
    ...Array.from({ length: 12 }, (_, i) => ({
      id: String(i + 4),
      src: `/images/gallery/sample${(i % 3) + 1}.jpg`,
      title: `축제 사진 ${i + 4}`,
      category: ['공연', '체험부스', '자조모임'][i % 3],
      year: '2024',
      description: `모두하나대축제의 소중한 순간 ${i + 4}`
    }))
  ]

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="group cursor-pointer bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
            onClick={() => setSelectedPhoto(photo)}
          >
            <div className="aspect-square relative overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-sm">이미지</div>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-800">
                  크게 보기
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-800 mb-1 line-clamp-2">{photo.title}</h3>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {photo.category}
                </span>
                <span>{photo.year}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* 더보기 버튼 */}
      <div className="text-center mt-12">
        <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-full hover:shadow-lg transition-all duration-300">
          더 많은 사진 보기
        </button>
      </div>
      
      {/* 라이트박스 */}
      {selectedPhoto && (
        <Lightbox
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </>
  )
}
