interface CoreValue {
  title: string
  subtitle: string
  description: string
  icon: string
  color: string
}

interface VisionSectionProps {
  coreValues: CoreValue[]
  vision: string
  mission: string
}

export default function VisionSection({ coreValues, vision, mission }: VisionSectionProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-gradient-to-br from-blue-500/10 to-blue-600/20',
          border: 'border-blue-400/30',
          text: 'text-blue-100',
          accent: 'text-blue-300',
          hover: 'hover:from-blue-500/20 hover:to-blue-600/30'
        }
      case 'green':
        return {
          bg: 'bg-gradient-to-br from-green-500/10 to-green-600/20',
          border: 'border-green-400/30',
          text: 'text-green-100',
          accent: 'text-green-300',
          hover: 'hover:from-green-500/20 hover:to-green-600/30'
        }
      case 'purple':
        return {
          bg: 'bg-gradient-to-br from-purple-500/10 to-purple-600/20',
          border: 'border-purple-400/30',
          text: 'text-purple-100',
          accent: 'text-purple-300',
          hover: 'hover:from-purple-500/20 hover:to-purple-600/30'
        }
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-500/10 to-gray-600/20',
          border: 'border-gray-400/30',
          text: 'text-gray-100',
          accent: 'text-gray-300',
          hover: 'hover:from-gray-500/20 hover:to-gray-600/30'
        }
    }
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            비전과 <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">핵심가치</span>
          </h2>
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border">
              <h3 className="text-xl md:text-2xl font-bold text-blue-600 mb-2">비전 Vision</h3>
              <p className="text-lg md:text-xl text-gray-700">{vision}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border">
              <h3 className="text-xl md:text-2xl font-bold text-purple-600 mb-2">사명 Mission</h3>
              <p className="text-lg md:text-xl text-gray-700">{mission}</p>
            </div>
          </div>
        </div>

        {/* 핵심 가치 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {coreValues.map((value, index) => {
            const colors = getColorClasses(value.color)
            
            return (
              <div
                key={index}
                className={`group relative p-8 rounded-3xl backdrop-blur-sm border transition-all duration-500 hover:scale-105 hover:shadow-2xl ${colors.bg} ${colors.border} ${colors.hover}`}
              >
                {/* 배경 장식 */}
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <div className="text-6xl">{value.icon}</div>
                </div>
                
                {/* 콘텐츠 */}
                <div className="relative z-10">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className={`text-2xl md:text-3xl font-bold mb-2 ${colors.accent}`}>
                    {value.title}
                  </h3>
                  <p className={`text-sm font-medium mb-4 opacity-80 ${colors.text}`}>
                    {value.subtitle}
                  </p>
                  <p className={`text-base leading-relaxed ${colors.text}`}>
                    {value.description}
                  </p>
                </div>

                {/* 호버 시 나타나는 장식 */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            )
          })}
        </div>

        {/* 하단 CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">함께 만들어가는 따뜻한 사회</h3>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-3xl mx-auto">
              서울특별시한부모가족지원센터는 모든 가족이 행복할 수 있는 포용사회를 만들어갑니다.
              여러분의 관심과 참여가 더 나은 미래를 만드는 힘입니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#business"
                className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                주요사업 보기
              </a>
              <a
                href="#contact"
                className="inline-flex items-center px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                문의하기
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}