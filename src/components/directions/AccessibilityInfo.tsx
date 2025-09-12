export default function AccessibilityInfo() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-festival-purple to-festival-blue text-white">
        <h2 className="text-2xl font-bold mb-2">접근성 & 편의시설</h2>
        <p className="opacity-90">모든 분들이 편안하게 참여하실 수 있도록 준비했습니다</p>
      </div>
      
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                <span className="mr-2">♿</span>
                휠체어 이용자
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 무대 앞 휠체어 전용 관람석 운영</li>
                <li>• 모든 주요 동선에 경사로 설치</li>
                <li>• 휠체어 접근 가능한 화장실 3곳</li>
                <li>• 휠체어 대여 서비스 (선착순 10대)</li>
              </ul>
            </div>
            
            <div className="bg-pink-50 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-pink-800 mb-4 flex items-center">
                <span className="mr-2">👶</span>
                영유아 동반
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 수유실 2곳 운영 (정수기, 기저귀교환대)</li>
                <li>• 유모차 주차 공간 별도 마련</li>
                <li>• 아이 동반 가족 우선 화장실</li>
                <li>• 미아방지용 팔찌 무료 배포</li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                <span className="mr-2">🏥</span>
                의료 & 안전
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 응급처치소 1곳 운영 (간호사 상주)</li>
                <li>• 자동심장충격기(AED) 2대 비치</li>
                <li>• 분실물 신고센터 운영</li>
                <li>• 안전요원 각 구역 배치</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center">
                <span className="mr-2">🚻</span>
                편의시설
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 임시 화장실 10개소 추가 설치</li>
                <li>• 손 세정제 및 물티슈 비치</li>
                <li>• 쓰레기 분리수거함 곳곳 배치</li>
                <li>• 그늘막 및 휴게 공간 제공</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl mb-2">👂</div>
            <h4 className="font-bold text-lg mb-2">청각 지원</h4>
            <p className="text-sm text-gray-600">수화 통역사 2명 배치<br/>문자 안내 서비스</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl mb-2">👁️</div>
            <h4 className="font-bold text-lg mb-2">시각 지원</h4>
            <p className="text-sm text-gray-600">점자 안내판 설치<br/>음성 안내 방송</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl mb-2">🗣️</div>
            <h4 className="font-bold text-lg mb-2">언어 지원</h4>
            <p className="text-sm text-gray-600">영어, 중국어<br/>통역 도우미 운영</p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-orange-50 border-l-4 border-orange-400">
          <div className="font-semibold text-orange-800 mb-2">📞 도움이 필요하시면</div>
          <p className="text-orange-700">
            행사 당일 현장 안내데스크 (☎ 02-000-0000) 또는 
            가까운 자원봉사자에게 언제든 도움을 요청하세요.
          </p>
        </div>
      </div>
    </div>
  )
}