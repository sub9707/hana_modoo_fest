'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, Users, Heart, ChevronRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const slides = [
    {
      id: 1,
      image: '/images/hero/main-festival.jpg',
      title: '모두의 서울, 모두 다 함께',
      subtitle: '서울시 대표 가족축제가 찾아갑니다',
      description: '가족다양성을 존중하고 시민이 함께 즐기는 연대의 장'
    },
    {
      id: 2,
      image: '/images/hero/online-campaign.jpg', 
      title: '온라인에서 시작해',
      subtitle: '현장에서 함께 완성해요',
      description: '9월부터 시작되는 온라인 캠페인에 참여하세요'
    },
    {
      id: 3,
      image: '/images/hero/family-diversity.jpg',
      title: '다양한 가족, 하나의 마음',
      subtitle: '모든 가족이 함께하는 축제',
      description: '한부모가족을 비롯한 모든 가족의 이야기를 나눠요'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] overflow-hidden festival-gradient">
      {/* 배경 이미지 슬라이더 */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              index === currentSlide ? "opacity-30" : "opacity-0"
            )}
          >
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <div className="text-center text-blue-600">
                <div className="text-8xl mb-4">🎪</div>
                <p className="text-lg font-medium">{slide.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-800/60" />

      {/* 콘텐츠 */}
      <div className="relative z-10 max-w-7xl mx-auto container-padding h-full min-h-[600px] lg:min-h-[700px] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          {/* 텍스트 콘텐츠 */}
          <div className="text-white">
            {/* 슬라이드 콘텐츠 */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30">
                  <Heart className="w-3 h-3 mr-1" />
                  2025 서울시 공식 가족축제
                </span>
              </div>
              
              <h1 className="text-responsive-2xl font-bold leading-tight mb-4">
                <span className="block transition-all duration-500 animate-fade-in-up">
                  {slides[currentSlide].title}
                </span>
              </h1>
              
              <p className="text-responsive-lg text-blue-100 mb-4 font-medium">
                {slides[currentSlide].subtitle}
              </p>
              
              <p className="text-responsive-base text-blue-200 max-w-xl">
                {slides[currentSlide].description}
              </p>
            </div>

            {/* 축제 정보 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-200" />
                  <div>
                    <p className="text-sm text-blue-200">행사 일정</p>
                    <p className="font-semibold">2025.10.18(토)</p>
                    <p className="text-sm text-blue-200">11:00 - 16:00</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-200" />
                  <div>
                    <p className="text-sm text-blue-200">개최 장소</p>
                    <p className="font-semibold">여의도공원</p>
                    <p className="text-sm text-blue-200">문화의마당</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA 버튼들 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Link href="/register" className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  사전참가 신청하기
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/30 text-white bg-white/0 hover:bg-white/10 font-semibold px-8 py-3 text-lg backdrop-blur-sm"
              >
                <Link href="/online-festival" className="flex items-center">
                  <Play className="w-4 h-4 mr-2" />
                  캠페인 참여하기
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/10 font-medium px-6 py-3"
              >
                <Link href="/location" className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  오시는 길
                </Link>
              </Button>
            </div>
          </div>

          {/* 오른쪽 콘텐츠 (숨김/데스크톱에서만 표시) */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* 플로팅 카드들 */}
              <div className="space-y-4">
                <div className="bg-white/15 backdrop-blur-md rounded-xl p-6 border border-white/20 transform rotate-2 hover:rotate-0 transition-transform animate-float">
                  <h3 className="text-white font-semibold mb-2">🎪 다채로운 프로그램</h3>
                  <p className="text-blue-100 text-sm">무대공연, 체험부스, 자조모임 등</p>
                </div>
                
                <div className="bg-white/15 backdrop-blur-md rounded-xl p-6 border border-white/20 transform -rotate-1 hover:rotate-0 transition-transform ml-8">
                  <h3 className="text-white font-semibold mb-2">💝 온라인 캠페인</h3>
                  <p className="text-blue-100 text-sm">해시태그, 포토 챌린지, 퀴즈</p>
                </div>
                
                <div className="bg-white/15 backdrop-blur-md rounded-xl p-6 border border-white/20 transform rotate-1 hover:rotate-0 transition-transform">
                  <h3 className="text-white font-semibold mb-2">🤝 시민 참여</h3>
                  <p className="text-blue-100 text-sm">모든 시민이 함께하는 축제</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 슬라이드 인디케이터 */}
      <div className="absolute top-6 right-0 transform -translate-x-1/2 z-20">
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all",
                index === currentSlide 
                  ? "bg-white scale-110" 
                  : "bg-white/50 hover:bg-white/75"
              )}
              aria-label={`슬라이드 ${index + 1}로 이동`}
            />
          ))}
        </div>
      </div>

      {/* 스크롤 다운 힌트 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 hidden lg:block">
        <div className="text-white/60 text-center flex flex-col items-center space-y-2">
          <p className="text-sm mb-2">아래로 스크롤</p>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  )
}
