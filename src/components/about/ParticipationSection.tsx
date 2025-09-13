interface Target {
  name: string
  description: string
  icon: string
  color: string
}

interface ParticipationSectionProps {
  targets: Target[]
}

export default function ParticipationSection({ targets }: ParticipationSectionProps) {
  const getTargetColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-gradient-to-br from-blue-500/10 to-blue-600/20',
          border: 'border-blue-400/30',
          iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
          text: 'text-blue-700',
          accent: 'text-blue-600'
        }
      case 'green':
        return {
          bg: 'bg-gradient-to-br from-green-500/10 to-green-600/20',
          border: 'border-green-400/30',
          iconBg: 'bg-gradient-to-br from-green-500 to-green-600',
          text: 'text-green-700',
          accent: 'text-green-600'
        }
      case 'purple':
        return {
          bg: 'bg-gradient-to-br from-purple-500/10 to-purple-600/20',
          border: 'border-purple-400/30',
          iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
          text: 'text-purple-700',
          accent: 'text-purple-600'
        }
      case 'pink':
        return {
          bg: 'bg-gradient-to-br from-pink-500/10 to-pink-600/20',
          border: 'border-pink-400/30',
          iconBg: 'bg-gradient-to-br from-pink-500 to-pink-600',
          text: 'text-pink-700',
          accent: 'text-pink-600'
        }
      case 'yellow':
        return {
          bg: 'bg-gradient-to-br from-yellow-500/10 to-yellow-600/20',
          border: 'border-yellow-400/30',
          iconBg: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
          text: 'text-yellow-700',
          accent: 'text-yellow-600'
        }
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-500/10 to-gray-600/20',
          border: 'border-gray-400/30',
          iconBg: 'bg-gradient-to-br from-gray-500 to-gray-600',
          text: 'text-gray-700',
          accent: 'text-gray-600'
        }
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
              누구나 참여할 수 있는 축제
            </span>
          </h2>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            모두하나대축제는 서울 시민 누구나, 어떤 형태의 가족이든 환영합니다.
            <br className="hidden sm:block" />
            여러분의 참여가 더 따뜻하고 포용적인 서울을 만듭니다.
          </p>
        </div>

        {/* 참여 대상 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {targets.map((target, index) => {
            const colors = getTargetColorClasses(target.color)
            
            return (
              <div
                key={index}
                className="group bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-105"
              >
                {/* 아이콘 */}
                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl">{target.icon}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                    {target.name}
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    {target.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* 참여 방법 안내 */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-8">
              <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                참여 방법
              </span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <h4 className="text-lg font-bold text-blue-200 mb-2">1단계</h4>
                <p className="text-white/90">사전참가 신청</p>
                <p className="text-sm text-blue-200 mt-1">온라인으로 간편하게</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💻</span>
                </div>
                <h4 className="text-lg font-bold text-green-200 mb-2">2단계</h4>
                <p className="text-white/90">온라인 캠페인 참여</p>
                <p className="text-sm text-green-200 mt-1">9-10월 사전 축제</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎪</span>
                </div>
                <h4 className="text-lg font-bold text-purple-200 mb-2">3단계</h4>
                <p className="text-white/90">현장 축제 참여</p>
                <p className="text-sm text-purple-200 mt-1">10월 18일 여의도공원</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h4 className="text-lg font-bold text-pink-200 mb-2">4단계</h4>
                <p className="text-white/90">연대와 소통</p>
                <p className="text-sm text-pink-200 mt-1">지속적인 네트워킹</p>
              </div>
            </div>
          </div>
        </div>

        {/* 특별 안내 */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-3xl p-6 md:p-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xl font-bold text-yellow-200 mb-2">특별 참여 혜택</h4>
                <ul className="space-y-2 text-white/90">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                    사전신청 시 축제 기념품 및 프로그램 우선 예약
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                    온라인 캠페인 참여자 대상 현장 이벤트 추가 혜택
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                    자조모임 및 단체 참여 시 전용 공간 및 지원 프로그램 제공
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                    자원봉사자 대상 활동 인증서 및 감사 이벤트
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 최종 CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              지금 바로 <span className="text-yellow-300">참여하세요!</span>
            </h3>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-3xl mx-auto">
              모두가 함께 만들어가는 따뜻한 축제, 모두하나대축제 2025에서 
              <br className="hidden sm:block" />
              새로운 연결과 소중한 추억을 만들어보세요.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 text-lg font-bold rounded-full hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                사전참가 신청하기
              </a>
              <a
                href="/directions"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white text-lg font-bold rounded-full hover:bg-white hover:text-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                오시는 길 확인
              </a>
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/20">
              <div className="flex flex-wrap justify-center gap-6 text-sm text-white/80">
                <a href="/contact" className="hover:text-white transition-colors duration-200">문의하기</a>
                <a href="/news" className="hover:text-white transition-colors duration-200">공지사항</a>
                <a href="/partners" className="hover:text-white transition-colors duration-200">함께하는 기관</a>
                <a href="/organization" className="hover:text-white transition-colors duration-200">기관 소개</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}