'use client'

import { useEffect, useState } from 'react'

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

          {/* 상단 배지 */}
          <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-sm font-medium">Organization</span>
          </div>

          {/* 메인 제목 */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                {organizationData.name}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-200 font-medium">
              {organizationData.englishName}
            </p>
            <p className="text-lg md:text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              {organizationData.vision}
            </p>
            <p className="text-base md:text-lg text-blue-200 max-w-3xl mx-auto">
              {organizationData.mission}
            </p>
          </div>

          {/* 설립연도 */}
          <div className={`transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <svg className="w-6 h-6 mr-3 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4h6m-6 4h6m-7 5a2 2 0 002-2v-9a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2h2z" />
              </svg>
              <div className="text-left">
                <div className="text-sm text-blue-200">설립</div>
                <div className="text-lg font-bold text-white">{organizationData.established}</div>
              </div>
            </div>
          </div>

          {/* 핵심 가치 미리보기 */}
          <div className={`transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white/10 max-w-4xl mx-auto">
              <h3 className="text-xl md:text-2xl font-bold mb-6 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                핵심 가치
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {organizationData.coreValues.map((value, index) => {
                  const getColorClasses = (color: string) => {
                    switch (color) {
                      case 'blue':
                        return 'bg-blue-500/20 border-blue-400/30 text-blue-100'
                      case 'green':
                        return 'bg-green-500/20 border-green-400/30 text-green-100'
                      case 'purple':
                        return 'bg-purple-500/20 border-purple-400/30 text-purple-100'
                      default:
                        return 'bg-gray-500/20 border-gray-400/30 text-gray-100'
                    }
                  }
                  
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-2xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${getColorClasses(value.color)}`}
                    >
                      <div className="text-3xl mb-3">{value.icon}</div>
                      <h4 className="text-lg font-bold mb-1">{value.title}</h4>
                      <p className="text-sm opacity-80">{value.subtitle}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* 스크롤 힌트 */}
          <div className={`transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-col items-center space-y-2 text-white/60 mt-6">
              <span className="text-sm">자세히 알아보기</span>
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