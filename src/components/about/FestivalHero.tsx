'use client'

import { useEffect, useState } from 'react'

interface CoreValue {
  title: string
  subtitle: string
  description: string
  icon: string
  color: string
}

interface FestivalData {
  name: string
  year: string
  slogan: string
  englishName: string
  date: string
  time: string
  location: string
  coreValues: CoreValue[]
}

interface FestivalHeroProps {
  festivalData: FestivalData
}

export default function FestivalHero({ festivalData }: FestivalHeroProps) {
  const [mounted, setMounted] = useState(false)
  const [currentValue, setCurrentValue] = useState(0)

  useEffect(() => {
    setMounted(true)
    
    // 핵심가치 자동 순환
    const interval = setInterval(() => {
      setCurrentValue((prev) => (prev + 1) % festivalData.coreValues.length)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [festivalData.coreValues.length])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 text-white">
      {/* 축제 배경 패턴 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />
        
        {/* 다채로운 애니메이션 원형들 */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse animation-delay-1500" />
        <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-yellow-500/10 rounded-full blur-3xl animate-pulse animation-delay-500" />
        
        {/* 떠다니는 축제 아이콘들 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 text-4xl opacity-20 animate-bounce animation-delay-1000">🎪</div>
          <div className="absolute top-40 right-20 text-3xl opacity-20 animate-bounce animation-delay-2000">🎭</div>
          <div className="absolute bottom-40 left-20 text-5xl opacity-20 animate-bounce animation-delay-3000">🎨</div>
          <div className="absolute bottom-20 right-10 text-3xl opacity-20 animate-bounce animation-delay-1500">🎵</div>
          <div className="absolute top-1/2 left-5 text-4xl opacity-20 animate-bounce animation-delay-2500">🌈</div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative w-full container mx-auto px-4 py-8">
        <div className={`text-center space-y-6 xl:space-y-8 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          {/* 상단 배지 */}
          <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-7 3h6m-3-6a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
            <span className="text-sm font-medium">Festival</span>
          </div>

          {/* 메인 제목 */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-blue-200 via-purple-200 via-pink-200 to-yellow-200 bg-clip-text text-transparent">
                {festivalData.name}
              </span>
              <br />
              <span className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white/90">
                {festivalData.year}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-200 font-medium">
              {festivalData.englishName}
            </p>
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white/95 max-w-4xl mx-auto leading-relaxed">
              {festivalData.slogan}
            </p>
          </div>

          {/* 축제 기본 정보 */}
          <div className={`transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20">
                <div className="flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 mr-2 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4h6m-6 4h6m-7 5a2 2 0 002-2v-9a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2h2z" />
                  </svg>
                  <div className="text-sm text-blue-200">일시</div>
                </div>
                <div className="text-center">
                  <div className="text-base md:text-lg font-bold text-white">{festivalData.date}</div>
                  <div className="text-sm text-blue-200">{festivalData.time}</div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20">
                <div className="flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 mr-2 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="text-sm text-blue-200">장소</div>
                </div>
                <div className="text-center">
                  <div className="text-base md:text-lg font-bold text-white">{festivalData.location}</div>
                  <div className="text-sm text-green-200">무료 입장</div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20">
                <div className="flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 mr-2 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <div className="text-sm text-blue-200">참여</div>
                </div>
                <div className="text-center">
                  <div className="text-base md:text-lg font-bold text-white">누구나 환영</div>
                  <div className="text-sm text-purple-200">사전신청 권장</div>
                </div>
              </div>
            </div>
          </div>

          {/* 핵심 가치 순환 표시 */}
          <div className={`transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-white/10 max-w-4xl mx-auto">
              <h3 className="text-xl md:text-2xl font-bold mb-6 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                축제의 핵심 가치
              </h3>
              
              {/* 현재 가치 표시 */}
              <div className="text-center mb-6">
                <div className="text-6xl mb-4 animate-pulse">
                  {festivalData.coreValues[currentValue]?.icon}
                </div>
                <h4 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {festivalData.coreValues[currentValue]?.title}
                </h4>
                <p className="text-lg text-blue-200 mb-3">
                  {festivalData.coreValues[currentValue]?.subtitle}
                </p>
                <p className="text-white/90 max-w-2xl mx-auto">
                  {festivalData.coreValues[currentValue]?.description}
                </p>
              </div>
              
              {/* 인디케이터 */}
              <div className="flex justify-center space-x-2">
                {festivalData.coreValues.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentValue(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentValue
                        ? 'bg-white shadow-lg'
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* CTA 버튼들 */}
          <div className={`transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                사전참가 신청
              </a>
              <a
                href="/programs"
                className="inline-flex items-center px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                프로그램 보기
              </a>
            </div>
          </div>

          {/* 스크롤 힌트 */}
          <div className={`transition-all duration-1000 delay-900 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-col items-center space-y-2 text-white/60 mt-8">
              <span className="text-sm">축제에 대해 더 알아보기</span>
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