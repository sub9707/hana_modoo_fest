'use client'

import { useEffect, useState } from 'react'

export default function PartnerHero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 모든 파트너 리스트
  const allPartners = [
    { name: '서울특별시', category: '주최' },
    { name: '서울특별시한부모가족지원센터', category: '주관' },
    { name: 'KT', category: '후원' },
    { name: '삼성전자', category: '후원' },
    { name: '롯데그룹', category: '협력' },
    { name: 'CJ그룹', category: '협력' },
    { name: '대한적십자사', category: '참여기관' },
    { name: '서울YMCA', category: '참여기관' },
    { name: '서울시자원봉사센터', category: '참여기관' },
    { name: '서울시복지재단', category: '참여기관' },
    { name: '서울시립청소년활동진흥센터', category: '참여기관' },
    { name: '서울여성가족재단', category: '참여기관' }
  ]

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 text-white">
      {/* 배경 패턴 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />
        
        {/* 애니메이션 원형들 */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative w-full container mx-auto px-4 py-8">
        <div className={`text-center space-y-6 xl:space-y-8 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          {/* 메인 제목 */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              함께하는
              <span className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                기관
              </span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              모두하나대축제 2025의 성공을 위해
              <br className="hidden sm:block" />
              함께 노력하는 소중한 파트너들을 소개합니다
            </p>
          </div>

          {/* 무한 스크롤 로고 캐러셀 */}
          <div className={`transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl py-4 md:py-6 lg:py-8 border border-white/10">
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                함께하는 파트너들
              </h3>
              
              {/* 로고 캐러셀 컨테이너 */}
              <div className="relative overflow-hidden bg-white/10 backdrop-blur-sm p-3 md:p-4 lg:p-6 mb-4 md:mb-6">
                {/* 그라디언트 마스크 */}
                <div className="absolute left-0 top-0 w-12 md:w-20 h-full bg-gradient-to-r from-white/10 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 w-12 md:w-20 h-full bg-gradient-to-l from-white/10 to-transparent z-10 pointer-events-none"></div>
                
                <div className="flex animate-scroll">
                  {/* 첫 번째 세트 */}
                  {allPartners.map((partner, index) => (
                    <div key={`first-${index}`} className="flex-shrink-0 mx-2 md:mx-4 group">
                      <div className="w-16 h-12 md:w-20 md:h-14 lg:w-24 lg:h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20 hover:bg-white/30 transition-all duration-300 logo-container">
                        <div className="relative w-10 h-6 md:w-12 md:h-8 lg:w-16 lg:h-10">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-md flex items-center justify-center text-white text-xs md:text-sm font-bold opacity-60 group-hover:opacity-80 transition-opacity duration-300">
                            LOGO
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* 두 번째 세트 (무한 루프를 위한 복사본) */}
                  {allPartners.map((partner, index) => (
                    <div key={`second-${index}`} className="flex-shrink-0 mx-2 md:mx-4 group">
                      <div className="w-16 h-12 md:w-20 md:h-14 lg:w-24 lg:h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20 hover:bg-white/30 transition-all duration-300 logo-container">
                        <div className="relative w-10 h-6 md:w-12 md:h-8 lg:w-16 lg:h-10">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-md flex items-center justify-center text-white text-xs md:text-sm font-bold opacity-60 group-hover:opacity-80 transition-opacity duration-300">
                            LOGO
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 파트너 텍스트 목록 - 컴팩트 버전 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 justify-items-center">
                {/* 주최/주관 */}
                <div className="space-y-2">
                  <h4 className="text-sm md:text-base font-semibold text-blue-200 flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                    주최 · 주관
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {allPartners
                      .filter(partner => partner.category === '주최' || partner.category === '주관')
                      .map((partner, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs md:text-sm text-blue-100 backdrop-blur-sm hover:bg-blue-500/30 transition-colors duration-200"
                        >
                          {partner.name}
                        </span>
                      ))}
                  </div>
                </div>

                {/* 후원/협력 */}
                <div className="space-y-2">
                  <h4 className="text-sm md:text-base font-semibold text-green-200 flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    후원 · 협력
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {allPartners
                      .filter(partner => partner.category === '후원' || partner.category === '협력')
                      .map((partner, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full text-xs md:text-sm text-green-100 backdrop-blur-sm hover:bg-green-500/30 transition-colors duration-200"
                        >
                          {partner.name}
                        </span>
                      ))}
                  </div>
                </div>

                {/* 참여기관 */}
                <div className="space-y-2 md:col-span-1">
                  <h4 className="text-sm md:text-base font-semibold text-purple-200 flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                    참여기관
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {allPartners
                      .filter(partner => partner.category === '참여기관')
                      .map((partner, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-xs md:text-sm text-purple-100 backdrop-blur-sm hover:bg-purple-500/30 transition-colors duration-200"
                        >
                          {partner.name}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 스크롤 힌트 - 화면 하단에 고정 */}
          <div className={`transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-col items-center space-y-2 text-white/60 mt-4">
              <span className="text-sm">아래로 스크롤</span>
              <svg 
                className="w-5 h-5 animate-bounce" 
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