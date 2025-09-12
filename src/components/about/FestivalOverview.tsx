interface FestivalOverviewProps {
  overview: {
    date: string
    time: string
    location: string
    host: string
    organizer: string
    programs: string[]
    onlinePeriod: string
  }
}

export default function FestivalOverview({ overview }: FestivalOverviewProps) {
  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            행사 개요
          </h2>
          <p className="text-xl text-gray-600">
            모두하나대축제 2025의 상세 정보를 확인하세요
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* 기본 정보 */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                기본 정보
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-20 text-gray-500 font-medium">일시</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{overview.date}</div>
                    <div className="text-gray-600">{overview.time}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-20 text-gray-500 font-medium">장소</div>
                  <div className="flex-1 font-semibold text-gray-900">{overview.location}</div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-20 text-gray-500 font-medium">주최</div>
                  <div className="flex-1 font-semibold text-gray-900">{overview.host}</div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-20 text-gray-500 font-medium">주관</div>
                  <div className="flex-1 font-semibold text-gray-900">{overview.organizer}</div>
                </div>

                <div className="flex items-start">
                  <div className="w-20 text-gray-500 font-medium">온라인</div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">캠페인 기간</div>
                    <div className="text-gray-600">{overview.onlinePeriod}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 주요 프로그램 */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white mr-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 002 2h8a2 2 0 002-2V3a2 2 0 012 2v6h-3a2 2 0 00-2 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 3a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                </div>
                주요 프로그램
              </h3>
              
              <div className="space-y-4">
                {overview.programs.map((program, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 mt-1 flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 text-gray-700 leading-relaxed">
                      {program}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 참여 방법 안내 */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">참여 방법</h3>
            <p className="text-xl mb-6 text-blue-100">
              온라인 캠페인과 현장 축제, 두 가지 방법으로 참여하실 수 있습니다
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 rounded-xl p-6">
                <h4 className="text-xl font-semibold mb-3">온라인 참여</h4>
                <p className="text-blue-100 mb-4">
                  9월부터 시작되는 해시태그 챌린지, 포토 업로드, 퀴즈 등에 참여하세요
                </p>
                <div className="text-sm text-blue-200">
                  기간: {overview.onlinePeriod}
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <h4 className="text-xl font-semibold mb-3">현장 참여</h4>
                <p className="text-blue-100 mb-4">
                  축제 당일 여의도공원에서 다양한 프로그램과 부스를 체험하세요
                </p>
                <div className="text-sm text-blue-200">
                  일시: {overview.date} {overview.time}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}