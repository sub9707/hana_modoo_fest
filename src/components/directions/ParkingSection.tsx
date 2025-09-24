const parkingInfo = [
  {
    name: '여의도공원 주차장',
    capacity: '약 200대',
    fee: '기본 30분 1,000원',
    distance: '행사장까지 도보 3분',
    note: '행사 당일 혼잡 예상'
  },
  {
    name: '63빌딩 주차장',
    capacity: '약 1,500대',
    fee: '시간당 3,000원',
    distance: '행사장까지 도보 8분',
    note: '대형 주차장, 안정적 이용'
  },
  {
    name: '여의도 한강공원 주차장',
    capacity: '약 300대',
    fee: '기본 30분 1,200원',
    distance: '행사장까지 도보 5분',
    note: '한강 접근성 좋음'
  }
];

export default function ParkingSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* 섹션 헤더 */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="header-orange">주차 안내</span>
            </h2>
            <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto">
              행사 당일 주차 공간이 제한적이니 대중교통 이용을 권장합니다
            </p>
          </div>

          {/* 주차장 정보 카드들 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {parkingInfo.map((parking, index) => (
              <div 
                key={parking.name}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-orange-300 group"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
                    {parking.name}
                  </h3>
                  <div className="w-12 h-1 bg-gradient-to-r from-orange-300 to-pink-400 rounded group-hover:w-16 transition-all duration-300"></div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">수용대수</span>
                    <span className="font-medium text-gray-900">{parking.capacity}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">주차요금</span>
                    <span className="font-medium text-gray-900">{parking.fee}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">거리</span>
                    <span className="font-medium text-gray-900">{parking.distance}</span>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-gray-500 text-xs leading-relaxed">
                      {parking.note}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 주차 안내사항 */}
          <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg border border-orange-200 p-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold header-orange">
                주차 이용 안내
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  🚨 주의사항
                </h4>
                <div className="text-sm text-gray-600 space-y-1 pl-4">
                  <p>• 행사 당일 주차장 혼잡이 예상됩니다</p>
                  <p>• 오전 10시 이전 도착을 권장합니다</p>
                  <p>• 불법주차 시 과태료가 부과될 수 있습니다</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  💡 추천사항
                </h4>
                <div className="text-sm text-gray-600 space-y-1 pl-4">
                  <p>• 지하철 5호선, 9호선 이용 권장</p>
                  <p>• 카풀 및 대중교통 이용 시 할인 혜택</p>
                  <p>• 주차 대신 자전거 이용 시설 제공</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}