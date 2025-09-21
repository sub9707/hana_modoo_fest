'use client';

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
    <section id="directions-map" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 지도 영역 */}
            <div className="lg:col-span-2">
              <div
                onClick={handleMapClick}
                className="relative h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg cursor-pointer hover:from-blue-200 hover:to-purple-200 transition-all duration-300 group overflow-hidden"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      📍
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {venueData.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {venueData.detailAddress}
                    </p>
                    <div className="bg-white px-4 py-2 rounded-lg text-sm font-medium text-blue-600 border border-blue-200 group-hover:bg-blue-50 transition-colors duration-300 inline-block">
                      카카오맵에서 보기
                    </div>
                  </div>
                </div>

                {/* 호버 효과 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* 지도 API 연동 예정 표시 */}
                <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded text-xs text-gray-500">
                  지도 API 연동 예정
                </div>
              </div>
            </div>

            {/* 정보 패널 */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="font-bold text-lg mb-4 text-orange-600">
                  행사장 정보
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1 text-sm uppercase tracking-wider">
                      주소
                    </h4>
                    <p className="text-gray-700">
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
      </div>
    </section>
  );
}