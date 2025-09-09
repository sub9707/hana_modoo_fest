'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Hash, Camera, Trophy, Users, ArrowRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

interface CampaignStats {
  totalParticipants: number
  hashtagPosts: number
  photoPosts: number
  quizParticipants: number
}

interface OnlineCampaignProps {
  stats: CampaignStats
}

const campaignActivities = [
  {
    id: 'hashtag',
    icon: Hash,
    title: '해시태그 챌린지',
    description: '#모두의서울 #함께하는축제 해시태그와 함께 일상 속 가족 이야기를 공유해주세요',
    period: '9월 1일 ~ 10월 17일',
    reward: '주간 우수작 선정 및 상품 증정',
    status: 'active',
    participants: 'hashtagPosts'
  },
  {
    id: 'photo',
    icon: Camera,
    title: '포토 스토리',
    description: '우리 가족만의 특별한 순간을 사진과 함께 스토리로 들려주세요',
    period: '9월 15일 ~ 10월 17일', 
    reward: '월간 베스트 포토 시상',
    status: 'active',
    participants: 'photoPosts'
  },
  {
    id: 'quiz',
    icon: Trophy,
    title: '주간 퀴즈',
    description: '가족다양성과 관련된 재미있는 퀴즈를 풀고 선물도 받아가세요',
    period: '매주 화요일 업데이트',
    reward: '정답자 중 추첨하여 기프트콘 증정',
    status: 'active', 
    participants: 'quizParticipants'
  }
]

export default function OnlineCampaign({ stats }: OnlineCampaignProps) {
  const [countUp, setCountUp] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setCountUp(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const getAnimatedValue = (targetValue: number) => {
    return countUp ? targetValue : 0
  }

  return (
    <div className="max-w-7xl mx-auto container-padding">
      {/* 섹션 헤더 */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
          <Play className="w-4 h-4 mr-2" />
          현재 진행중
        </div>
        <h2 className="text-responsive-xl font-bold text-foreground mb-4">
          온라인 캠페인 참여하기
        </h2>
        <p className="text-responsive-base text-muted-foreground max-w-3xl mx-auto">
          집에서도, 길에서도, 언제 어디서나 함께할 수 있는<br className="hidden sm:block" />
          온라인 캠페인에 참여해보세요
        </p>
      </div>

      {/* 참여 현황 카운터 */}
      <div className="mb-16">
        <div className="festival-gradient rounded-2xl p-8 lg:p-12 text-white">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-responsive-xl font-bold mb-2">
                <span className={countUp ? 'animate-pulse' : ''}>
                  {getAnimatedValue(stats.totalParticipants).toLocaleString()}
                </span>
                <span className="text-xl">+</span>
              </div>
              <div className="text-blue-100 font-medium">총 참여자</div>
            </div>
            
            <div className="text-center">
              <div className="text-responsive-xl font-bold mb-2">
                <span className={countUp ? 'animate-pulse' : ''}>
                  {getAnimatedValue(stats.hashtagPosts).toLocaleString()}
                </span>
              </div>
              <div className="text-blue-100 font-medium">해시태그 게시물</div>
            </div>
            
            <div className="text-center">
              <div className="text-responsive-xl font-bold mb-2">
                <span className={countUp ? 'animate-pulse' : ''}>
                  {getAnimatedValue(stats.photoPosts).toLocaleString()}
                </span>
              </div>
              <div className="text-blue-100 font-medium">포토 스토리</div>
            </div>
            
            <div className="text-center">
              <div className="text-responsive-xl font-bold mb-2">
                <span className={countUp ? 'animate-pulse' : ''}>
                  {getAnimatedValue(stats.quizParticipants).toLocaleString()}
                </span>
              </div>
              <div className="text-blue-100 font-medium">퀴즈 참여자</div>
            </div>
          </div>
        </div>
      </div>

      {/* 캠페인 활동 카드 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {campaignActivities.map((activity, index) => {
          const Icon = activity.icon
          const participantCount = stats[activity.participants as keyof CampaignStats]
          
          return (
            <Card key={activity.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-0">
                {/* 이미지 헤더 */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon className="w-16 h-16 text-blue-600" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* 상태 배지 */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-500 hover:bg-green-500 text-white">
                      진행중
                    </Badge>
                  </div>
                  
                  {/* 참여자 수 */}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                    <div className="flex items-center space-x-1 text-sm font-medium">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>{participantCount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* 콘텐츠 */}
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{activity.title}</h3>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {activity.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">참여 기간</span>
                      <span className="font-medium text-foreground">{activity.period}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">혜택</span>
                      <span className="font-medium text-foreground">{activity.reward}</span>
                    </div>
                  </div>

                  <Button 
                    asChild 
                    className="w-full"
                  >
                    <Link href={`/online-festival/campaign/${activity.id}`}>
                      참여하기
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 실시간 피드 미리보기 */}
      <div className="bg-muted rounded-2xl p-8 lg:p-12">
        <div className="flex flex-col lg:flex-row items-center justify-between mb-8">
          <div>
            <h3 className="text-responsive-lg font-bold text-foreground mb-2">
              실시간 참여 피드
            </h3>
            <p className="text-muted-foreground">
              지금 이 순간에도 많은 분들이 캠페인에 참여하고 계세요
            </p>
          </div>
          
          <Button asChild variant="outline" className="mt-4 lg:mt-0">
            <Link href="/online-festival">
              전체 피드 보기
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* 피드 그리드 (Mock 데이터) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-card rounded-lg overflow-hidden shadow-sm">
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <Camera className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="p-3">
                <p className="text-xs text-muted-foreground mb-1">user****</p>
                <p className="text-sm text-foreground line-clamp-2">
                  #모두의서울 우리 가족의 소중한 일상...
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 CTA */}
      <div className="mt-16 text-center">
        <Button asChild size="lg" className="festival-gradient px-8">
          <Link href="/online-festival">
            온라인 축제 전체 보기
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  )
}