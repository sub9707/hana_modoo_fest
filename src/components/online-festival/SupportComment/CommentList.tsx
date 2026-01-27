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
  const lastLoadTimeRef = useRef(0)
  
  const scrollPositionRef = useRef<{
    scrollTop: number
    scrollHeight: number
  } | null>(null)

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

  const loadComments = useCallback(async (isRefresh = false) => {
    if (isLoadingRef.current || (!isRefresh && !hasMoreRef.current)) return
    
    // 최소 간격 체크 (500ms)
    const now = Date.now()
    if (!isRefresh && now - lastLoadTimeRef.current < 500) {
      return
    }
    lastLoadTimeRef.current = now

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

    } catch (error) {
      setError(error instanceof Error ? error.message : '댓글을 불러오는데 실패했습니다.')
    } finally {
      isLoadingRef.current = false
      setIsLoading(false)
    }
  }, [sortBy, saveScrollPosition, restoreScrollPosition])

  // 정렬 변경시 초기화
  useEffect(() => {
    currentPageRef.current = 1
    hasMoreRef.current = true
    lastLoadTimeRef.current = 0
    loadComments(true)
  }, [sortBy, loadComments])

  // 새로고침 트리거
  useEffect(() => {
    if (refreshTrigger > 0) {
      currentPageRef.current = 1
      hasMoreRef.current = true
      lastLoadTimeRef.current = 0
      setComments([])
      loadComments(true)
    }
  }, [refreshTrigger, loadComments])

  // IntersectionObserver 설정
  useEffect(() => {
    // 더 불러올 게 없으면 observer 필요 없음
    if (!hasMore) {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      return
    }

    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]

        if (entry.isIntersecting && hasMoreRef.current && !isLoadingRef.current) {
          loadComments()
        }
      },
      {
        // 요소가 조금이라도 보이면 트리거 (0) + 여유 있게 (0.1)
        threshold: [0, 0.1],
        // 하단 200px 전에 미리 로딩 시작 (더 여유있게)
        rootMargin: '0px 0px 200px 0px'
      }
    )

    // ref 연결 대기 후 observe
    const timer = setTimeout(() => {
      if (loadingRef.current && observerRef.current) {
        observerRef.current.observe(loadingRef.current)
      }
    }, 100)

    return () => {
      clearTimeout(timer)
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [loadComments, hasMore])

  // 초기 로드
  useEffect(() => {
    loadComments(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 스크롤 이벤트 백업 (IntersectionObserver 실패 대비)
  useEffect(() => {
    if (!hasMore) return

    const handleScroll = () => {
      // 이미 로딩 중이면 무시
      if (isLoadingRef.current || !hasMoreRef.current) return

      // 페이지 하단에서 300px 이내면 로딩
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      if (scrollTop + windowHeight >= documentHeight - 300) {
        loadComments()
      }
    }

    // throttle 적용
    let ticking = false
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', throttledScroll)
    }
  }, [hasMore, loadComments])

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
    lastLoadTimeRef.current = 0
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