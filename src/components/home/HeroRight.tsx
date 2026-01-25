'use client';

import Image from "next/image";
import VideoPlayer from "../common/VideoPlayer";

interface HeroRightProps {
  animationStage: number;
}

export default function HeroRight({ animationStage }: HeroRightProps) {
  return (
    <div className="relative hidden sm:hidden md:flex items-center justify-center flex-1">
        <div 
            className={`max-w-2xl h-100 mb-30 transition-all duration-500 ease-out ${
                animationStage >= 7 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-6'
            }`}
        >
          <VideoPlayer src="/videos/main/home_video.mp4"/>
        </div>
        
        <div 
            className={`w-130 h-70 absolute bottom-20 -right-40 z-10 transition-all duration-500 ease-out ${
                animationStage >= 8 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-6'
            }`}
        >
          <Image src={'/images/main/main_hero.webp'} fill alt="main_hero_characters" /> 
        </div>
    </div>
  )
}