'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import VideoPlayer from "../common/VideoPlayer";
import HeroCTAButton from "./HeroCTAButton";

export default function HeroSection() {
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    // 마운트 애니메이션
    const timeouts = [
      setTimeout(() => setAnimationStage(1), 100),   // 모두의 서울
      setTimeout(() => setAnimationStage(2), 300),   // 모두 다 함께
      setTimeout(() => setAnimationStage(3), 700),   // 서울시 대표 가족축제가 찾아갑니다
      setTimeout(() => setAnimationStage(4), 1000),  // 가족다양성을 존중하고...
      setTimeout(() => setAnimationStage(5), 1300),  // 비디오 플레이어
      setTimeout(() => setAnimationStage(6), 1600),  // 캐릭터 이미지
      setTimeout(() => setAnimationStage(7), 1900),  // 행사 정보 카드
      setTimeout(() => setAnimationStage(8), 2200),  // 참여 버튼들
    ];

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <section className="w-full min-h-screen flex items-center justify-center py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8 md:space-y-10">
          
          {/* 메인 타이틀 */}
          <h1 className="font-black text-gray-900">
            <div 
              className={`block text-7xl md:text-6xl lg:text-[8rem] xl:text-[10rem] transition-all duration-500 ease-out ${
                animationStage >= 1 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-6'
              }`}
            >
              모두의 서울
            </div>
            <div 
              className={`block text-7xl sm:text-4xl md:text-6xl lg:text-[8rem] xl:text-[10rem] bg-gradient-to-r from-purple-300 via-blue-300 to-green-300 bg-clip-text text-transparent transition-all duration-500 ease-out ${
                animationStage >= 2 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-6'
              }`}
            >
              모두 다 함께
            </div>
          </h1>

          {/* 서브 타이틀 */}
          <div className="space-y-2 sm:space-y-3">
            <p 
              className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-700 font-bold transition-all duration-500 ease-out ${
                animationStage >= 3 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-6'
              }`}
            >
              서울시 대표 가족축제가 찾아갑니다.
            </p>
            <p 
              className={`text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 transition-all duration-500 ease-out ${
                animationStage >= 4 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-6'
              }`}
            >
              가족다양성을 존중하고 시민이 함께 즐기는 연대의 장
            </p>
          </div>

          {/* 비디오 및 캐릭터 영역 */}
          <div className="relative w-full max-w-5xl mb-20 sm:mb-40">
            {/* 모바일 비디오 (md 미만) */}
            <div 
              className={`block md:hidden w-full relative transition-all duration-500 ease-out ${
                animationStage >= 5 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-6'
              }`}
            >
              <video
                className="w-full h-auto rounded-2xl shadow-lg"
                autoPlay
                loop
                playsInline
                style={{ aspectRatio: '16/9' }}
              >
                <source src="/videos/main/home_video.mp4" type="video/mp4" />
                브라우저가 지원하지 않는 비디오 플레이어입니다.
              </video>
            
              {/* 모바일 캐릭터 이미지 */}
              <div 
                className={`absolute -bottom-16 -right-4 w-44 h-36 z-10 transition-all duration-500 ease-out ${
                  animationStage >= 6 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-6'
                }`}
              >
                <Image 
                  src="/images/main/main_hero.webp" 
                  fill 
                  alt="main_hero_characters"
                  className="object-contain"
                /> 
              </div>
            </div>

            {/* 데스크탑 비디오 및 캐릭터 (md 이상) */}
            <div className="hidden md:block relative">
              {/* 비디오 플레이어 */}
              <div 
                className={`w-full max-w-4xl mx-auto transition-all duration-500 ease-out ${
                  animationStage >= 5 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-6'
                }`}
              >
                <VideoPlayer src="/videos/main/home_video.mp4"/>
              </div>
              
              {/* 데스크탑 캐릭터 이미지 */}
              <div 
                className={`absolute -bottom-24 xl:-bottom-32 -right-8 lg:-right-16 xl:-right-24 w-48 h-64 lg:w-100 lg:h-80 xl:w-120 xl:h-90 z-10 transition-all duration-500 ease-out ${
                  animationStage >= 6 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-6'
                }`}
              >
                <Image 
                  src="/images/main/main_hero.webp" 
                  fill 
                  alt="main_hero_characters"
                  className="object-contain"
                /> 
              </div>
            </div>
          </div>

          {/* 행사 정보 카드 */}
          <div 
            className={`w-full max-w-3xl bg-gradient-to-r from-purple-200 via-blue-200 to-green-200 rounded-2xl p-6 sm:p-8 border-4 border-white shadow-lg transition-all duration-500 ease-out ${
              animationStage >= 7 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="flex  text-center gap-6 sm:gap-0">
              <div className="flex-1 sm:pr-4">
                <h3
                  className="font-bold text-2xl sm:text-3xl lg:text-4xl text-gray-900 mb-2"
                  style={{
                    WebkitTextStroke: "0.5px white"
                  }}
                >
                  행사 일정
                </h3>
                <p className="text-gray-800 text-lg sm:text-xl lg:text-2xl font-semibold">2025. 10. 18(토)</p>
                <p className="text-gray-700 text-base sm:text-lg">11:00 - 17:00</p>
              </div>
              <div className="flex-1 sm:pl-4 sm:border-l border-white/50">
                <h3
                  className="font-bold text-2xl sm:text-3xl lg:text-4xl text-gray-900 mb-2"
                  style={{
                    WebkitTextStroke: "0.5px white"
                  }}
                >
                  개최 장소
                </h3>
                <p className="text-gray-800 text-lg sm:text-xl lg:text-2xl font-semibold">여의도공원</p>
                <p className="text-gray-700 text-base sm:text-lg">문화의마당</p>
              </div>
            </div>
          </div>

          {/* 참여 버튼들 */}
          <div 
            className={`flex flex-col sm:flex-row justify-center items-center gap-8 w-full max-w-2xl transition-all duration-500 ease-out ${
              animationStage >= 8 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-6'
            }`}
          >
            <HeroCTAButton
              text="사전참가 신청하기"
              href="/registration"
            />

            <HeroCTAButton
              text="캠페인 참여하기"
              href="/online-festival"
            />
          </div>
        </div>
      </div>
    </section>
  )
}