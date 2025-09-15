'use client'

import { useState, useEffect, useCallback } from 'react'
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
  const [nextCursor, setNextCursor] = useState<string | undefined>()
  const [totalCount, setTotalCount] = useState(0)

  const fetchNews = useCallback(async (isLoadMore = false) => {
    try {
      setLoading(true)
      setError(null)

      const searchParams = new URLSearchParams()
      
      if (params.category) searchParams.set('category', params.category)
      if (params.search) searchParams.set('search', params.search)
      if (params.sort) searchParams.set('sort', params.sort)
      searchParams.set('limit', (params.limit || 10).toString())
      
      if (isLoadMore && nextCursor) {
        searchParams.set('cursor', nextCursor)
      }

      const response = await fetch(`/api/news?${searchParams.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch news')
      }

      const data = await response.json()

      if (isLoadMore) {
        setNews(prev => [...prev, ...data.news])
      } else {
        setNews(data.news)
        setTotalCount(data.totalCount)
      }

      setHasMore(data.hasMore)
      setNextCursor(data.nextCursor)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [params, nextCursor])

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchNews(true)
    }
  }, [fetchNews, loading, hasMore])

  const refresh = useCallback(() => {
    setNews([])
    setNextCursor(undefined)
    setHasMore(true)
    fetchNews(false)
  }, [fetchNews])

  useEffect(() => {
    refresh()
  }, [params.category, params.search, params.sort])

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