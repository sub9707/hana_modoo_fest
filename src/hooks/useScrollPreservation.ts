import { useCallback, useRef } from 'react'

interface ScrollPosition {
  scrollTop: number
  scrollHeight: number
  timestamp: number
}

export function useScrollPreservation() {
  const scrollPositionRef = useRef<ScrollPosition | null>(null)
  const preservationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const saveScrollPosition = useCallback(() => {
    scrollPositionRef.current = {
      scrollTop: window.scrollY,
      scrollHeight: document.documentElement.scrollHeight,
      timestamp: Date.now()
    }

    // 5초 후 자동으로 저장된 위치 삭제 (메모리 누수 방지)
    if (preservationTimeoutRef.current) {
      clearTimeout(preservationTimeoutRef.current)
    }
    preservationTimeoutRef.current = setTimeout(() => {
      scrollPositionRef.current = null
    }, 5000)
  }, [])

  const restoreScrollPosition = useCallback(() => {
    if (!scrollPositionRef.current) return

    const { scrollTop, scrollHeight, timestamp } = scrollPositionRef.current
    const currentScrollHeight = document.documentElement.scrollHeight
    const heightDiff = currentScrollHeight - scrollHeight
    const timeDiff = Date.now() - timestamp

    // 1초 이내의 변경만 복원 (오래된 위치는 무시)
    if (timeDiff < 1000 && heightDiff > 0) {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: scrollTop + heightDiff,
          behavior: 'instant'
        })
      })
    }

    scrollPositionRef.current = null
    if (preservationTimeoutRef.current) {
      clearTimeout(preservationTimeoutRef.current)
    }
  }, [])

  return { saveScrollPosition, restoreScrollPosition }
}