'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import HeroTitleBadge from '../about/HeroTitleBadge'

interface OrganizationData {
  name: string
  englishName: string
  established: string
  vision: string
  mission: string
  coreValues: Array<{
    title: string
    subtitle: string
    description: string
    icon: string
    color: string
  }>
}

interface OrganizationHeroProps {
  organizationData: OrganizationData
}

export default function OrganizationHero({ organizationData }: OrganizationHeroProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden bg-white">

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 sm:py-12">
        <div className={`text-center w-full max-w-6xl transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          {/* 로고 */}
          <div className='w-full flex justify-center items-center mb-4 sm:mb-6'>
            <div className='w-40 h-10 sm:w-60 sm:h-14 lg:w-180 lg:h-20 relative drop-shadow-xl'>
              <Image src={'/images/organization/logo.webp'} alt='서울특별시한부모가족지원센터 로고' fill />
            </div>
          </div>

          {/* 시 비전 */}
          <div className="space-y-3 sm:space-y-4 mb-6">
            <div className="inline-block text-sm sm:text-base md:text-lg lg:text-2xl xl:text-3xl font-bold text-white bg-gradient-to-r from-cyan-300 via-purple-300 to-indigo-600 px-4 py-3 sm:px-5 sm:py-3 lg:px-8 lg:py-4 rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
              <span className="relative z-10">한부모가족의 돌봄, 성장, 미래를 함께 하는 서울</span>
            </div>
            
            {/* 센터 비전 */}
            <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-700 font-medium max-w-4xl mx-auto leading-relaxed px-2">
              함께 만들고, 함께 나누고, 함께 누리는 한부모가족지원
            </p>

            {/* 슬로건 */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-3 sm:mt-4">
              {['돌봄', '성장', '소통', '혁신'].map((item, index) => (
                <span 
                  key={item} 
                  className={`px-3 py-2 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 bg-white border-2 border-gray-100 hover:border-blue-200 rounded-full text-gray-600 hover:text-blue-600 font-semibold text-xs sm:text-sm md:text-base shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* 추진방향 핵심 영역 */}
          <div className={`transition-all duration-1000 delay-500 mb-4 sm:mb-6 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white/60 p-3 sm:p-4 lg:p-6 border border-white/20 w-full">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 lg:mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                핵심 추진방향
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 w-full">
                <HeroTitleBadge 
                  title="생활안정과 자립역량강화" 
                  descMain="한부모가족 종합지원" 
                  descSub="역량강화·상담지원·스마트서비스" 
                />
                <HeroTitleBadge 
                  title="복지시설 및 기관지원" 
                  descMain="서비스 총괄지원" 
                  descSub="네트워크·생활교육 프로그램" 
                />
                <HeroTitleBadge 
                  title="사회환경 조성사업" 
                  descMain="인식개선 및 환경조성" 
                  descSub="미래지향적 지원·쉼과 여가" 
                />
              </div>
            </div>
          </div>

          {/* 부가 정보 - 큰 화면에서만 표시 */}
          <div className={`hidden lg:block transition-all duration-1000 delay-700 mb-4 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-blue-200/30 max-w-5xl mx-auto">
              <p className="text-gray-700 text-xs lg:text-sm leading-relaxed whitespace-nowrap overflow-hidden text-ellipsis">
                <strong className="text-blue-700">서울특별시한부모가족지원센터</strong>는 한부모가족의 안정적인 삶과 자립을 위해 종합적이고 체계적인 지원 서비스를 제공합니다.
              </p>
            </div>
          </div>

          {/* 스크롤 힌트 */}
          <div className={`transition-all duration-1000 delay-900 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-col items-center space-y-1 sm:space-y-2 text-gray-500">
              <span className="text-xs sm:text-sm">자세히 알아보기</span>
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}