'use client'

import { useState, useEffect } from 'react'

interface HeroAnimationProps {
  children: React.ReactNode
}

export default function HeroAnimation({ children }: HeroAnimationProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={`text-center space-y-8 xl:space-y-12 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {children}
    </div>
  )
}