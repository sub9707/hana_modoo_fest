'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Users, Hash, Camera, Trophy } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface CounterStats {
  totalParticipants: number
  hashtagPosts: number
  photoPosts: number
  quizParticipants: number
  weeklyGrowth: number
}

interface ParticipationCounterProps {
  stats: CounterStats
}

export default function ParticipationCounter({ stats }: ParticipationCounterProps) {
  const [animatedStats, setAnimatedStats] = useState({
    totalParticipants: 0,
    hashtagPosts: 0,
    photoPosts: 0,
    quizParticipants: 0
  })

  useEffect(() => {
    const duration = 2000 // 2초 동안 애니메이션
    const steps = 60
    const stepDuration = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = Math.min(step / steps, 1)
      
      // easeOutQuart 이징 함수
      const easedProgress = 1 - Math.pow(1 - progress, 4)
      
      setAnimatedStats({
        totalParticipants: Math.floor(stats.totalParticipants * easedProgress),
        hashtagPosts: Math.floor(stats.hashtagPosts * easedProgress),
        photoPosts: Math.floor(stats.photoPosts * easedProgress),
        quizParticipants: Math.floor(stats.quizParticipants * easedProgress)
      })

      if (progress >= 1) {
        clearInterval(timer)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [stats])

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  const counterItems = [
    {
      icon: Users,
      label: '총 참여자',
      value: animatedStats.totalParticipants,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Hash,
      label: '해시태그',
      value: animatedStats.hashtagPosts,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Camera,
      label: '포토 스토리',
      value: animatedStats.photoPosts,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Trophy,
      label: '퀴즈 참여',
      value: animatedStats.quizParticipants,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {counterItems.map((item, index) => {
        const Icon = item.icon
        
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className={`w-12 h-12 ${item.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {formatNumber(item.value)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.label}
                  </div>
                </div>
              </div>
              
              {/* 성장률 표시 (총 참여자에만) */}
              {index === 0 && stats.weeklyGrowth > 0 && (
                <div className="flex items-center mt-3 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>+{stats.weeklyGrowth}% 이번 주</span>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}