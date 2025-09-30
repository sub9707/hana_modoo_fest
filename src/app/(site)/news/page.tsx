import { Metadata } from 'next'
import { Suspense } from 'react'
import NewsContainer from '@/components/news/NewsContainer'
import NewsHero from '@/components/news/NewsHero'
import { NewsService } from '@/lib/services/news-service'
import NewsListSkeleton from '@/components/news/NewsListSkeleton'

export const metadata: Metadata = {
  title: '공지/소식 | 모두하나대축제 2025',
  description: '모두하나대축제 2025의 최신 소식과 공지사항을 확인하세요.',
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
  icons: {
    icon: '/favicon.ico',
  }
}

// NextJS 15: 서버에서 초기 데이터 fetch
async function getInitialData() {
  try {
    // 병렬로 데이터 요청 (성능 최적화)
    const [categories, initialNews] = await Promise.all([
      NewsService.getCategories(),
      NewsService.getNewsList({
        sort: 'newest',
        limit: 10
      })
    ])

    return {
      categories,
      initialNews: initialNews.news,
      totalCount: initialNews.totalCount,
      hasMore: initialNews.hasMore,
      nextCursor: initialNews.nextCursor,
    }
  } catch (error) {
    console.error('Failed to fetch initial data:', error)
    return {
      categories: [{ id: 'all', name: '전체', count: 0 }],
      initialNews: [],
      totalCount: 0,
      hasMore: false,
      nextCursor: undefined,
    }
  }
}

export default async function NewsPage() {
  // 서버에서 데이터 미리 로드
  const initialData = await getInitialData()

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 font-paper">
      {/* 히어로 섹션 */}
      <NewsHero />

      {/* 메인 콘텐츠 with Suspense */}
      <Suspense fallback={<NewsListSkeleton />}>
        <NewsContainer
          initialCategories={initialData.categories}
          initialNews={initialData.initialNews}
          initialTotalCount={initialData.totalCount}
          initialHasMore={initialData.hasMore}
          initialNextCursor={initialData.nextCursor}
        />
      </Suspense>
    </div>
  )
}