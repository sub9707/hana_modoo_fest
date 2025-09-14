import { Metadata } from 'next'
import NewsHero from '@/components/news/NewsHero'
import NewsFilters from '@/components/news/NewsFilters'
import NewsList from '@/components/news/NewsList'

export const metadata: Metadata = {
  title: '공지/소식',
  description: '모두하나대축제 2025의 최신 소식과 공지사항을 확인하세요. 참가신청, 이벤트, 당첨자 발표, 현장 안내 등의 정보를 제공합니다.',
  openGraph: {
    title: '공지/소식 | 모두하나대축제 2025',
    description: '축제 관련 최신 소식과 중요 공지사항을 확인하세요.',
  },
}

// 서버 컴포넌트에서 뉴스 데이터 가져오기
async function getNewsData() {
  // 실제로는 데이터베이스나 CMS에서 가져옴
  return {
    categories: [
      { id: 'all', name: '전체', count: 24 },
      { id: 'notice', name: '공지사항', count: 8 },
      { id: 'recruitment', name: '모집공고', count: 5 },
      { id: 'event', name: '이벤트', count: 6 },
      { id: 'winner', name: '당첨자발표', count: 3 },
      { id: 'guide', name: '현장안내', count: 2 },
    ],
    totalNews: 24,
    latestNews: '2025-09-12'
  }
}

export default async function NewsPage() {
  const newsData = await getNewsData()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 히어로 섹션 */}
      <NewsHero 
        totalNews={newsData.totalNews} 
        latestNews={newsData.latestNews} 
      />
      
      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* 사이드바 - 필터 및 구독 */}
          <div className="lg:col-span-1 space-y-6">
            <NewsFilters categories={newsData.categories} />
          </div>
          
          {/* 메인 콘텐츠 - 뉴스 리스트 */}
          <div className="lg:col-span-3">
            <NewsList />
          </div>
        </div>
      </div>
    </div>
  )
}