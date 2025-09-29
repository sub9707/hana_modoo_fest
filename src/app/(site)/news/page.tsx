import { Metadata } from 'next'
import NewsContainer from '@/components/news/NewsContainer'
import NewsHero from '@/components/news/NewsHero'
import { NewsService } from '@/lib/services/news-service'

export const metadata: Metadata = {
  title: '공지/소식 | 모두하나대축제 2025',
  description: '모두하나대축제 2025의 최신 소식과 공지사항을 확인하세요. 참가신청, 이벤트, 당첨자 발표, 현장 안내 등의 정보를 제공합니다.',
  keywords: ['모두하나대축제', '2025', '공지사항', '이벤트', '한부모가족', '축제'],
  openGraph: {
    title: '공지/소식 | 모두하나대축제 2025',
    description: '축제 관련 최신 소식과 중요 공지사항을 확인하세요.',
    type: 'website',
    locale: 'ko_KR',
    images: [
      {
        url: '/images/modoo_hana_image.png',
        width: 332,
        height: 265,
        alt: '모두하나대축제 2025 로고',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '공지/소식 | 모두하나대축제 2025',
    description: '축제 관련 최신 소식과 중요 공지사항을 확인하세요.',
  }
}

// 초기 데이터 fetch (서버 컴포넌트임)
async function getInitialData() {
  try {
    // 병렬로 여러 데이터 요청
    const [categories, stats, recentNews] = await Promise.all([
      NewsService.getCategories(),
      NewsService.getNewsStatistics(),
      NewsService.getRecentNews(3) // 최근 3개 뉴스
    ])

    return {
      categories,
      totalNews: stats.totalNews,
      todayNews: stats.todayNews,
      totalViews: stats.totalViews,
      latestNews: recentNews.length > 0 ? recentNews[0].date : null,
    }
  } catch (error) {
    console.error('Failed to fetch initial data:', error)

    // 폴백 데이터
    return {
      categories: [{ id: 'all', name: '전체', count: 0 }],
      totalNews: 0,
      todayNews: 0,
      totalViews: 0,
      latestNews: null,
    }
  }
}

export default async function NewsPage() {
  const initialData = await getInitialData()

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 font-paper">
      {/* 히어로 섹션 */}
      <NewsHero />

      {/* 메인 콘텐츠 */}
      <NewsContainer initialCategories={initialData.categories} />
    </div>
  )
}