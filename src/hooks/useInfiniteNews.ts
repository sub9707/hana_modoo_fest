import { useState, useEffect, useCallback, useRef } from 'react'
import { NewsSearchParams, NewsItem } from '@/types/Board'

interface UseInfiniteNewsOptions {
  initialNews?: NewsItem[]
  initialTotalCount?: number
  initialHasMore?: boolean
  initialNextCursor?: string
}

export function useInfiniteNews(
  searchParams: NewsSearchParams,
  options?: UseInfiniteNewsOptions
) {
  const [news, setNews] = useState<NewsItem[]>(options?.initialNews || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [hasMore, setHasMore] = useState(options?.initialHasMore ?? true)
  const [cursor, setCursor] = useState<string | undefined>(options?.initialNextCursor)
  const [totalCount, setTotalCount] = useState(options?.initialTotalCount || 0)
  
  const abortControllerRef = useRef<AbortController | null>(null)
  const isLoadingRef = useRef(false)
  const isFirstMount = useRef(true)

  // 검색 조건 변경시 새로운 데이터 fetch
  useEffect(() => {
    // 첫 마운트시에는 서버에서 받은 초기 데이터 사용
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }

    const fetchNews = async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      const controller = new AbortController()
      abortControllerRef.current = controller

      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()
        if (searchParams.category && searchParams.category !== 'all') {
          params.append('category', searchParams.category)
        }
        if (searchParams.search) {
          params.append('search', searchParams.search)
        }
        if (searchParams.sort) {
          params.append('sort', searchParams.sort)
        }
        params.append('limit', String(searchParams.limit || 10))

        const response = await fetch(`/api/news?${params.toString()}`, {
          signal: controller.signal
        })

        if (!response.ok) {
          throw new Error('Failed to fetch news')
        }

        const data = await response.json()

        if (controller.signal.aborted) return

        setNews(data.news)
        setHasMore(data.hasMore)
        setCursor(data.nextCursor)
        setTotalCount(data.totalCount)
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return

        console.error('Error fetching news:', err)
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchNews()
  }, [searchParams.category, searchParams.search, searchParams.sort, searchParams.limit])

  const loadMore = useCallback(async () => {
    if (isLoadingRef.current || !hasMore) return

    isLoadingRef.current = true
    setLoading(true)
    setError(null)

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      const params = new URLSearchParams()
      if (searchParams.category && searchParams.category !== 'all') {
        params.append('category', searchParams.category)
      }
      if (searchParams.search) {
        params.append('search', searchParams.search)
      }
      if (searchParams.sort) {
        params.append('sort', searchParams.sort)
      }
      params.append('limit', String(searchParams.limit || 10))
      if (cursor) {
        params.append('cursor', cursor)
      }

      const response = await fetch(`/api/news?${params.toString()}`, {
        signal: controller.signal
      })

      if (!response.ok) {
        throw new Error('Failed to fetch news')
      }

      const data = await response.json()

      if (controller.signal.aborted) return

      setNews(prev => cursor ? [...prev, ...data.news] : data.news)
      setHasMore(data.hasMore)
      setCursor(data.nextCursor)
      setTotalCount(data.totalCount)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      
      console.error('Error fetching news:', err)
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
        isLoadingRef.current = false
      }
    }
  }, [searchParams, cursor, hasMore])

  return {
    news,
    loading,
    error,
    hasMore,
    loadMore,
    totalCount
  }
}