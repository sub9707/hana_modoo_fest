interface NewsHeroProps {
  totalNews: number
  todayNews?: number
  totalViews?: number
  latestNews?: string | null
  hasImportantNews?: boolean
}

export default function NewsHero({ 
  totalNews, 
  todayNews = 0,
  totalViews = 0,
  latestNews,
  hasImportantNews = false
}: NewsHeroProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          공지 · 소식
        </h1>
        <p className="text-xl text-blue-100 mb-8">
          모두하나대축제 2025의 최신 소식과 중요한 공지사항을 확인하세요
        </p>
        
        {/* 통계 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-300">
              {totalNews.toLocaleString()}
            </div>
            <div className="text-blue-100">총 소식</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold text-green-300">
              {todayNews.toLocaleString()}
            </div>
            <div className="text-blue-100">오늘 등록</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-300">
              {totalViews.toLocaleString()}
            </div>
            <div className="text-blue-100">총 조회수</div>
          </div>
        </div>

        {/* 중요 공지 알림 */}
        {hasImportantNews && (
          <div className="mt-8 bg-red-500/20 border border-red-300/30 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-red-200">📢</span>
              <span className="font-medium">중요한 공지사항이 있습니다!</span>
            </div>
          </div>
        )}
        
        {/* 최신 업데이트 정보 */}
        {latestNews && (
          <div className="mt-6 text-blue-200 text-sm">
            최근 업데이트: {new Date(latestNews).toLocaleDateString('ko-KR')}
          </div>
        )}
      </div>
    </div>
  )
}