'use client'

import { useRef, useCallback } from 'react'

interface UseScrollManagementReturn {
  detailContainerRef: React.RefObject<HTMLDivElement | null>
  saveScrollPosition: () => void
  restoreScrollPosition: () => void
  scrollToDetail: () => void
  scrollToTop: () => void
}

export function useScrollManagement(): UseScrollManagementReturn {
  const detailContainerRef = useRef<HTMLDivElement>(null)
  const savedScrollPosition = useRef<number>(0)

  // 현재 스크롤 위치 저장
  const saveScrollPosition = useCallback(() => {
    savedScrollPosition.current = window.pageYOffset || document.documentElement.scrollTop
  }, [])

  // 저장된 스크롤 위치로 복원
  const restoreScrollPosition = useCallback(() => {
    const targetPosition = savedScrollPosition.current
    
    // 부드러운 스크롤로 복원
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    })
  }, [])

  // 상세 화면 상단으로 스크롤
  const scrollToDetail = useCallback(() => {
    if (detailContainerRef.current) {
      const timer = setTimeout(() => {
        if (detailContainerRef.current) {
          // 뷰포트 상단에서 약간의 여백을 두고 스크롤
          const elementTop = detailContainerRef.current.offsetTop
          const offsetPosition = elementTop - 20 // 20px 여백
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      }, 100) // DOM 업데이트 대기

      return () => clearTimeout(timer)
    }
  }, [])

  // 페이지 최상단으로 스크롤
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [])

  return {
    detailContainerRef,
    saveScrollPosition,
    restoreScrollPosition,
    scrollToDetail,
    scrollToTop
  }
}