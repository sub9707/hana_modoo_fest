'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { NewsItem, NewsSearchParams } from '@/types/Board'

interface UseInfiniteNewsReturn {
  news: NewsItem[]
  loading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
  refresh: () => void
  totalCount: number
}

export function useInfiniteNews(params: NewsSearchParams): UseInfiniteNewsReturn {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  
  // 🚀 useRef로 상태 관리 (무한 루프 방지)
  const nextCursorRef = useRef<string | undefined>(null)
  const loadingRef = useRef(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const paramsRef = useRef(params)

  // 🚀 params 변경 감지를 위한 ref 업데이트
  useEffect(() => {
    paramsRef.current = params
  }, [params])

  // 🚀 컴포넌트 언마운트 시 요청 취소
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // 🚀 메모리 누수 방지 및 중복 호출 방지 fetchNews
  const fetchNews = useCallback(async (isLoadMore = false) => {
    // 🚀 중복 호출 방지
    if (loadingRef.current) {
      console.warn('Previous request still loading, skipping...')
      return
    }

    // 🚀 이전 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    loadingRef.current = true
    
    try {
      setLoading(true)
      setError(null)

      const searchParams = new URLSearchParams()
      
      // 🚀 현재 params 사용 (의존성 배열에서 제거하기 위해)
      const currentParams = paramsRef.current
      
      if (currentParams.category) searchParams.set('category', currentParams.category)
      if (currentParams.search) searchParams.set('search', currentParams.search)
      if (currentParams.sort) searchParams.set('sort', currentParams.sort)
      searchParams.set('limit', (currentParams.limit || 10).toString())
      
      // 🚀 loadMore일 때만 cursor 사용
      if (isLoadMore && nextCursorRef.current) {
        searchParams.set('cursor', nextCursorRef.current)
      }

      console.log(`🔄 Fetching news: isLoadMore=${isLoadMore}, cursor=${nextCursorRef.current}`)

      const response = await fetch(`/api/news?${searchParams.toString()}`, {
        signal: abortControllerRef.current.signal
      })
      
      // 🚀 요청이 취소된 경우 무시
      if (abortControllerRef.current.signal.aborted) {
        return
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch news')
      }

      const data = await response.json()

      // 🚀 다시 한번 취소 확인
      if (abortControllerRef.current.signal.aborted) {
        return
      }

      console.log(`✅ News fetched: ${data.news?.length || 0} items, hasMore=${data.hasMore}`)

      // 🚀 상태 업데이트 (안전하게)
      if (isLoadMore) {
        setNews(prev => {
          // 중복 방지: 기존 데이터와 새 데이터의 ID 중복 체크
          const existingIds = new Set(prev.map(item => item.id))
          const newItems = data.news.filter((item: NewsItem) => !existingIds.has(item.id))
          return [...prev, ...newItems]
        })
      } else {
        // 🚀 첫 로딩 시 기존 데이터 완전 교체
        setNews(data.news || [])
        setTotalCount(data.totalCount || 0)
      }

      setHasMore(data.hasMore || false)
      nextCursorRef.current = data.nextCursor

    } catch (err) {
      // AbortError는 무시
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('Request was aborted')
        return
      }
      
      console.error('Error fetching news:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false)
      }
      loadingRef.current = false
    }
  }, []) // 🚀 의존성 배열 완전 제거 (paramsRef 사용)

  // 🚀 loadMore 함수 (중복 호출 방지)
  const loadMore = useCallback(() => {
    if (!loadingRef.current && hasMore) {
      console.log('🔄 Loading more news...')
      fetchNews(true)
    }
  }, [fetchNews, hasMore])

  // 🚀 refresh 함수 (상태 초기화 후 새로고침)
  const refresh = useCallback(() => {
    console.log('🔄 Refreshing news list...')
    
    // 🚀 이전 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    // 🚀 상태 초기화
    setNews([])
    setTotalCount(0)
    setHasMore(true)
    setError(null)
    nextCursorRef.current = undefined
    loadingRef.current = false
    
    // 🚀 새로운 데이터 로드
    fetchNews(false)
  }, [fetchNews])

  // 🚀 검색 조건 변경 시에만 refresh (안정화된 조건)
  useEffect(() => {
    const currentParams = paramsRef.current
    console.log('📋 Search params changed:', currentParams)
    
    // 🚀 디바운싱을 위한 타이머
    const timeoutId = setTimeout(() => {
      refresh()
    }, 100) // 100ms 디바운싱

    return () => clearTimeout(timeoutId)
  }, [params.category, params.search, params.sort, refresh])

  // 🚀 개발 환경에서 디버깅 정보
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 News state:', {
        newsCount: news.length,
        loading,
        hasMore,
        totalCount,
        nextCursor: nextCursorRef.current
      })
    }
  }, [news.length, loading, hasMore, totalCount])

  return {
    news,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    totalCount
  }
}