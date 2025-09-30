'use client'

import { useState, useEffect, useRef, useCallback, useTransition } from 'react'
import { flushSync } from 'react-dom'
import { Filter, RefreshCw } from 'lucide-react'
import CommentItem from './CommentItem'

interface Comment {
  id: string
  message: string
  likes: number
  created_at: string
  author_name: string
  user_id: string
  isLiked?: boolean
}

interface CommentListProps {
  refreshTrigger: number
}

export default function CommentList({ refreshTrigger }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  
  const currentPageRef = useRef(1)
  const isLoadingRef = useRef(false)
  const hasMoreRef = useRef(true)
  const lastTriggerTimeRef = useRef(0)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  const scrollPositionRef = useRef<{
    scrollTop: number
    scrollHeight: number
  } | null>(null)
  
  const isMobile = useRef(false)
  
  useEffect(() => {
    isMobile.current = 
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
      (window.innerWidth <= 768 && 'ontouchstart' in window)
  }, [])

  const saveScrollPosition = useCallback(() => {
    if (containerRef.current) {
      scrollPositionRef.current = {
        scrollTop: window.scrollY,
        scrollHeight: document.documentElement.scrollHeight
      }
    }
  }, [])

  const restoreScrollPosition = useCallback(() => {
    if (scrollPositionRef.current && containerRef.current) {
      const currentScrollHeight = document.documentElement.scrollHeight
      const heightDiff = currentScrollHeight - scrollPositionRef.current.scrollHeight
      
      if (heightDiff > 0) {
        window.scrollTo({
          top: scrollPositionRef.current.scrollTop + heightDiff,
          behavior: 'instant'
        })
      }
      
      scrollPositionRef.current = null
    }
  }, [])

  // 로딩 완료 후 자동 다음 페이지 체크
  const checkAndLoadMore = useCallback(() => {
    if (!loadingRef.current || !hasMoreRef.current || isLoadingRef.current) {
      return
    }

    // loadingRef가 화면에 보이는지 확인
    const rect = loadingRef.current.getBoundingClientRect()
    const windowHeight = window.innerHeight || document.documentElement.clientHeight
    const isVisible = rect.top < windowHeight && rect.bottom > 0

    if (isVisible) {
      // 화면에 보이면 다음 페이지 로드
      if (isMobile.current) {
        loadCommentsDebounced()
      } else {
        loadComments()
      }
    }
  }, [])

  const loadCommentsDebounced = useCallback((isRefresh = false) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    const debounceDelay = isMobile.current ? 300 : 100

    debounceTimerRef.current = setTimeout(() => {
      loadComments(isRefresh)
    }, debounceDelay)
  }, [])

  const loadComments = useCallback(async (isRefresh = false) => {
    if (isLoadingRef.current || (!isRefresh && !hasMoreRef.current)) return
    
    const now = Date.now()
    const throttleDelay = isMobile.current ? 600 : 300
    
    if (!isRefresh && now - lastTriggerTimeRef.current < throttleDelay) {
      return
    }
    lastTriggerTimeRef.current = now

    if (!isRefresh) {
      saveScrollPosition()
    }

    isLoadingRef.current = true
    setIsLoading(true)
    setError('')

    try {
      const targetPage = isRefresh ? 1 : currentPageRef.current
      const response = await fetch(
        `/api/support-comments?page=${targetPage}&limit=10&sortBy=${sortBy}`
      )

      if (!response.ok) {
        throw new Error('댓글을 불러오는데 실패했습니다.')
      }

      const data = await response.json()

      flushSync(() => {
        if (isRefresh) {
          setComments(data.comments)
          currentPageRef.current = 2
        } else {
          startTransition(() => {
            setComments(prev => [...prev, ...data.comments])
          })
          currentPageRef.current += 1
        }

        setHasMore(data.hasMore)
        hasMoreRef.current = data.hasMore
      })

      if (!isRefresh) {
        requestAnimationFrame(() => {
          restoreScrollPosition()
        })
      }

      if (process.env.NODE_ENV === 'development') {
        console.log(
          `댓글 로딩: ${data.processingTime || 'N/A'}ms`,
          data.fromCache ? '(캐시)' : '(DB)',
          `| 페이지: ${targetPage}`
        )
      }

      // 로딩 완료 후 loadingRef가 여전히 화면에 보이면 다음 페이지 자동 로드
      requestAnimationFrame(() => {
        checkAndLoadMore()
      })

    } catch (error) {
      setError(error instanceof Error ? error.message : '댓글을 불러오는데 실패했습니다.')
    } finally {
      isLoadingRef.current = false
      setIsLoading(false)
    }
  }, [sortBy, saveScrollPosition, restoreScrollPosition, checkAndLoadMore])

  useEffect(() => {
    currentPageRef.current = 1
    hasMoreRef.current = true
    lastTriggerTimeRef.current = 0
    loadComments(true)
  }, [sortBy, loadComments])

  useEffect(() => {
    if (refreshTrigger > 0) {
      currentPageRef.current = 1
      hasMoreRef.current = true
      lastTriggerTimeRef.current = 0
      setComments([])
      loadComments(true)
    }
  }, [refreshTrigger, loadComments])

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        
        if (entry.isIntersecting && hasMoreRef.current && !isLoadingRef.current) {
          if (isMobile.current) {
            loadCommentsDebounced()
          } else {
            loadComments()
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: isMobile.current ? '0px 0px 400px 0px' : '0px 0px 300px 0px'
      }
    )

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [loadComments, loadCommentsDebounced])

  useEffect(() => {
    loadComments(true)
  }, [])

  const handleLikeToggle = useCallback((commentId: string, isLiked: boolean, newLikes: number) => {
    startTransition(() => {
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? { ...comment, isLiked, likes: newLikes }
            : comment
        )
      )
    })
  }, [])

  const handleRefresh = useCallback(() => {
    currentPageRef.current = 1
    hasMoreRef.current = true
    lastTriggerTimeRef.current = 0
    loadComments(true)
  }, [loadComments])

  return (
    <div ref={containerRef}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">
            응원 메시지 목록
          </h3>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-purple-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>새로고침</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular')}
            className="px-3 py-2 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
          >
            <option value="latest">최신순</option>
            <option value="popular">인기순</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-2 text-sm text-red-700 underline hover:no-underline"
          >
            다시 시도
          </button>
        </div>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onLikeToggle={handleLikeToggle}
          />
        ))}
      </div>

      {hasMore && (
        <div
          ref={loadingRef}
          className="flex justify-center py-8"
          style={{ minHeight: '80px' }}
        >
          {isLoading || isPending ? (
            <div className="flex items-center space-x-2 text-gray-500">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>로딩 중...</span>
            </div>
          ) : (
            <div className="text-gray-400 text-sm">
              스크롤하여 더 많은 댓글 보기
            </div>
          )}
        </div>
      )}

      {!hasMore && comments.length > 0 && (
        <div className="text-center py-8 text-gray-400 text-sm">
          모든 댓글을 확인했습니다
        </div>
      )}

      {!hasMore && comments.length === 0 && !isLoading && !error && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">아직 응원 메시지가 없습니다</div>
          <div className="text-gray-500 text-sm">첫 번째 응원 메시지를 남겨보세요</div>
        </div>
      )}
    </div>
  )
}