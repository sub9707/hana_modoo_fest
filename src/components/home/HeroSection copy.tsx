'use client';

import HeroLeft from "./HeroLeft";
import HeroRight from "./HeroRight";
import { useState, useEffect } from "react";

export default function HeroSection() {
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    // 마운트 애니메이션
    const timeouts = [
      setTimeout(() => setAnimationStage(1), 100),   // 모두의 서울
      setTimeout(() => setAnimationStage(2), 300),   // 모두 다 함께
      setTimeout(() => setAnimationStage(3), 700),   // 서울시 대표 가족축제가 찾아갑니다
      setTimeout(() => setAnimationStage(4), 1000),  // 가족다양성을 존중하고...
      setTimeout(() => setAnimationStage(5), 1300),  // 행사 정보 카드
      setTimeout(() => setAnimationStage(6), 1600),  // 참여 버튼들
      setTimeout(() => setAnimationStage(7), 1900),  // 비디오 플레이어
      setTimeout(() => setAnimationStage(8), 2200),  // 캐릭터 이미지
    ];

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <section className="w-full h-screen flex items-center">
      <div className="container flex mx-auto px-4 lg:px-8 gap-20">
        {/* 좌측 영역  */}
        <HeroLeft animationStage={animationStage} />

        {/* 우측 영역  */}
        <HeroRight animationStage={animationStage} />
      </div>
    </section>
  )
}