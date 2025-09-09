import Link from 'next/link'
import { ArrowRight, Heart, Users, Handshake, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const overviewCards = [
  {
    id: 'diversity',
    icon: Heart,
    title: '가족다양성',
    description: '모든 형태의 가족을 존중하고 인정하는 문화 확산',
    features: ['한부모가족 인식개선', '가족형태 다양성 인정', '상호 이해와 공감'],
    href: '/festival',
    color: 'bg-pink-500'
  },
  {
    id: 'participation',
    icon: Users,
    title: '시민참여',
    description: '시민이 주체가 되어 함께 만들어가는 축제',
    features: ['자원봉사 참여', '프로그램 기획 참여', '온라인 캠페인'],
    href: '/register',
    color: 'bg-blue-500'
  },
  {
    id: 'support-groups',
    icon: Handshake,
    title: '자조모임',
    description: '한부모가족 자조모임이 중심이 되는 연대의 장',
    features: ['자조모임 부스 운영', '경험 나눔', '네트워킹'],
    href: '/programs?category=support-group',
    color: 'bg-green-500'
  },
  {
    id: 'solidarity',
    icon: Globe,
    title: '연대',
    description: '지역사회와 함께하는 포용적 공동체 실현',
    features: ['기관 협력', '시민사회 연대', '지속가능한 지원체계'],
    href: '/partners',
    color: 'bg-purple-500'
  }
]

export default function FestivalOverview() {
  return (
    <div className="max-w-7xl mx-auto container-padding">
      {/* 섹션 헤더 */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
          축제 소개
        </div>
        <h2 className="text-responsive-xl font-bold text-foreground mb-4">
          축제 한눈에 보기
        </h2>
        <p className="text-responsive-base text-muted-foreground max-w-3xl mx-auto">
          모두하나대축제는 가족다양성 인식 확산과 시민 연대 문화 조성을 위한<br className="hidden sm:block" />
          서울시 대표 가족축제입니다
        </p>
      </div>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {overviewCards.map((card, index) => {
          const Icon = card.icon
          
          return (
            <Card 
              key={card.id}
              className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 festival-card-hover"
            >
              <CardContent className="p-0">
                {/* 컬러 헤더 */}
                <div className={`${card.color} p-6 text-white relative`}>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
                  <div className="relative z-10">
                    <Icon className="w-8 h-8 mb-4" />
                    <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                  </div>
                </div>

                {/* 콘텐츠 */}
                <div className="p-6">
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {card.description}
                  </p>
                  
                  <ul className="space-y-2 mb-6">
                    {card.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    variant="ghost"
                    className="w-full group-hover:bg-muted transition-colors"
                  >
                    <Link href={card.href} className="flex items-center justify-center">
                      자세히 보기
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 하단 CTA */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 lg:p-12">
          <h3 className="text-responsive-lg font-bold text-foreground mb-4">
            모두가 함께하는 축제에 참여하세요
          </h3>
          <p className="text-responsive-base text-muted-foreground mb-8 max-w-2xl mx-auto">
            온라인 캠페인부터 현장 축제까지, 다양한 방법으로 참여할 수 있습니다
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="px-8">
              <Link href="/register">
                사전참가 신청하기
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="px-8">
              <Link href="/online-festival">
                온라인 캠페인 참여
              </Link>
            </Button>
            
            <Button asChild variant="ghost" size="lg" className="px-8">
              <Link href="/programs">
                프로그램 둘러보기
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 통계 섹션 */}
      <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: '예상 참가자', value: '5,000+', description: '시민' },
          { label: '참여 프로그램', value: '50+', description: '개' },
          { label: '자조모임 부스', value: '20+', description: '개' },
          { label: '협력 기관', value: '30+', description: '곳' }
        ].map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-responsive-xl font-bold text-primary mb-2">
              {stat.value}
            </div>
            <div className="text-foreground font-medium mb-1">
              {stat.label}
            </div>
            <div className="text-sm text-muted-foreground">
              {stat.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}