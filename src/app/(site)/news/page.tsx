import { Metadata } from 'next'
import { Suspense } from 'react'
import NewsContainer from '@/components/news/NewsContainer'
import NewsHero from '@/components/news/NewsHero'
import { NewsService } from '@/lib/services/news-service'
import NewsListSkeleton from '@/components/news/NewsListSkeleton'
import PageLayout from '@/components/layout/PageLayout'
import { PAGE_SEO, createPageMetadata } from '@/constants'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = createPageMetadata(
  PAGE_SEO.news.title,
  PAGE_SEO.news.description,
  {
    keywords: [...PAGE_SEO.news.keywords],
    ogDescription: '축제 관련 최신 소식과 중요 공지사항을 확인하세요.',
  }
)

// 서버에서 초기 데이터 fetch
async function getInitialData() {
  try {
    // 병렬로 데이터 요청
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

  const initialData = await getInitialData()

  return (
    <PageLayout variant="gradient-purple">
      {/* 히어로 섹션 */}
      <NewsHero />

      {/* 메인 콘텐츠 */}
      <Suspense fallback={<NewsListSkeleton />}>
        <NewsContainer
          initialCategories={initialData.categories}
          initialNews={initialData.initialNews}
          initialTotalCount={initialData.totalCount}
          initialHasMore={initialData.hasMore}
          initialNextCursor={initialData.nextCursor}
        />
      </Suspense>
    </PageLayout>
  )
}