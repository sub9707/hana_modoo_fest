'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import NewsCard from './NewsCard'
import NewsDetail from './NewsDetail'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useInfiniteNews } from '@/hooks/useInfiniteNews'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { NewsSearchParams, NewsItem } from '@/types/Board'

interface NewsListProps {
  searchParams: NewsSearchParams
  initialNews: NewsItem[]
  initialTotalCount: number
  initialHasMore: boolean
  initialNextCursor?: string
}

const NEWS_DETAIL_CACHE = new Map<string, NewsItem>()
const CACHE_MAX_SIZE = 20

export default function NewsList({ 
  searchParams,
  initialNews,
  initialTotalCount,
  initialHasMore,
  initialNextCursor
}: NewsListProps) {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const isMountedRef = useRef(true)

  const {
    news,
    loading,
    error,
    hasMore,
    loadMore,
    totalCount
  } = useInfiniteNews(searchParams, {
    initialNews,
    initialTotalCount,
    initialHasMore,
    initialNextCursor
  })

  // 중복 제거
  const uniqueNews = useMemo(() => {
    const seen = new Set<string>()
    return news.filter(item => {
      if (seen.has(item.id)) return false
      seen.add(item.id)
      return true
    })
  }, [news])

  const { importantNews, regularNews } = useMemo(() => {
    const important = uniqueNews.filter(item => item.important)
    const regular = uniqueNews.filter(item => !item.important)
    return { importantNews: important, regularNews: regular }
  }, [uniqueNews])

  const intersectionConfig = useMemo(() => ({
    onIntersect: loadMore,
    enabled: !loading && hasMore && !selectedNews
  }), [loadMore, loading, hasMore, selectedNews])

  const { targetRef } = useIntersectionObserver(intersectionConfig)

  const manageCacheSize = useCallback(() => {
    if (NEWS_DETAIL_CACHE.size > CACHE_MAX_SIZE) {
      const firstKey = NEWS_DETAIL_CACHE.keys().next().value
      if (firstKey) NEWS_DETAIL_CACHE.delete(firstKey)
    }
  }, [])

  // ✨ 개선된 카드 클릭 핸들러 (Optimistic UI)
  const handleCardClick = useCallback(async (newsItem: NewsItem) => {
    if (!isMountedRef.current) return

    // 캐시에서 확인
    const cachedDetail = NEWS_DETAIL_CACHE.get(newsItem.id)
    if (cachedDetail) {
      setSelectedNews(cachedDetail)
      return
    }

    // ✨ Optimistic UI: 즉시 기본 데이터 표시
    setSelectedNews(newsItem)
    setLoadingDetail(true)

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller
    
    try {
      const response = await fetch(`/api/news/${newsItem.id}`, {
        signal: controller.signal
      })

      if (controller.signal.aborted) return

      if (response.ok) {
        const detailData = await response.json()
        
        if (controller.signal.aborted || !isMountedRef.current) return

        NEWS_DETAIL_CACHE.set(newsItem.id, detailData)
        manageCacheSize()
        
        // ✨ 상세 데이터로 업데이트
        setSelectedNews(detailData)
      } else {
        console.error('Failed to load news detail:', response.status)
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return
      }
      console.error('Error loading news detail:', error)
    } finally {
      if (!controller.signal.aborted && isMountedRef.current) {
        setLoadingDetail(false)
      }
    }
  }, [manageCacheSize])

  const handleBack = useCallback(() => {
    setSelectedNews(null)
    setLoadingDetail(false)
  }, [])

  const handleRetry = useCallback(() => {
    window.location.reload()
  }, [])

  useEffect(() => {
    setSelectedNews(null)
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }, [searchParams.category, searchParams.search, searchParams.sort])

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const searchResultHeader = useMemo(() => {
    if (searchParams.search) return `'${searchParams.search}' 검색 결과`
    if (searchParams.category && searchParams.category !== 'all') {
      return `${searchParams.category} 소식`
    }
    return '전체 소식'
  }, [searchParams.search, searchParams.category])

  // ✨ 상세 화면 with 로딩 오버레이
  if (selectedNews) {
    return (
      <div className="relative">
        {loadingDetail && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <LoadingSpinner />
              <p className="text-sm text-gray-600">상세 정보를 불러오는 중...</p>
            </div>
          </div>
        )}
        <NewsDetail news={selectedNews} onBack={handleBack} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">뉴스를 불러오는 중 오류가 발생했습니다.</p>
        <button 
          onClick={handleRetry}
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
        >
          다시 시도
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {searchResultHeader}
        </h2>
        <p className="text-sm text-gray-500">
          총 {totalCount.toLocaleString()}개의 글
        </p>
      </div>

      {importantNews.length > 0 && (
        <div className="space-y-3">
          {importantNews.map((newsItem) => (
            <NewsCard
              key={`important-${newsItem.id}`}
              news={newsItem}
              onClick={() => handleCardClick(newsItem)}
            />
          ))}
        </div>
      )}

      <div className="space-y-3">
        {regularNews.map((newsItem) => (
          <NewsCard 
            key={`regular-${newsItem.id}`}
            news={newsItem} 
            onClick={() => handleCardClick(newsItem)}
          />
        ))}
      </div>

      {loading && (
        <div className="flex flex-col items-center gap-3 py-8">
          <LoadingSpinner />
          <p className="text-sm text-gray-600">더 많은 소식을 불러오는 중...</p>
        </div>
      )}

      <div 
        ref={targetRef} 
        className="h-4"
        style={{ visibility: hasMore ? 'visible' : 'hidden' }}
      />

      {!hasMore && uniqueNews.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          모든 뉴스를 확인했습니다.
        </div>
      )}

      {!loading && uniqueNews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            {searchParams.search 
              ? '검색 결과가 없습니다.'
              : '등록된 뉴스가 없습니다.'
            }
          </p>
          {searchParams.search && (
            <p className="text-gray-400">
              다른 키워드로 검색해보세요.
            </p>
          )}
        </div>
      )}
    </div>
  )
}