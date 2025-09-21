export default function StatsOverview() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          주요 성과 통계
        </h3>
        <p className="text-gray-600">
          한부모가족지원센터의 지난 성과를 숫자로 확인해보세요
        </p>
      </div>
      
      {/* 통계 카드들이 들어갈 영역 - 추후 개발 예정 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 통계 카드 1 */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {/* 동적 수치 추후 연동 */}
              10,000+
            </div>
            <div className="text-gray-600 text-sm">
              지원 가구 수
            </div>
          </div>
        </div>

        {/* 통계 카드 2 */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              {/* 동적 수치 추후 연동 */}
              7년
            </div>
            <div className="text-gray-600 text-sm">
              운영 기간
            </div>
          </div>
        </div>

        {/* 통계 카드 3 */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              {/* 동적 수치 추후 연동 */}
              95%
            </div>
            <div className="text-gray-600 text-sm">
              만족도
            </div>
          </div>
        </div>

        {/* 통계 카드 4 */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              {/* 동적 수치 추후 연동 */}
              24/7
            </div>
            <div className="text-gray-600 text-sm">
              상담 서비스
            </div>
          </div>
        </div>
      </div>

      {/* 추후 개발 예정 영역 표시 */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400 italic">
          * 실시간 통계 데이터 연동 예정
        </p>
      </div>
    </div>
  );
}