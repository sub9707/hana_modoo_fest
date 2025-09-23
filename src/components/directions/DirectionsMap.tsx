'use client';

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
          <div className="lg:hidden space-y-6">
            {/* 지도 영역 */}
            <div className="relative">
              <div className="h-[300px] sm:h-[400px] rounded-lg overflow-hidden">
                <KakaoMap
                  coordinates={venueData.coordinates}
                  venueName={venueData.name}
                  height="100%"
                  className="w-full h-full"
                />
                
                {/* 모바일에서 지도 위 정보 오버레이 */}
                <div className="absolute top-4 left-4 right-4">
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                    <h3 className="font-bold text-lg text-gray-800">
                      {venueData.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {venueData.detailAddress}
                    </p>
                  </div>
                </div>

                {/* 모바일 빠른 액션 버튼 */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex gap-2">
                    <ThemedButton
                      onClick={handleMapClick}
                      title="카카오맵"
                      theme="orange"
                      variant="primary"
                      size="sm"
                      className="flex-1 text-xs"
                    />
                    <ThemedButton
                      onClick={() => window.open(`https://map.naver.com/v5/search/${encodeURIComponent(venueData.detailAddress)}`, '_blank')}
                      title="네이버맵"
                      theme="orange"
                      variant="secondary"
                      size="sm"
                      className="flex-1 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 모바일 정보 섹션 */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-orange-600 flex items-center">
                <span className="mr-2">🎪</span>
                행사장 정보
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1 text-sm uppercase tracking-wider">
                    주소
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {venueData.detailAddress}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-1 text-sm uppercase tracking-wider">
                    운영시간
                  </h4>
                  <p className="text-gray-700 text-sm">
                    {venueData.operatingHours}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-1 text-sm uppercase tracking-wider">
                    입장료
                  </h4>
                  <p className="text-gray-700 text-sm">
                    {venueData.admission}
                  </p>
                </div>
              </div>
            </div>

            {/* 모바일 추가 액션 버튼들 */}
            <div className="grid grid-cols-2 gap-3">
              <ThemedButton
                onClick={handleMapClick}
                title="카카오맵으로 길찾기"
                theme="orange"
                variant="primary"
                size="lg"
              />
              <ThemedButton
                onClick={() => window.open(`https://map.naver.com/v5/search/${encodeURIComponent(venueData.detailAddress)}`, '_blank')}
                title="네이버맵으로 길찾기"
                theme="orange"
                variant="secondary"
                size="lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}