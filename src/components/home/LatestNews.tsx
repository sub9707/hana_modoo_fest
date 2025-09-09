import Link from 'next/link'
import { ArrowRight, Calendar, Pin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface NewsItem {
  id: string
  title: string
  excerpt: string
  category: string
  publishedAt: string
  isPinned: boolean
}

interface LatestNewsProps {
  news: NewsItem[]
}

const categoryLabels: Record<string, string> = {
  recruitment: '모집',
  event: '이벤트',
  winner: '당첨자',
  'venue-info': '현장안내',
  safety: '안전'
}

const categoryColors: Record<string, string> = {
  recruitment: 'bg-blue-100 text-blue-700',
  event: 'bg-green-100 text-green-700',
  winner: 'bg-yellow-100 text-yellow-700',
  'venue-info': 'bg-purple-100 text-purple-700',
  safety: 'bg-red-100 text-red-700'
}

export default function LatestNews({ news }: LatestNewsProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-7xl mx-auto container-padding">
      {/* 섹션 헤더 */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12">
        <div>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm font-medium mb-4">
            최신 소식
          </div>
          <h2 className="text-responsive-xl font-bold text-foreground mb-4">
            공지사항 & 소식
          </h2>
          <p className="text-responsive-base text-muted-foreground">
            축제 관련 최신 소식과 중요한 공지사항을 확인하세요
          </p>
        </div>
        
        <Button asChild variant="outline" className="mt-6 lg:mt-0">
          <Link href="/news">
            전체 보기
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>

      {/* 뉴스 카드 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {news.map((item, index) => (
          <Card key={item.id} className="group hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <Badge className={categoryColors[item.category] || 'bg-muted text-muted-foreground'}>
                  {categoryLabels[item.category] || item.category}
                </Badge>
                
                {item.isPinned && (
                  <Pin className="w-4 h-4 text-primary" />
                )}
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                <Link href={`/news/${item.id}`}>
                  {item.title}
                </Link>
              </h3>
              
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
                {item.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(item.publishedAt)}</span>
                </div>
                
                <Link 
                  href={`/news/${item.id}`}
                  className="text-sm text-primary hover:text-primary/80 font-medium flex items-center space-x-1 group"
                >
                  <span>자세히</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 하단 CTA */}
      <div className="mt-12 text-center">
        <div className="bg-primary/5 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            놓치지 마세요!
          </h3>
          <p className="text-muted-foreground mb-6">
            축제 관련 최신 소식을 이메일로 받아보시겠어요?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Button asChild>
              <Link href="/register">
                참가신청하고 소식받기
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}