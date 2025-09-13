interface CoreValue {
  title: string
  subtitle: string
  description: string
  icon: string
  color: string
}

interface FestivalOverviewProps {
  coreValues: CoreValue[]
  purpose: string
  significance: string
}

export default function FestivalOverview({ coreValues, purpose, significance }: FestivalOverviewProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-gradient-to-br from-blue-500/10 to-blue-600/20',
          border: 'border-blue-400/30',
          text: 'text-blue-700',
          accent: 'text-blue-600',
          hover: 'hover:from-blue-500/20 hover:to-blue-600/30',
          iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600'
        }
      case 'green':
        return {
          bg: 'bg-gradient-to-br from-green-500/10 to-green-600/20',
          border: 'border-green-400/30',
          text: 'text-green-700',
          accent: 'text-green-600',
          hover: 'hover:from-green-500/20 hover:to-green-600/30',
          iconBg: 'bg-gradient-to-br from-green-500 to-green-600'
        }
      case 'purple':
        return {
          bg: 'bg-gradient-to-br from-purple-500/10 to-purple-600/20',
          border: 'border-purple-400/30',
          text: 'text-purple-700',
          accent: 'text-purple-600',
          hover: 'hover:from-purple-500/20 hover:to-purple-600/30',
          iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600'
        }
      case 'pink':
        return {
          bg: 'bg-gradient-to-br from-pink-500/10 to-pink-600/20',
          border: 'border-pink-400/30',
          text: 'text-pink-700',
          accent: 'text-pink-600',
          hover: 'hover:from-pink-500/20 hover:to-pink-600/30',
          iconBg: 'bg-gradient-to-br from-pink-500 to-pink-600'
        }
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-500/10 to-gray-600/20',
          border: 'border-gray-400/30',
          text: 'text-gray-700',
          accent: 'text-gray-600',
          hover: 'hover:from-gray-500/20 hover:to-gray-600/30',
          iconBg: 'bg-gradient-to-br from-gray-500 to-gray-600'
        }
    }
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            축제 <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">개요</span>
          </h2>
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border hover:shadow-xl transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-blue-600 mb-3">목적 Purpose</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">{purpose}</p>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border hover:shadow-xl transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-purple-600 mb-3">의의 Significance</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">{significance}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 핵심 가치 카드들 */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">핵심 가치</span>
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              모두하나대축제가 추구하는 네 가지 핵심 가치입니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {coreValues.map((value, index) => {
              const colors = getColorClasses(value.color)
              
              return (
                <div
                  key={index}
                  className={`group relative bg-white p-6 md:p-8 rounded-3xl border transition-all duration-500 hover:scale-105 hover:shadow-2xl ${colors.hover}`}
                >
                  {/* 배경 장식 */}
                  <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                    <div className="text-6xl">{value.icon}</div>
                  </div>
                  
                  {/* 아이콘 */}
                  <div className={`w-16 h-16 rounded-2xl ${colors.iconBg} flex items-center justify-center text-white text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {value.icon}
                  </div>
                  
                  {/* 콘텐츠 */}
                  <div className="relative z-10">
                    <h4 className={`text-xl md:text-2xl font-bold mb-2 ${colors.accent}`}>
                      {value.title}
                    </h4>
                    <p className={`text-sm font-medium mb-4 opacity-80 ${colors.text}`}>
                      {value.subtitle}
                    </p>
                    <p className={`text-base leading-relaxed ${colors.text}`}>
                      {value.description}
                    </p>
                  </div>

                  {/* 호버 시 나타나는 장식 */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )
            })}
          </div>
        </div>

        {/* 축제 특징 */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white">
          <div className="text-center mb-8">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              모두하나대축제만의 <span className="text-yellow-200">특별함</span>
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-3 text-yellow-200">온오프라인 연결</h4>
              <p className="text-white/90">온라인에서 시작해 현장에서 완성하는 새로운 축제 경험</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-3 text-green-200">시민 주도 참여</h4>
              <p className="text-white/90">자조모임이 직접 기획하고 운영하는 시민 중심 축제</p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold mb-3 text-purple-200">사회적 의미</h4>
              <p className="text-white/90">단순한 행사가 아닌 사회 변화를 이끄는 의미 있는 축제</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/programs"
                className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                상세 프로그램 보기
              </a>
              <a
                href="/online-festival"
                className="inline-flex items-center px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
                온라인 축제 참여
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}