'use client';

import { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import HeroCTAButton from "./HeroCTAButton";
import { FESTIVAL, ROUTES, HERO_TEXT, SITE } from "@/constants";

// VideoPlayer를 lazy load
const VideoPlayer = dynamic(() => import("../common/VideoPlayer"), {
  loading: () => (
    <div className="w-full aspect-video rounded-2xl bg-gray-200 animate-pulse">
      <div className="w-full h-full" />
    </div>
  ),
  ssr: false
});

export default function HeroSection() {
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = mobileVideoRef.current;

    return () => {
      if (video) {
        video.pause();
        video.currentTime = 0;
        video.src = '';
        video.load();
      }
    };
  }, []);

  return (
    <section className="w-full min-h-screen flex items-center justify-center py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8 md:space-y-10">

          {/* 메인 타이틀 */}
          <h1 className="font-black text-gray-900">
            <div className="block text-7xl md:text-6xl lg:text-[8rem] xl:text-[10rem] animate-fade-in-up [animation-delay:0.1s] opacity-0">
              {HERO_TEXT.mainTitle[0]}
            </div>
            <div className="block text-7xl sm:text-4xl md:text-6xl lg:text-[8rem] xl:text-[10rem] bg-gradient-to-r from-purple-300 via-blue-300 to-green-300 bg-clip-text text-transparent animate-fade-in-up [animation-delay:0.3s] opacity-0">
              {HERO_TEXT.mainTitle[1]}
            </div>
          </h1>

          {/* 서브 타이틀 */}
          <div className="space-y-2 sm:space-y-3">
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-700 font-bold animate-fade-in-up [animation-delay:0.7s] opacity-0">
              {HERO_TEXT.subTitle}
            </p>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 animate-fade-in-up [animation-delay:1s] opacity-0">
              {HERO_TEXT.description}
            </p>
          </div>

          {/* 비디오 및 캐릭터 영역 */}
          <div className="relative w-full max-w-5xl mb-20 sm:mb-40">
            {/* 모바일 비디오 (md 미만) - VideoPlayer 컴포넌트 재사용 */}
            <div className="block md:hidden w-full relative animate-fade-in-up [animation-delay:1.3s] opacity-0">
              <VideoPlayer src="/videos/main/home_video.mp4" isMobile={true} />

              {/* 모바일 캐릭터 이미지 */}
              <div className="absolute -bottom-16 -right-4 w-44 h-36 z-10 animate-fade-in-up [animation-delay:1.6s] opacity-0">
                <Image
                  src="/images/main/main_hero.webp"
                  fill
                  alt={`${SITE.name} 메인 캐릭터`}
                  className="object-contain"
                  loading="lazy"
                  sizes="(max-width: 768px) 176px, 480px"
                  quality={85}
                />
              </div>
            </div>

            {/* 데스크탑 비디오 및 캐릭터 (md 이상) */}
            <div className="hidden md:block relative">
              {/* 비디오 플레이어 */}
              <div className="w-full max-w-4xl mx-auto animate-fade-in-up [animation-delay:1.3s] opacity-0">
                <VideoPlayer src="/videos/main/home_video.mp4" />
              </div>

              {/* 데스크탑 캐릭터 이미지 */}
              <div className="absolute -bottom-24 xl:-bottom-32 -right-8 lg:-right-16 xl:-right-24 w-48 h-64 lg:w-100 lg:h-80 xl:w-120 xl:h-90 z-10 animate-fade-in-up [animation-delay:1.6s] opacity-0">
                <Image
                  src="/images/main/main_hero.webp"
                  fill
                  alt={`${SITE.name} 메인 캐릭터`}
                  className="object-contain"
                  loading="lazy"
                  sizes="(max-width: 768px) 192px, (max-width: 1024px) 400px, 480px"
                  quality={85}
                />
              </div>
            </div>
          </div>

          {/* 행사 정보 카드 */}
          <div className="w-full max-w-3xl bg-gradient-to-r from-purple-200 via-blue-200 to-green-200 rounded-2xl p-6 sm:p-8 border-4 border-white shadow-lg animate-fade-in-up [animation-delay:1.9s] opacity-0">
            <div className="flex  text-center gap-6 sm:gap-0">
              <div className="flex-1 sm:pr-4">
                <h3 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-gray-900 mb-2 text-stroke-white">
                  {HERO_TEXT.eventInfo.scheduleTitle}
                </h3>
                <p className="text-gray-800 text-lg sm:text-xl lg:text-2xl font-semibold">{FESTIVAL.dateFormatted}</p>
                <p className="text-gray-700 text-base sm:text-lg">{FESTIVAL.time}</p>
              </div>
              <div className="flex-1 sm:pl-4 sm:border-l border-white/50">
                <h3 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-gray-900 mb-2 text-stroke-white">
                  {HERO_TEXT.eventInfo.locationTitle}
                </h3>
                <p className="text-gray-800 text-lg sm:text-xl lg:text-2xl font-semibold">{FESTIVAL.location.shortName}</p>
                <p className="text-gray-700 text-base sm:text-lg">{FESTIVAL.location.subName}</p>
              </div>
            </div>
          </div>

          {/* 참여 버튼들 */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 w-full max-w-2xl animate-fade-in-up [animation-delay:2.2s] opacity-0">
            <HeroCTAButton
              text={HERO_TEXT.ctaButtons.registration}
              href={ROUTES.registration}
            />

            <HeroCTAButton
              text={HERO_TEXT.ctaButtons.campaign}
              href={ROUTES.onlineFestival}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
