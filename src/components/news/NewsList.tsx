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
}

// 🚀 뉴스 상세 정보 캐시 (메모리 효율적)
const NEWS_DETAIL_CACHE = new Map<string, NewsItem>()
const CACHE_MAX_SIZE = 20 // 최대 20개 상세 정보 캐시

export default function NewsList({ searchParams }: NewsListProps) {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  
  // 🚀 AbortController로 메모리 누수 방지
  const abortControllerRef = useRef<AbortController | null>(null)
  const isMountedRef = useRef(true)

  const {
    news,
    loading,
    error,
    hasMore,
    loadMore,
    totalCount
  } = useInfiniteNews(searchParams)

  // 🚀 중복 제거된 뉴스 목록 (useMemo로 성능 최적화)
  const uniqueNews = useMemo(() => {
    const seen = new Set<string>()
    return news.filter(item => {
      if (seen.has(item.id)) {
        return false // 🚀 중복 제거
      }
      seen.add(item.id)
      return true
    })
  }, [news])

  // 🚀 메모이제이션된 뉴스 분류 (중요/일반)
  const { importantNews, regularNews } = useMemo(() => {
    const important = uniqueNews.filter(item => item.important)
    const regular = uniqueNews.filter(item => !item.important)
    return { importantNews: important, regularNews: regular }
  }, [uniqueNews])

  // 🚀 무한 스크롤 설정 (메모이제이션)
  const intersectionConfig = useMemo(() => ({
    onIntersect: loadMore,
    enabled: !loading && hasMore && !selectedNews // 상세 화면에서는 비활성화
  }), [loadMore, loading, hasMore, selectedNews])

  const { targetRef } = useIntersectionObserver(intersectionConfig)

  // 🚀 캐시 관리 함수
  const manageCacheSize = useCallback(() => {
    if (NEWS_DETAIL_CACHE.size > CACHE_MAX_SIZE) {
      const firstKey = NEWS_DETAIL_CACHE.keys().next().value
      if (firstKey) {
        NEWS_DETAIL_CACHE.delete(firstKey)
      }
    }
  }, [])

  // 🚀 최적화된 뉴스 카드 클릭 핸들러 (캐싱 + AbortController)
  const handleCardClick = useCallback(async (newsItem: NewsItem) => {
    if (!isMountedRef.current) return

    // 캐시에서 먼저 확인
    const cachedDetail = NEWS_DETAIL_CACHE.get(newsItem.id)
    if (cachedDetail) {
      setSelectedNews(cachedDetail)
      return
    }

    // 이전 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    setLoadingDetail(true)
    
    try {
      const response = await fetch(`/api/news/${newsItem.id}`, {
        signal: controller.signal
      })

      if (controller.signal.aborted) return

      if (response.ok) {
        const detailData = await response.json()
        
        if (controller.signal.aborted || !isMountedRef.current) return

        // 캐시에 저장
        NEWS_DETAIL_CACHE.set(newsItem.id, detailData)
        manageCacheSize()
        
        setSelectedNews(detailData)
      } else {
        console.error('Failed to load news detail:', response.status)
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return // 정상적인 취소
      }
      console.error('Error loading news detail:', error)
    } finally {
      if (!controller.signal.aborted && isMountedRef.current) {
        setLoadingDetail(false)
      }
    }
  }, [manageCacheSize])

  // 🚀 뒤로가기 핸들러 (메모이제이션)
  const handleBack = useCallback(() => {
    setSelectedNews(null)
  }, [])

  // 🚀 에러 핸들러 (메모이제이션)
  const handleRetry = useCallback(() => {
    window.location.reload()
  }, [])

  // 🚀 검색 조건 변경 시 상세 화면 초기화 (최적화)
  useEffect(() => {
    setSelectedNews(null)
    // 진행 중인 API 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }, [searchParams.category, searchParams.search, searchParams.sort])

  // 🚀 컴포넌트 언마운트 시 정리
  useEffect(() => {
    isMountedRef.current = true
    
    return () => {
      isMountedRef.current = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // 🚀 검색 결과 헤더 메모이제이션
  const searchResultHeader = useMemo(() => {
    if (searchParams.search) {
      return `'${searchParams.search}' 검색 결과`
    }
    if (searchParams.category && searchParams.category !== 'all') {
      return `${searchParams.category} 소식`
    }
    return '전체 소식'
  }, [searchParams.search, searchParams.category])

  // 🚀 상세 화면 렌더링 (메모이제이션된 컴포넌트)
  if (selectedNews) {
    return <NewsDetail news={selectedNews} onBack={handleBack} />
  }

  // 🚀 에러 상태 (메모이제이션된 JSX)
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">뉴스를 불러오는 중 오류가 발생했습니다.</p>
        <button 
          onClick={handleRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          다시 시도
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 🚀 검색 결과 정보 (메모이제이션) */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          {searchResultHeader}
        </h2>
        <p className="text-gray-600">
          총 {totalCount.toLocaleString()}개의 글
        </p>
      </div>

      {/* 🚀 중요 공지 섹션 (최적화된 렌더링) */}
      {importantNews.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
          <div className="font-semibold text-red-800 mb-4 flex items-center">
            📢 중요 공지
          </div>
          <div className="space-y-4">
            {importantNews.map((newsItem) => (
              <div key={`important-${newsItem.id}`} className="bg-white rounded-lg p-4">
                <NewsCard 
                  news={newsItem} 
                  onClick={() => handleCardClick(newsItem)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🚀 일반 뉴스 리스트 (최적화된 key 사용) */}
      <div className="space-y-4">
        {regularNews.map((newsItem) => (
          <NewsCard 
            key={`regular-${newsItem.id}`} // ✅ 올바른 key 사용
            news={newsItem} 
            onClick={() => handleCardClick(newsItem)}
          />
        ))}
      </div>

      {/* 🚀 목록 로딩 상태 */}
      {loading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}

      {/* 🚀 무한스크롤 트리거 (성능 최적화) */}
      <div 
        ref={targetRef} 
        className="h-4"
        style={{ visibility: hasMore ? 'visible' : 'hidden' }}
      />

      {/* 🚀 더 이상 로드할 뉴스가 없을 때 */}
      {!hasMore && uniqueNews.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          모든 뉴스를 확인했습니다.
        </div>
      )}

      {/* 🚀 뉴스가 없을 때 (메모이제이션된 메시지) */}
      {!loading && uniqueNews.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📰</div>
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

      {/* 🚀 개발 환경에서 캐시 상태 표시 */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs">
          캐시: {NEWS_DETAIL_CACHE.size}/{CACHE_MAX_SIZE}
        </div>
      )}
    </div>
  )
}