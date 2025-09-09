'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Partner {
  id: string
  name: string
  type: string
  logoUrl: string
  category: string
}

interface PartnersSliderProps {
  partners: Partner[]
}

export default function PartnersSlider({ partners }: PartnersSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const groupedPartners = partners.reduce((acc, partner) => {
    if (!acc[partner.category]) {
      acc[partner.category] = []
    }
    acc[partner.category].push(partner)
    return acc
  }, {} as Record<string, Partner[]>)

  const categories = Object.keys(groupedPartners)
  const partnersPerSlide = 4
  const totalSlides = Math.ceil(partners.length / partnersPerSlide)

  useEffect(() => {
    if (!isAutoPlaying) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides)
    }, 4000)

    return () => clearInterval(timer)
  }, [isAutoPlaying, totalSlides])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
    setIsAutoPlaying(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
    setIsAutoPlaying(false)
  }

  return (
    <div className="max-w-7xl mx-auto container-padding">
      {/* 섹션 헤더 */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12">
        <div>
          <h2 className="text-responsive-xl font-bold text-foreground mb-4">
            함께하는 기관
          </h2>
          <p className="text-responsive-base text-muted-foreground">
            모두하나대축제를 함께 만들어가는 소중한 파트너들입니다
          </p>
        </div>
        
        <Button asChild variant="outline" className="mt-6 lg:mt-0">
          <Link href="/partners">
            전체 보기
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>

      {/* 파트너 그룹별 표시 */}
      <div className="space-y-12">
        {Object.entries(groupedPartners).map(([category, categoryPartners]) => (
          <div key={category}>
            <h3 className="text-xl font-semibold text-foreground mb-6 text-center">
              {category}
            </h3>
            
            {/* 슬라이더 컨테이너 */}
            <div className="relative">
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {Array.from({ length: Math.ceil(categoryPartners.length / partnersPerSlide) }).map((_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {categoryPartners
                          .slice(slideIndex * partnersPerSlide, (slideIndex + 1) * partnersPerSlide)
                          .map((partner) => (
                            <div 
                              key={partner.id}
                              className="flex items-center justify-center p-6 bg-card rounded-lg border hover:shadow-md transition-shadow"
                            >
                              <div className="w-20 h-12 bg-muted rounded flex items-center justify-center">
                                <span className="text-xs font-medium text-muted-foreground text-center">
                                  {partner.name}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 네비게이션 버튼 */}
              {totalSlides > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-card border rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                    aria-label="이전 슬라이드"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={goToNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-card border rounded-full flex items-center justify-center hover:bg-muted transition-colors"
                    aria-label="다음 슬라이드"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* 인디케이터 */}
            {totalSlides > 1 && (
              <div className="flex justify-center space-x-2 mt-6">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`}
                    aria-label={`슬라이드 ${index + 1}로 이동`}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 파트너십 안내 */}
      <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 lg:p-12 text-center">
        <h3 className="text-responsive-lg font-bold text-foreground mb-4">
          함께 축제를 만들어가요
        </h3>
        <p className="text-responsive-base text-muted-foreground mb-8 max-w-2xl mx-auto">
          모두하나대축제에 참여하고 싶은 기관이나 단체가 있으시다면<br />
          언제든 연락해주세요
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="mailto:info@moduhana2025.seoul.kr">
              협력 문의하기
            </Link>
          </Button>
          
          <Button asChild variant="outline">
            <Link href="/partners">
              파트너 소개 보기
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}