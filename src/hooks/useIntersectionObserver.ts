'use client'

import { useEffect, useRef, useState } from 'react'

interface UseIntersectionObserverProps {
  onIntersect: () => void
  enabled?: boolean
  threshold?: number
  rootMargin?: string
}

export function useIntersectionObserver({
  onIntersect,
  enabled = true,
  threshold = 0.1,
  rootMargin = '100px'
}: UseIntersectionObserverProps) {
  const targetRef = useRef<HTMLDivElement>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const target = targetRef.current
    if (!target || !enabled) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        setIsIntersecting(entry.isIntersecting)
        
        if (entry.isIntersecting) {
          onIntersect()
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(target)

    return () => {
      observer.unobserve(target)
    }
  }, [onIntersect, enabled, threshold, rootMargin])

  return { targetRef, isIntersecting }
}