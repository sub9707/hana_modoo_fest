'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { RefreshCw } from 'lucide-react'
import CommentItem from './CommentItem'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

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

type SortBy = 'latest' | 'popular'

const PAGE_SIZE = 10

export default function CommentList({ refreshTrigger }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [totalCount, setTotalCount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [sortBy, setSortBy] = useState<SortBy>('latest')
  const [error, setError] = useState('')

  // 다음에 요청할 페이지. 렌더와 무관하므로 ref 로 둔다.
  const nextPageRef = useRef(1)
  // 정렬 변경/새로고침 시 이전 요청 응답을 무시하기 위한 요청 번호
  const requestIdRef = useRef(0)
  const isLoadingRef = useRef(false)

  const fetchPage = useCallback(async (reset: boolean) => {
    if (!reset && isLoadingRef.current) return

    const requestId = ++requestIdRef.current
    const page = reset ? 1 : nextPageRef.current

    isLoadingRef.current = true
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(
        `/api/support-comments?page=${page}&limit=${PAGE_SIZE}&sortBy=${sortBy}`
      )
      if (!response.ok) throw new Error('댓글을 불러오는데 실패했습니다.')

      const data = await response.json()
      if (requestId !== requestIdRef.current) return // 더 최신 요청이 있음

      const incoming: Comment[] = data.comments ?? []
      setComments(prev => {
        if (reset) return incoming
        // 그 사이 새 댓글이 추가돼 OFFSET 이 밀린 경우의 중복 방지
        const seen = new Set(prev.map(c => c.id))
        return [...prev, ...incoming.filter(c => !seen.has(c.id))]
      })
      setTotalCount(typeof data.totalCount === 'number' ? data.totalCount : null)
      setHasMore(Boolean(data.hasMore))
      nextPageRef.current = page + 1
    } catch (err) {
      if (requestId !== requestIdRef.current) return
      setError(err instanceof Error ? err.message : '댓글을 불러오는데 실패했습니다.')
      setHasMore(false)
    } finally {
      if (requestId === requestIdRef.current) {
        isLoadingRef.current = false
        setIsLoading(false)
      }
    }
  }, [sortBy])

  // 최초 로드 + 정렬 변경 + 외부 새로고침(새 댓글 작성 등)
  useEffect(() => {
    nextPageRef.current = 1
    setHasMore(true)
    fetchPage(true)
  }, [fetchPage, refreshTrigger])

  const loadMore = useCallback(() => fetchPage(false), [fetchPage])
  const handleRefresh = useCallback(() => fetchPage(true), [fetchPage])

  const sentinelRef = useInfiniteScroll({
    hasMore: hasMore && !error,
    isLoading,
    onLoadMore: loadMore,
  })

  const handleLikeToggle = useCallback((commentId: string, isLiked: boolean, newLikes: number) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId ? { ...comment, isLiked, likes: newLikes } : comment
      )
    )
  }, [])

  return (
    <section>
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-gray-200 pb-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">응원 메시지 목록</h3>
          <p className="mt-0.5 text-sm text-gray-500">
            총 <span className="font-semibold text-gray-900 tabular-nums">
              {totalCount === null ? '-' : totalCount.toLocaleString()}
            </span>개의 응원 메시지
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:border-orange-300 hover:text-orange-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            새로고침
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            aria-label="정렬"
            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
          >
            <option value="latest">최신순</option>
            <option value="popular">인기순</option>
          </select>
        </div>
      </header>

      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
          <button onClick={handleRefresh} className="ml-2 underline hover:no-underline">
            다시 시도
          </button>
        </div>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} onLikeToggle={handleLikeToggle} />
        ))}
      </div>

      {/* 무한 스크롤 감지용 */}
      {hasMore && !error && <div ref={sentinelRef} aria-hidden="true" className="h-px" />}

      {isLoading && (
        <p className="py-8 text-center text-sm text-gray-500">불러오는 중...</p>
      )}

      {!hasMore && !isLoading && comments.length > 0 && (
        <p className="py-8 text-center text-sm text-gray-400">모든 응원 메시지를 확인했습니다</p>
      )}

      {!hasMore && !isLoading && comments.length === 0 && !error && (
        <div className="py-12 text-center">
          <p className="font-medium text-gray-700 mb-1">아직 응원 메시지가 없습니다</p>
          <p className="text-sm text-gray-500">첫 번째 응원 메시지를 남겨보세요</p>
        </div>
      )}
    </section>
  )
}
