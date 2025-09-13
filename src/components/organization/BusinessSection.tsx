interface MainService {
  category: string
  services: string[]
  icon: string
}

interface Achievement {
  year: string
  content: string
}

interface BusinessSectionProps {
  mainServices: MainService[]
  achievements: Achievement[]
}

export default function BusinessSection({ mainServices, achievements }: BusinessSectionProps) {
  return (
    <section id="business" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* 주요 사업 섹션 */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              주요 <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">사업</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              한부모가족의 자립과 사회통합을 위한 다양한 서비스를 제공합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mainServices.map((service, index) => {
              const getServiceColor = (index: number) => {
                const colors = [
                  'from-blue-500 to-blue-600 text-blue-600',
                  'from-green-500 to-green-600 text-green-600', 
                  'from-purple-500 to-purple-600 text-purple-600',
                  'from-pink-500 to-pink-600 text-pink-600'
                ]
                return colors[index % colors.length]
              }
              
              const colorClass = getServiceColor(index)
              const [gradientClass, textClass] = colorClass.split(' text-')
              
              return (
                <div
                  key={index}
                  className="group bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border"
                >
                  {/* 아이콘 */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {service.icon}
                  </div>
                  
                  {/* 카테고리명 */}
                  <h3 className={`text-xl font-bold mb-4 text-${textClass}`}>
                    {service.category}
                  </h3>
                  
                  {/* 서비스 목록 */}
                  <ul className="space-y-2">
                    {service.services.map((item, serviceIndex) => (
                      <li key={serviceIndex} className="flex items-start text-gray-600">
                        <svg className="w-4 h-4 mt-1 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                        </svg>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>

        {/* 성과 및 연혁 섹션 */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              성과와 <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">연혁</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              설립부터 현재까지 한부모가족과 함께한 발자취입니다
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* 타임라인 선 */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 transform md:-translate-x-px"></div>
            
            {/* 성과 항목들 */}
            <div className="space-y-8">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* 타임라인 점 */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-white shadow-lg transform md:-translate-x-1/2 z-10"></div>
                  
                  {/* 콘텐츠 카드 */}
                  <div className={`ml-12 md:ml-0 flex-1 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border group hover:scale-105">
                      <div className={`text-right ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                        <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold rounded-full mb-3">
                          {achievement.year}
                        </span>
                        <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                          {achievement.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white text-center">
            <div className="text-3xl font-bold mb-2">10,000+</div>
            <div className="text-sm opacity-90">서비스 제공 가구</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white text-center">
            <div className="text-3xl font-bold mb-2">500+</div>
            <div className="text-sm opacity-90">자조모임 운영</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white text-center">
            <div className="text-3xl font-bold mb-2">50+</div>
            <div className="text-sm opacity-90">협력기관</div>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white text-center">
            <div className="text-3xl font-bold mb-2">6년</div>
            <div className="text-sm opacity-90">운영 경험</div>
          </div>
        </div>
      </div>
    </section>
  )
}