'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface BackgroundSlideshowProps {
  images: string[];
  className?: string;
}

export default function BackgroundSlideshow({ images, className = '' }: BackgroundSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000); // 6초마다 이미지 변경

    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className={`fixed inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-cyan-900 ${className}`} />
    );
  }

  return (
    <div className={`fixed inset-0 overflow-hidden ${className}`}>
      {/* 배경 이미지들 */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image}
            alt={`배경 이미지 ${index + 1}`}
            fill
            className="object-cover scale-110"
            priority={index === 0}
            onLoad={() => index === 0 && setIsLoaded(true)}
          />
        </div>
      ))}

      {/* 비네팅 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-indigo-900/60 to-cyan-900/70" />
      
      {/* 추가 비네팅 효과 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

      {/* 하단 강한 비네팅 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
      
      {/* 상단 부드러운 비네팅 */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/40 to-transparent" />

      {/* 로딩 상태일 때 폴백 배경 */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-cyan-900" />
      )}
    </div>
  );
}