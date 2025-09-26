'use client'

import { NewsItem } from '@/types/Board'

interface NewsCardProps {
  news: NewsItem
  onClick: () => void
}

export default function NewsCard({ news, onClick }: NewsCardProps) {
  const getCategoryColor = (category: string) => {
    const colors = {
      '공지사항': 'bg-blue-100 text-blue-700',
      '모집공고': 'bg-green-100 text-green-700',
      '이벤트': 'bg-purple-100 text-purple-700',
      '당첨자발표': 'bg-orange-100 text-orange-700',
      '현장안내': 'bg-gray-100 text-gray-700',
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div
      onClick={onClick}
      className="bg-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group active:scale-98"
    >
      <div className="p-4 sm:p-6">
        {/* 상단 뱃지 및 메타 정보 */}
        <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
          {/* 뱃지 섹션 */}
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 min-w-0">
            {news.important && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                중요
              </span>
            )}
            <span className={`px-2 py-1 sm:px-3 rounded-full text-xs font-medium whitespace-nowrap ${getCategoryColor(news.category)}`}>
              {news.category}
            </span>
          </div>
          
          {/* 날짜 */}
          <div className="flex-shrink-0 text-xs text-gray-500">
            <span className="hidden sm:block">{news.date}</span>
            <span className="sm:hidden">{news.date.slice(2)}</span>
          </div>
        </div>
        
        {/* 제목 */}
        <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
          {news.title}
        </h3>
        
        {/* 요약 */}
        <p className="text-sm text-gray-600 mb-3 sm:mb-4 leading-relaxed line-clamp-2">
          {news.summary}
        </p>
        
        {/* 첨부파일 표시 */}
        {news.attachments && news.attachments.length > 0 && (
          <div className="flex items-center space-x-1.5 mb-3 sm:mb-4">
            <span className="text-gray-400 text-sm">📎</span>
            <span className="text-gray-500 text-xs">
              첨부파일 {news.attachments.length}개
            </span>
          </div>
        )}
        
        {/* 더보기 링크 */}
        <div className="pt-1">
          <span className="text-blue-500 group-hover:text-blue-700 font-medium text-xs sm:text-sm transition-colors">
            자세히 보기 →
          </span>
        </div>
      </div>
    </div>
  )
}