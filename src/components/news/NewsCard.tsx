'use client'

import { memo, useMemo } from 'react'
import { NewsItem } from '@/types/Board'

interface NewsCardProps {
  news: NewsItem
  onClick: () => void
}

const STYLES = {
  container: `
    bg-white rounded-lg border border-gray-200 cursor-pointer group
    transition-colors duration-200 hover:border-orange-300
  `,
  importantBadge: 'rounded border border-orange-300 px-1.5 py-0.5 text-xs font-semibold text-orange-600 whitespace-nowrap',
  categoryBadge: 'text-xs font-medium text-gray-500 whitespace-nowrap',
  title: `
    text-base sm:text-lg font-bold text-gray-900 mb-2
    group-hover:text-orange-600 transition-colors leading-snug line-clamp-2
  `,
  summary: 'text-sm text-gray-600 leading-relaxed line-clamp-2',
  attachment: 'mt-3 text-xs text-gray-500',
} as const

// 메모이제이션된 NewsCard 컴포넌트
function NewsCard({ news, onClick }: NewsCardProps) {
  // 날짜 포맷 메모이제이션
  const { fullDate, shortDate } = useMemo(() => {
    return {
      fullDate: news.date,
      shortDate: news.date.slice(2) // "2024-01-01" → "24-01-01"
    }
  }, [news.date])

  // 첨부파일 정보 메모이제이션
  const attachmentInfo = useMemo(() => {
    const count = news.attachments?.length || 0
    return {
      hasAttachments: count > 0,
      count,
      text: `첨부파일 ${count}개`
    }
  }, [news.attachments?.length])

  // 메모이제이션된 렌더링
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
        {/* 상단 뱃지 및 메타 정보 */}
        <header className="flex items-center justify-between mb-2 gap-2">
          {/* 뱃지 섹션 */}
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 min-w-0">
            {news.important && (
              <span className={STYLES.importantBadge}>
                중요
              </span>
            )}
            <span className={STYLES.categoryBadge}>
              {news.category}
            </span>
          </div>
          
          {/* 날짜 */}
          <time 
            className="flex-shrink-0 text-xs text-gray-400 tabular-nums"
            dateTime={news.date}
          >
            <span className="hidden sm:block">{fullDate}</span>
            <span className="sm:hidden">{shortDate}</span>
          </time>
        </header>
        
        {/* 제목 */}
        <h3 className={STYLES.title}>
          {news.title}
        </h3>
        
        {/* 요약 (있는 경우만 렌더링) */}
        {news.summary && (
          <p className={STYLES.summary}>
            {news.summary}
          </p>
        )}
        
        {/* 첨부파일 표시 (조건부 렌더링 최적화) */}
        {attachmentInfo.hasAttachments && (
          <p className={STYLES.attachment}>{attachmentInfo.text}</p>
        )}
      </div>
    </article>
  )
}

// React.memo로 불필요한 리렌더링 방지
export default memo(NewsCard, (prevProps, nextProps) => {
  // 커스텀 비교 함수 (더 정밀한 메모이제이션)
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