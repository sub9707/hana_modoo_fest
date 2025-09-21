'use client';

import { useEffect, useState } from 'react';
import BackgroundSlideshow from './BackgroundSlideshow';
import Image from 'next/image';
import { PartnersData } from '@/types/partners';

interface PartnerHeroProps {
  partnersData: PartnersData;
}

export default function PartnerHero({ partnersData }: PartnerHeroProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 배경 이미지
  const backgroundImages = [
    '/images/partners/backgrounds/bg-1.jpg',
    '/images/partners/backgrounds/bg-2.jpg', 
    '/images/partners/backgrounds/bg-3.jpg',
    '/images/partners/backgrounds/bg-4.jpg',
    '/images/partners/backgrounds/bg-5.jpg'
  ];

  // 모든 파트너 데이터
  const allPartners = [
    ...partnersData.organizers,
    ...partnersData.sponsors,
    ...partnersData.operators,
    ...partnersData.participants
  ];

  // 파트너 통계
  const partnerStats = [
    { label: '주최·주관', count: partnersData.organizers.length, color: 'from-cyan-200 to-cyan-300' },
    { label: '후원', count: partnersData.sponsors.length, color: 'from-cyan-100 to-cyan-200' },
    { label: '운영법인', count: partnersData.operators.length, color: 'from-cyan-200 to-cyan-300' },
    { label: '참여기관', count: partnersData.participants.length, color: 'from-cyan-100 to-cyan-300' }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 배경 슬라이드쇼 */}
      <BackgroundSlideshow images={backgroundImages} />

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 w-full container px-4 py-8">
        <div className={`text-center space-y-8 xl:space-y-12 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          {/* 메인 제목 */}
          <div className="space-y-6">
            <div className="w-full -translate-x-8 text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight text-white flex justify-start text-center">
              <div className='w-200 h-35 relative'>
                <Image src={'/icons/logo@2x_invert.png'} alt='modoo_logo' fill/>
              </div>
              와 &nbsp;
              <span className="block bg-gradient-to-r from-cyan-100 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                함께하는 기관
              </span>
            </div>
            <p className="text-xl md:text-2xl lg:text-3xl text-cyan-100 max-w-4xl mx-auto leading-relaxed">
              모두하나대축제 2025의 성공을 위해
              <br className="hidden sm:block" />
              함께 노력하는 소중한 파트너들을 소개합니다
            </p>
          </div>

          {/* 파트너 로고 스크롤 배너 */}
          <div className={`transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 py-6 mx-auto max-w-6xl overflow-hidden">
              <h3 className="text-center text-lg font-semibold text-cyan-200 mb-4">함께하는 파트너들</h3>
              
              {/* 로고 스크롤 컨테이너 */}
              <div className="relative overflow-hidden">
                <div className="flex animate-scroll whitespace-nowrap">
                  {/* 첫 번째 세트 */}
                  {allPartners.map((partner, index) => (
                    <div key={`first-${index}`} className="flex-shrink-0 mx-6 group">
                      <div className="w-24 h-16 md:w-32 md:h-18 lg:w-36 lg:h-20 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/20 hover:bg-white/30 transition-all duration-300 p-3">
                        {partner.logo ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={partner.logo}
                              alt={`${partner.name} 로고`}
                              fill
                              className="object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                              sizes="(max-width: 768px) 96px, (max-width: 1024px) 128px, 144px"
                            />
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="text-xs md:text-sm font-bold text-white opacity-70 group-hover:opacity-90 transition-opacity duration-300">
                              {partner.name.length > 8 ? partner.name.substring(0, 8) + '...' : partner.name}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {/* 두 번째 세트 (무한 루프용) */}
                  {allPartners.map((partner, index) => (
                    <div key={`second-${index}`} className="flex-shrink-0 mx-6 group">
                      <div className="w-24 h-16 md:w-32 md:h-18 lg:w-36 lg:h-20 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/20 hover:bg-white/30 transition-all duration-300 p-3">
                        {partner.logo ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={partner.logo}
                              alt={`${partner.name} 로고`}
                              fill
                              className="object-contain filter brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                              sizes="(max-width: 768px) 96px, (max-width: 1024px) 128px, 144px"
                            />
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="text-xs md:text-sm font-bold text-white opacity-70 group-hover:opacity-90 transition-opacity duration-300">
                              {partner.name.length > 8 ? partner.name.substring(0, 8) + '...' : partner.name}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* 그라디언트 페이드 효과 */}
                <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white/10 to-transparent pointer-events-none"></div>
                <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>

          {/* 파트너 통계 카드들 */}
          <div className={`transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-8">
              {partnerStats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300`}>
                    {stat.count}
                  </div>
                  <div className="text-white/90 text-sm md:text-base font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* 스크롤 힌트 */}
          <div className={`transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-col items-center space-y-3 text-white/70 mt-8">
              <span className="text-sm font-medium">파트너들을 만나보세요</span>
              <svg 
                className="w-6 h-6 animate-bounce" 
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
  );
}