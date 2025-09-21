'use client';

import Image from "next/image";
import { useState, useEffect } from "react";

interface VenueData {
  name: string;
  address: string;
  date: string;
  time: string;
}

interface DirectionsHeroProps {
  venueData: VenueData;
}

export default function DirectionsHero({ venueData }: DirectionsHeroProps) {
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    // 마운트 후 순차적으로 애니메이션 실행
    const timeouts = [
      setTimeout(() => setAnimationStage(1), 200),   // 로고
      setTimeout(() => setAnimationStage(2), 600),   // 타이틀
      setTimeout(() => setAnimationStage(3), 1000),  // 카드
      setTimeout(() => setAnimationStage(4), 1400),  // 버튼
    ];

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  const handleScrollToMap = () => {
    const mapSection = document.getElementById('directions-map');
    if (mapSection) {
      mapSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section className="min-h-screen relative bg-gradient-to-br from-orange-300 to-pink-400 text-white flex flex-col items-center justify-center text-center px-4">
      <div className="transform -translate-y-8 md:-translate-y-16 flex flex-col items-center justify-center">
        
        {/* 로고 */}
        <div 
          className={`w-250 h-40 relative mr-40 transition-all duration-700 ease-out ${
            animationStage >= 1 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-6'
          }`}
        >
          <Image src="/icons/logo@2x_invert.png" alt="모두하나대축제 로고" fill />
        </div>

        {/* 메인 타이틀 */}
        <h1 
          className={`text-5xl md:text-7xl font-bold mb-6 transition-all duration-700 ease-out ${
            animationStage >= 2 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-6'
          }`}
        >
          오시는 길
        </h1>

        {/* 서브 타이틀 */}
        <p 
          className={`text-xl md:text-2xl mb-8 font-light transition-all duration-700 ease-out ${
            animationStage >= 2 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-6'
          }`}
        >
          {venueData.name}에서 만나요
        </p>

        {/* 행사 정보 카드 */}
        <div 
          className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-8 max-w-2xl w-full mb-8 transition-all duration-700 ease-out ${
            animationStage >= 3 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
            <div>
              <h3 className="font-semibold text-white/80 mb-2 text-xl uppercase tracking-wider">
                날짜 & 시간
              </h3>
              <p className="text-2xl font-medium mb-1">{venueData.date}</p>
              <p className="text-white/90">{venueData.time}</p>
            </div>

            <div>
              <h3 className="font-semibold text-white/80 mb-2 text-xl uppercase tracking-wider">
                장소
              </h3>
              <p className="text-2xl font-medium mb-1">{venueData.name}</p>
              <p className="text-white/90 text-sm leading-relaxed">
                {venueData.address}
              </p>
            </div>
          </div>
        </div>

        {/* CTA 버튼 */}
        <button 
          onClick={handleScrollToMap}
          className={`group bg-white text-2xl text-orange-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-all duration-700 hover:scale-105 inline-flex items-center gap-2 ease-out ${
            animationStage >= 4 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-6'
          }`}
        >
          길찾기 바로가기
          <div className="w-4 h-4 border-t-2 border-r-2 border-current rotate-45 group-hover:translate-x-1 transition-transform duration-300"></div>
        </button>
      </div>
    </section>
  );
}