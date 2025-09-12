export default function ParkingInfo() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-festival-orange to-festival-pink text-white">
        <h2 className="text-2xl font-bold mb-2">주차 안내</h2>
        <p className="opacity-90">제한적인 주차공간으로 대중교통 이용을 권장합니다</p>
      </div>
      
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="font-semibold text-red-800 mb-2">🚨 주차 제한 안내</div>
          <p className="text-red-700">
            행사 당일 주차공간이 매우 제한적이며, 주변 도로 정체가 예상됩니다. 
            가급적 <strong>대중교통을 이용</strong>해 주시기 바랍니다.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">이용 가능 주차장</h3>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-bold text-lg mb-2">여의도공원 주차장</h4>
              <ul className="space-y-1 text-gray-700">
                <li>• 요금: 최초 30분 1,200원, 추가 10분당 400원</li>
                <li>• 운영: 24시간</li>
                <li>• 주차면수: 약 300면</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-bold text-lg mb-2">국회 방문자 주차장</h4>
              <ul className="space-y-1 text-gray-700">
                <li>• 요금: 최초 1시간 2,000원</li>
                <li>• 운영: 09:00 - 18:00</li>
                <li>• 도보 10분 거리</li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">주차 대안</h3>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-bold text-lg mb-2 flex items-center">
                <span className="mr-2">🚇</span>
                파크앤라이드 (권장)
              </h4>
              <p className="text-gray-700 mb-2">지하철역 주변 주차 후 대중교통 이용</p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• 당산역, 영등포구청역 주변 공영주차장</li>
                <li>• 지하철로 10-15분 소요</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-bold text-lg mb-2 flex items-center">
                <span className="mr-2">🚲</span>
                따릉이 (공공자전거)
              </h4>
              <p className="text-gray-700">여의나루역, 국회의사당역 주변 대여소 이용</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">💡 주차 팁</h4>
          <ul className="space-y-1 text-gray-600 text-sm">
            <li>• 오전 10시 이전 도착 시 주차 성공률이 높습니다</li>
            <li>• 주변 백화점, 대형마트 주차장은 행사와 무관한 이용이 어려울 수 있습니다</li>
            <li>• 카카오맵, 네이버맵에서 실시간 주차장 정보를 확인하세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}