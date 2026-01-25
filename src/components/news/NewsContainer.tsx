'use client'

import { useState, useCallback } from 'react'
import NewsFilters from './NewsFilters'
import NewsList from './NewsList'
import { NewsSearchParams, NewsItem } from '@/types/Board'

interface NewsContainerProps {
  initialCategories: Array<{
    id: string
    name: string
    count: number
  }>
  initialNews: NewsItem[]
  initialTotalCount: number
  initialHasMore: boolean
  initialNextCursor?: string
}

export default function NewsContainer({ 
  initialCategories,
  initialNews,
  initialTotalCount,
  initialHasMore,
  initialNextCursor
}: NewsContainerProps) {
  const [searchParams, setSearchParams] = useState<NewsSearchParams>({
    category: 'all',
    search: '',
    sort: 'newest',
    limit: 10
  })

  const handleFilterChange = useCallback((newParams: Partial<NewsSearchParams>) => {
    setSearchParams(prev => ({ ...prev, ...newParams }))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* 사이드바 - 필터 */}
        <div className="lg:col-span-1 space-y-6 hidden sm:flex">
          <NewsFilters 
            categories={initialCategories}
            searchParams={searchParams}
            onFilterChange={handleFilterChange}
          />
        </div>
        
        {/* 메인 콘텐츠 - 뉴스 리스트/상세 */}
        <div className="lg:col-span-3">
          <NewsList 
            searchParams={searchParams}
            initialNews={initialNews}
            initialTotalCount={initialTotalCount}
            initialHasMore={initialHasMore}
            initialNextCursor={initialNextCursor}
          />
        </div>
      </div>
    </div>
  )
}