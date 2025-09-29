'use client'

import { memo, useMemo } from 'react'
import { NewsItem } from '@/types/Board'

interface NewsCardProps {
  news: NewsItem
  onClick: () => void
}

// 🚀 카테고리 색상 매핑 (컴포넌트 외부로 이동 - 성능 최적화)
const CATEGORY_COLORS = {
  '공지사항': 'bg-blue-100 text-blue-700',
  '모집공고': 'bg-green-100 text-green-700',
  '이벤트': 'bg-purple-100 text-purple-700',
  '당첨자발표': 'bg-orange-100 text-orange-700',
  '현장안내': 'bg-gray-100 text-gray-700',
} as const

// 🚀 기본 색상 (상수로 분리)
const DEFAULT_CATEGORY_COLOR = 'bg-gray-100 text-gray-700'

// 🚀 공통 스타일 클래스 (재사용성 향상)
const STYLES = {
  container: `
    bg-white shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer 
    overflow-hidden group active:scale-98 rounded-lg
  `,
  importantBadge: 'bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap',
  categoryBadge: 'px-2 py-1 sm:px-3 rounded-full text-xs font-medium whitespace-nowrap',
  title: `
    text-base sm:text-lg font-bold text-gray-800 mb-2 sm:mb-3 
    group-hover:text-blue-600 transition-colors leading-tight line-clamp-2
  `,
  summary: 'text-sm text-gray-600 mb-3 sm:mb-4 leading-relaxed line-clamp-2',
  attachment: 'flex items-center space-x-1.5 mb-3 sm:mb-4',
  moreLink: `
    text-blue-500 group-hover:text-blue-700 font-medium text-xs sm:text-sm 
    transition-colors inline-flex items-center space-x-1
  `
} as const

// 🚀 메모이제이션된 NewsCard 컴포넌트
function NewsCard({ news, onClick }: NewsCardProps) {
  // 🚀 카테고리 색상 메모이제이션
  const categoryColorClass = useMemo(() => {
    return CATEGORY_COLORS[news.category as keyof typeof CATEGORY_COLORS] || DEFAULT_CATEGORY_COLOR
  }, [news.category])

  // 🚀 날짜 포맷 메모이제이션
  const { fullDate, shortDate } = useMemo(() => {
    return {
      fullDate: news.date,
      shortDate: news.date.slice(2) // "2024-01-01" → "24-01-01"
    }
  }, [news.date])

  // 🚀 첨부파일 정보 메모이제이션
  const attachmentInfo = useMemo(() => {
    const count = news.attachments?.length || 0
    return {
      hasAttachments: count > 0,
      count,
      text: `첨부파일 ${count}개`
    }
  }, [news.attachments?.length])

  // 🚀 메모이제이션된 렌더링
  return (
    <article
      onClick={onClick}
      className={STYLES.container}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      aria-label={`뉴스 기사: ${news.title}`}
    >
      <div className="p-4 sm:p-6">
        {/* 🚀 상단 뱃지 및 메타 정보 */}
        <header className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
          {/* 뱃지 섹션 */}
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 min-w-0">
            {news.important && (
              <span className={STYLES.importantBadge}>
                중요
              </span>
            )}
            <span className={`${STYLES.categoryBadge} ${categoryColorClass}`}>
              {news.category}
            </span>
          </div>
          
          {/* 날짜 */}
          <time 
            className="flex-shrink-0 text-xs text-gray-500"
            dateTime={news.date}
          >
            <span className="hidden sm:block">{fullDate}</span>
            <span className="sm:hidden">{shortDate}</span>
          </time>
        </header>
        
        {/* 🚀 제목 */}
        <h3 className={STYLES.title}>
          {news.title}
        </h3>
        
        {/* 🚀 요약 (있는 경우만 렌더링) */}
        {news.summary && (
          <p className={STYLES.summary}>
            {news.summary}
          </p>
        )}
        
        {/* 🚀 첨부파일 표시 (조건부 렌더링 최적화) */}
        {attachmentInfo.hasAttachments && (
          <div className={STYLES.attachment}>
            <span className="text-gray-400 text-sm" aria-hidden="true">📎</span>
            <span className="text-gray-500 text-xs">
              {attachmentInfo.text}
            </span>
          </div>
        )}
        
        {/* 🚀 더보기 링크 */}
        <footer className="pt-1">
          <span className={STYLES.moreLink}>
            <span>자세히 보기</span>
            <span aria-hidden="true">→</span>
          </span>
        </footer>
      </div>
    </article>
  )
}

// 🚀 React.memo로 불필요한 리렌더링 방지
export default memo(NewsCard, (prevProps, nextProps) => {
  // 🚀 커스텀 비교 함수 (더 정밀한 메모이제이션)
  return (
    prevProps.news.id === nextProps.news.id &&
    prevProps.news.title === nextProps.news.title &&
    prevProps.news.summary === nextProps.news.summary &&
    prevProps.news.date === nextProps.news.date &&
    prevProps.news.category === nextProps.news.category &&
    prevProps.news.important === nextProps.news.important &&
    prevProps.news.attachments?.length === nextProps.news.attachments?.length &&
    prevProps.onClick === nextProps.onClick
  )
})