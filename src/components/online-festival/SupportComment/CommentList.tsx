'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
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
  
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement | null>(null)
  
  // 🔥 페이지는 ref로만 관리 (state 제거)
  const currentPageRef = useRef(1)
  
  // 🔥 최신 상태를 ref로 관리 (IntersectionObserver 클로저 문제 해결)
  const isLoadingRef = useRef(false)
  const hasMoreRef = useRef(true)
  const lastTriggerTimeRef = useRef(0)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  // 🔥 모바일 감지 (UA + 터치 지원 + 화면 크기)
  const isMobile = useRef(false)
  
  useEffect(() => {
    isMobile.current = 
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
      (window.innerWidth <= 768 && 'ontouchstart' in window)
  }, [])

  // 🔥 Debounced loadComments (모바일 전용)
  const loadCommentsDebounced = (isRefresh = false) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // 모바일: 400ms, 데스크톱: 200ms
    const debounceDelay = isMobile.current ? 400 : 200

    debounceTimerRef.current = setTimeout(() => {
      loadComments(isRefresh)
    }, debounceDelay)
  }

  // 댓글 목록 로드 함수
  const loadComments = async (isRefresh = false) => {
    // 중복 호출 방지
    if (isLoadingRef.current || !hasMoreRef.current) return
    
    // Throttle: 마지막 트리거로부터 일정 시간 이내면 중단
    const now = Date.now()
    const throttleDelay = isMobile.current ? 800 : 400
    
    if (!isRefresh && now - lastTriggerTimeRef.current < throttleDelay) {
      return
    }
    lastTriggerTimeRef.current = now

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

      if (isRefresh) {
        setComments(data.comments)
        currentPageRef.current = 2
      } else {
        setComments(prev => [...prev, ...data.comments])
        currentPageRef.current += 1
      }

      setHasMore(data.hasMore)
      hasMoreRef.current = data.hasMore

      // 🔥 개발 환경에서 성능 정보 (console만 사용, UI 업데이트 제거)
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
  }

  // 🔥 정렬 변경 시 - 기존 데이터 유지하면서 새로 로드 (깜빡임 방지)
  useEffect(() => {
    currentPageRef.current = 1
    hasMoreRef.current = true
    lastTriggerTimeRef.current = 0
    // setComments([]) 제거 - 기존 데이터 유지
    loadComments(true)
  }, [sortBy])

  // 새 댓글 작성 시 목록 새로고침
  useEffect(() => {
    if (refreshTrigger > 0) {
      currentPageRef.current = 1
      hasMoreRef.current = true
      lastTriggerTimeRef.current = 0
      // 새 댓글 작성 시에는 기존 데이터 초기화
      setComments([])
      loadComments(true)
    }
  }, [refreshTrigger])

  // 🔥 개선된 무한 스크롤 설정
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        
        if (entry.isIntersecting && hasMoreRef.current && !isLoadingRef.current) {
          // 모바일에서는 debounce 적용, 데스크톱은 즉시 실행
          if (isMobile.current) {
            loadCommentsDebounced()
          } else {
            loadComments()
          }
        }
      },
      {
        // 🔥 완화된 설정: 모바일 0.5, 데스크톱 0.3
        threshold: isMobile.current ? 0.5 : 0.3,
        // 🔥 모바일은 100px 전, 데스크톱은 50px 전
        rootMargin: isMobile.current ? '0px 0px -100px 0px' : '0px 0px -50px 0px'
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
  }, [])

  // 초기 로드
  useEffect(() => {
    loadComments(true)
  }, [])

  // 좋아요 토글 핸들러
  const handleLikeToggle = useCallback((commentId: string, isLiked: boolean, newLikes: number) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? { ...comment, isLiked, likes: newLikes }
          : comment
      )
    )
  }, [])

  // 🔥 새로고침 - 기존 데이터 유지하면서 로딩
  const handleRefresh = () => {
    currentPageRef.current = 1
    hasMoreRef.current = true
    lastTriggerTimeRef.current = 0
    // setComments([]) 제거 - 기존 데이터 유지
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

      {/* 더 이상 댓글이 없을 때 */}
      {!hasMore && comments.length > 0 && (
        <div className="text-center py-8 text-gray-400 text-sm">
          모든 댓글을 확인했습니다
        </div>
      )}

      {/* 댓글이 없을 때 */}
      {!hasMore && comments.length === 0 && !isLoading && !error && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">아직 응원 메시지가 없습니다</div>
          <div className="text-gray-500 text-sm">첫 번째 응원 메시지를 남겨보세요!</div>
        </div>
      )}
    </div>
  )
}