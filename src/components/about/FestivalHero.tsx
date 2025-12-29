'use client';

import Image from "next/image";
import HeroTitleBadge from "./HeroTitleBadge";
import { useState, useEffect } from "react";

export default function FestivalHero() {
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    // 마운트 후 순차적으로 애니메이션 실행
    const timeouts = [
      setTimeout(() => setAnimationStage(1), 200),   // 2025
      setTimeout(() => setAnimationStage(2), 700),   // 모두하나 대축제 + 이미지 + Seoul Family
      setTimeout(() => setAnimationStage(3), 1200),  // 모두의 서울, 모두 다함께
      setTimeout(() => setAnimationStage(4), 1700),  // 일시 카드
      setTimeout(() => setAnimationStage(5), 2000),  // 장소 카드
      setTimeout(() => setAnimationStage(6), 2300),  // 참여 카드
    ];

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* 메인 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 m-0 sm:-mt-10">

        {/* 2025 메인 타이틀 */}
        <div 
          className={`text-center transition-all duration-700 ease-out ${
            animationStage >= 1 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-6'
          }`}
        >
          <h1 className="text-[6rem] md:text-[18rem] sm:text-[20rem] font-black bg-gradient-to-r from-cyan-300 via-purple-300 to-indigo-600 bg-clip-text text-transparent leading-none">
            2025
          </h1>
        </div>

        {/* 모두하나 대축제 + 이미지들 */}
        <div 
          className={`mb-2 sm:mb-6 -mt-2 sm:-mt-4 relative transition-all duration-700 ease-out ${
            animationStage >= 2 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="bg-gradient-to-r from-cyan-300 via-purple-300 to-indigo-600 py-1 sm:py-2 px-4 sm:px-8">
            <h2 className="text-white text-4xl sm:text-9xl font-black">
              모두하나 대축제
            </h2>
          </div>
          <div className="absolute -left-15 sm:-left-90 -bottom-5 sm:bottom-0 w-30 h-20 sm:w-90 sm:h-70">
            <Image src={'/images/about/about_left.webp'} fill alt="축제 히어로 섹션 좌측 캐릭터 일러스트" />
          </div>
          <div className="absolute -right-20 sm:-right-[38%] -bottom-5 sm:-bottom-10 w-30 h-30 sm:w-110 sm:h-110">
            <Image src={'/images/about/about_right.webp'} fill alt="축제 히어로 섹션 우측 캐릭터 일러스트" />
          </div>
        </div>

        {/* 영문 소제목 */}
        <p 
          className={`text-gray-700 text-md sm:text-xl md:text-2xl font-medium mb-1 sm:mb-4 transition-all duration-700 ease-out ${
            animationStage >= 2 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-6'
          }`}
        >
          Seoul Family Diversity Festival
        </p>

        {/* 슬로건 */}
        <p 
          className={`text-gray-800 text-2xl md:text-5xl font-bold mb-10 transition-all duration-700 ease-out ${
            animationStage >= 3 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-6'
          }`}
        >
          모두의 서울, 모두 다함께
        </p>

        {/* 정보 카드들 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-12 w-full max-w-6xl">
          {/* 일시 */}
          <div 
            className={`transition-all duration-700 ease-out ${
              animationStage >= 4 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-6'
            }`}
          >
            <HeroTitleBadge title="일시" descMain="2025. 10. 18(토)" descSub="11:00 - 17:00" />
          </div>

          {/* 장소 */}
          <div 
            className={`transition-all duration-700 ease-out ${
              animationStage >= 5 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-6'
            }`}
          >
            <HeroTitleBadge title="장소" descMain="여의도공원 문화의마당" descSub="무료 입장" />
          </div>

          {/* 참여 */}
          <div 
            className={`transition-all duration-700 ease-out ${
              animationStage >= 6 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-6'
            }`}
          >
            <HeroTitleBadge title="참여" descMain="누구나 환영" descSub="사전신청 권장" />
          </div>
        </div>
      </div>
    </section>
  )
}