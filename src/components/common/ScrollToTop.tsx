'use client'

import { useState, useEffect } from 'react'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  // 스크롤 위치 감지
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  // 맨 위로 스크롤
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  if (!isVisible) {
    return null
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-25 right-6 md:bottom-8 md:right-8 z-50 bg-slate-800 hover:bg-slate-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 w-12 h-12 md:w-14 md:h-14 flex flex-col items-center justify-center group touch-manipulation"
      aria-label="맨 위로 스크롤"
    >
      {/* 삼각형 (위쪽 화살표) */}
      <div className="w-0 h-0 border-l-[6px] md:border-l-[7px] border-r-[6px] md:border-r-[7px] border-b-[6px] md:border-b-[7px] border-l-transparent border-r-transparent border-b-white mb-0.5 md:mb-1 transform group-hover:-translate-y-0.5 transition-transform duration-200" />
      
      {/* TOP 텍스트 */}
      <span className="text-[8px] md:text-[9px] font-bold leading-none tracking-wide">
        TOP
      </span>
    </button>
  )
}