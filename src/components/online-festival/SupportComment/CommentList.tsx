'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest')
  const [error, setError] = useState('')
  
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement | null>(null)

  // 댓글 목록 초기화 및 첫 페이지 로드
  const loadComments = useCallback(async (isRefresh = false) => {
    if (isLoading) return

    setIsLoading(true)
    setError('')

    try {
      const targetPage = isRefresh ? 1 : page
      const response = await fetch(
        `/api/support-comments?page=${targetPage}&limit=10&sortBy=${sortBy}`
      )

      if (!response.ok) {
        throw new Error('댓글을 불러오는데 실패했습니다.')
      }

      const data = await response.json()

      if (isRefresh) {
        setComments(data.comments)
        setPage(2)
      } else {
        setComments(prev => [...prev, ...data.comments])
        setPage(prev => prev + 1)
      }

      setHasMore(data.hasMore)
    } catch (error) {
      setError(error instanceof Error ? error.message : '댓글을 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [page, sortBy, isLoading])

  // 정렬 변경 시 댓글 목록 새로고침
  useEffect(() => {
    setComments([])
    setPage(1)
    setHasMore(true)
    loadComments(true)
  }, [sortBy])

  // 새 댓글 작성 시 목록 새로고침
  useEffect(() => {
    if (refreshTrigger > 0) {
      setComments([])
      setPage(1)
      setHasMore(true)
      loadComments(true)
    }
  }, [refreshTrigger])

  // 무한 스크롤 설정
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadComments()
        }
      },
      { threshold: 0.1 }
    )

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, isLoading, loadComments])

  // 초기 로드
  useEffect(() => {
    loadComments(true)
  }, [])

  const handleLikeToggle = (commentId: string, isLiked: boolean, newLikes: number) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? { ...comment, isLiked, likes: newLikes }
          : comment
      )
    )
  }

  const handleRefresh = () => {
    setComments([])
    setPage(1)
    setHasMore(true)
    loadComments(true)
  }

  return (
    <div>
      {/* 필터링 및 정렬 */}
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

      {/* 에러 메시지 */}
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

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onLikeToggle={handleLikeToggle}
          />
        ))}
      </div>

      {/* 로딩 인디케이터 */}
      {hasMore && (
        <div
          ref={loadingRef}
          className="flex justify-center py-8"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2 text-purple-600">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
              <span>댓글을 불러오는 중...</span>
            </div>
          ) : (
            <div className="text-gray-500">
              스크롤하여 더 많은 댓글 보기
            </div>
          )}
        </div>
      )}

      {/* 더 이상 댓글이 없을 때 */}
      {!hasMore && comments.length > 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500">모든 댓글을 불러왔습니다</div>
        </div>
      )}

      {/* 댓글이 없을 때 */}
      {!isLoading && comments.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">💭</div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            아직 응원 메시지가 없어요
          </h3>
          <p className="text-gray-500">첫 번째 응원 메시지를 남겨보세요!</p>
        </div>
      )}
    </div>
  )
}