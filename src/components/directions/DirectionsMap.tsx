'use client'

import { useState, useEffect } from 'react'
import KakaoMap from '../common/KakaoMap'
import ThemedButton from '../ui/ThemedButton'
import { VenueInfoPanel } from './shared'

interface VenueData {
  name: string
  detailAddress: string
  operatingHours: string
  admission: string
  coordinates: {
    lat: number
    lng: number
  }
}

interface DirectionsMapProps {
  venueData: VenueData
}

export default function DirectionsMap({ venueData }: DirectionsMapProps) {
  const [mapKey, setMapKey] = useState(0)

  useEffect(() => {
    // 모바일에서 지도 재렌더링 강제
    if (window.innerWidth < 1024) {
      const timer = setTimeout(() => {
        setMapKey((prev) => prev + 1)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleKakaoMapClick = () => {
    const encodedAddress = encodeURIComponent(venueData.detailAddress)
    window.open(`https://map.kakao.com/?q=${encodedAddress}`, '_blank')
  }

  const handleNaverMapClick = () => {
    const encodedAddress = encodeURIComponent(venueData.detailAddress)
    window.open(`https://map.naver.com/v5/search/${encodedAddress}`, '_blank')
  }

  return (
    <section id="directions-map" className="py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* 데스크톱 레이아웃 */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-3 gap-8 h-[500px]">
              {/* 지도 영역 */}
              <div className="col-span-2 h-full">
                <div className="relative h-full rounded-lg overflow-hidden">
                  <KakaoMap
                    key="desktop-map"
                    coordinates={venueData.coordinates}
                    venueName={venueData.name}
                    height="100%"
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* 정보 패널 */}
              <div className="h-full flex flex-col space-y-6">
                <VenueInfoPanel
                  address={venueData.detailAddress}
                  operatingHours={venueData.operatingHours}
                  admission={venueData.admission}
                  variant="desktop"
                />

                {/* 빠른 액션 버튼들 */}
                <div className="space-y-3">
                  <ThemedButton
                    onClick={handleKakaoMapClick}
                    title="카카오맵으로 길찾기"
                    theme="orange"
                    variant="primary"
                    size="lg"
                    className="w-full"
                  />
                  <ThemedButton
                    onClick={handleNaverMapClick}
                    title="네이버맵으로 길찾기"
                    theme="orange"
                    variant="secondary"
                    size="lg"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 모바일/태블릿 레이아웃 */}
          <div className="lg:hidden space-y-4 sm:space-y-6">
            {/* 모바일 정보 섹션 */}
            <VenueInfoPanel
              address={venueData.detailAddress}
              operatingHours={venueData.operatingHours}
              admission={venueData.admission}
              variant="mobile"
            />

            {/* 지도 영역 */}
            <div className="relative">
              <div className="h-[280px] sm:h-[350px] rounded-lg overflow-hidden bg-gray-100">
                <KakaoMap
                  key={`mobile-map-${mapKey}`}
                  coordinates={venueData.coordinates}
                  venueName={venueData.name}
                  height="100%"
                  className="w-full h-full"
                />

                {/* 지도 크게 보기 버튼 */}
                <button
                  onClick={handleKakaoMapClick}
                  className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 px-3 py-2 rounded-lg shadow-lg text-xs font-medium transition-all active:scale-95"
                >
                  크게 보기
                </button>
              </div>
            </div>

            {/* 모바일 길찾기 버튼들 */}
            <div className="grid grid-cols-2 gap-3">
              <ThemedButton
                onClick={handleKakaoMapClick}
                title="카카오맵"
                theme="orange"
                variant="primary"
                size="lg"
                className="text-sm"
              />
              <ThemedButton
                onClick={handleNaverMapClick}
                title="네이버맵"
                theme="orange"
                variant="secondary"
                size="lg"
                className="text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
