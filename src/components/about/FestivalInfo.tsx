interface BasicInfo {
  date: string
  time: string
  location: string
  organizer: string
  host: string
}

interface Program {
  category: string
  description: string
  icon: string
  color: string
}

interface OnlineCampaign {
  period: string
  description: string
}

interface FestivalInfoProps {
  basicInfo: BasicInfo
  programs: Program[]
  onlineCampaign: OnlineCampaign
}

export default function FestivalInfo({ basicInfo, programs, onlineCampaign }: FestivalInfoProps) {
  const getProgramColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'from-blue-500 to-blue-600 text-blue-600'
      case 'green':
        return 'from-green-500 to-green-600 text-green-600'
      case 'purple':
        return 'from-purple-500 to-purple-600 text-purple-600'
      case 'pink':
        return 'from-pink-500 to-pink-600 text-pink-600'
      case 'yellow':
        return 'from-yellow-500 to-yellow-600 text-yellow-600'
      case 'indigo':
        return 'from-indigo-500 to-indigo-600 text-indigo-600'
      default:
        return 'from-gray-500 to-gray-600 text-gray-600'
    }
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* 기본 정보 섹션 */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              축제 <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">정보</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              모두하나대축제 2025의 상세 정보를 확인하세요
            </p>
          </div>

          {/* 기본 정보 테이블 */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  행사 개요
                </span>
              </h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-4 bg-gray-50 rounded-2xl">
                  <div className="md:col-span-1">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4h6m-6 4h6m-7 5a2 2 0 002-2v-9a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2h2z" />
                      </svg>
                      <span className="font-semibold text-gray-900">일시</span>
                    </div>
                  </div>
                  <div className="md:col-span-4">
                    <div className="text-gray-700">
                      <div className="text-lg font-medium">{basicInfo.date}</div>
                      <div className="text-blue-600">{basicInfo.time}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-4 bg-gray-50 rounded-2xl">
                  <div className="md:col-span-1">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-semibold text-gray-900">장소</span>
                    </div>
                  </div>
                  <div className="md:col-span-4">
                    <div className="text-lg font-medium text-gray-700">{basicInfo.location}</div>
                    <div className="text-green-600">서울 영등포구 여의공원로 120</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-4 bg-gray-50 rounded-2xl">
                  <div className="md:col-span-1">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="font-semibold text-gray-900">주최</span>
                    </div>
                  </div>
                  <div className="md:col-span-4">
                    <div className="text-lg font-medium text-purple-600">{basicInfo.organizer}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-4 bg-gray-50 rounded-2xl">
                  <div className="md:col-span-1">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="font-semibold text-gray-900">주관</span>
                    </div>
                  </div>
                  <div className="md:col-span-4">
                    <div className="text-lg font-medium text-pink-600">{basicInfo.host}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
                  <div className="md:col-span-1">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                      <span className="font-semibold text-gray-900">참가비</span>
                    </div>
                  </div>
                  <div className="md:col-span-4">
                    <div className="text-2xl font-bold text-indigo-600">무료</div>
                    <div className="text-gray-600">누구나 자유롭게 참여 가능</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 주요 프로그램 섹션 */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              주요 <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">프로그램</span>
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              다양한 프로그램으로 구성된 풍성한 축제를 경험하세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, index) => {
              const colorClass = getProgramColorClasses(program.color)
              const [gradientClass, textClass] = colorClass.split(' text-')
              
              return (
                <div
                  key={index}
                  className="group bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border"
                >
                  {/* 아이콘 */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {program.icon}
                  </div>
                  
                  {/* 카테고리명 */}
                  <h4 className={`text-xl font-bold mb-3 text-${textClass}`}>
                    {program.category}
                  </h4>
                  
                  {/* 설명 */}
                  <p className="text-gray-600 leading-relaxed">
                    {program.description}
                  </p>

                  {/* 바로가기 링크 */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <a 
                      href="/programs"
                      className={`inline-flex items-center text-sm font-medium text-${textClass} hover:underline`}
                    >
                      자세히 보기
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 온라인 캠페인 섹션 */}
        <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-3xl p-8 md:p-12 text-white">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
              </svg>
              <span className="text-sm font-medium">Online Festival</span>
            </div>
            
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              온라인 축제 <span className="text-yellow-300">캠페인</span>
            </h3>
            
            <div className="max-w-4xl mx-auto mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="text-left">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h4 className="text-xl font-bold text-yellow-200 mb-3">캠페인 기간</h4>
                    <p className="text-2xl font-bold mb-2">{onlineCampaign.period}</p>
                    <p className="text-white/90 leading-relaxed">{onlineCampaign.description}</p>
                  </div>
                </div>
                
                <div className="text-left">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h4 className="text-xl font-bold text-blue-200 mb-3">참여 방법</h4>
                    <ul className="space-y-2 text-white/90">
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                        </svg>
                        해시태그 챌린지 참여
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                        </svg>
                        포토/스토리 업로드
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                        </svg>
                        주간 퀴즈/이벤트 참여
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/online-festival"
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
                온라인 축제 참여하기
              </a>
              <a
                href="/gallery"
                className="inline-flex items-center px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                갤러리 보기
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}