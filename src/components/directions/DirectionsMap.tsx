'use client';

import { useState, useEffect } from 'react';
import KakaoMap from "../common/KakaoMap";
import ThemedButton from "../ui/ThemedButton";

interface VenueData {
  name: string;
  detailAddress: string;
  operatingHours: string;
  admission: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface DirectionsMapProps {
  venueData: VenueData;
}

export default function DirectionsMap({ venueData }: DirectionsMapProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // 모바일에서 지도 재렌더링 강제
    if (window.innerWidth < 1024) {
      const timer = setTimeout(() => {
        setMapKey(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timer);
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMapClick = () => {
    const encodedAddress = encodeURIComponent(venueData.detailAddress);
    window.open(`https://map.kakao.com/?q=${encodedAddress}`, '_blank');
  };

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
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm flex-1">
                  <h3 className="font-bold text-lg mb-4 text-orange-600 flex items-center">
                    <span className="mr-2">🎪</span>
                    행사장 정보
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1 text-sm uppercase tracking-wider">
                        주소
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {venueData.detailAddress}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1 text-sm uppercase tracking-wider">
                        운영시간
                      </h4>
                      <p className="text-gray-700">
                        {venueData.operatingHours}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1 text-sm uppercase tracking-wider">
                        입장료
                      </h4>
                      <p className="text-gray-700">
                        {venueData.admission}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 빠른 액션 버튼들 */}
                <div className="space-y-3">
                  <ThemedButton
                    onClick={handleMapClick}
                    title="카카오맵으로 길찾기"
                    theme="orange"
                    variant="primary"
                    size="lg"
                    className="w-full"
                  />
                  <ThemedButton
                    onClick={() => window.open(`https://map.naver.com/v5/search/${encodeURIComponent(venueData.detailAddress)}`, '_blank')}
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
            {/* 모바일 정보 섹션을 지도 위로 이동 */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-orange-600 flex items-center">
                <span className="mr-2">🎪</span>
                행사장 정보
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1 text-xs sm:text-sm uppercase tracking-wider">
                    주소
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {venueData.detailAddress}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1 text-xs sm:text-sm uppercase tracking-wider">
                      운영시간
                    </h4>
                    <p className="text-gray-700 text-sm">
                      {venueData.operatingHours}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1 text-xs sm:text-sm uppercase tracking-wider">
                      입장료
                    </h4>
                    <p className="text-gray-700 text-sm">
                      {venueData.admission}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 지도 영역 */}
            <div className="relative">
              <div className="h-[280px] sm:h-[350px] rounded-lg overflow-hidden bg-gray-100">
                {/* 모바일 지도 로딩 최적화 */}
                <KakaoMap
                  key={`mobile-map-${mapKey}`}
                  coordinates={venueData.coordinates}
                  venueName={venueData.name}
                  height="100%"
                  className="w-full h-full"
                />
                
                {/* 지도 탭으로 이동 버튼 */}
                <button
                  onClick={handleMapClick}
                  className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 px-3 py-2 rounded-lg shadow-lg text-xs font-medium transition-all active:scale-95"
                >
                  크게 보기
                </button>
              </div>
            </div>

            {/* 모바일 길찾기 버튼들 */}
            <div className="grid grid-cols-2 gap-3">
              <ThemedButton
                onClick={handleMapClick}
                title="카카오맵"
                theme="orange"
                variant="primary"
                size="lg"
                className="text-sm"
              />
              <ThemedButton
                onClick={() => window.open(`https://map.naver.com/v5/search/${encodeURIComponent(venueData.detailAddress)}`, '_blank')}
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
  );
}