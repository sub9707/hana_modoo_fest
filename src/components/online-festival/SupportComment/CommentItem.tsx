'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface Comment {
  id: string
  message: string
  likes: number
  created_at: string
  author_name: string
  user_id: string
  isLiked?: boolean
}

interface CommentItemProps {
  comment: Comment
  onLikeToggle: (commentId: string, isLiked: boolean, newLikes: number) => void
}

function CommentItem({ comment, onLikeToggle }: CommentItemProps) {
  const { user } = useAuth()
  const [isLiking, setIsLiking] = useState(false)
  const previousStateRef = useRef<{ isLiked: boolean; likes: number } | null>(null)

  const handleLike = async () => {
    if (!user || isLiking) return

    setIsLiking(true)

    // 현재 상태 저장 (롤백용)
    previousStateRef.current = {
      isLiked: !!comment.isLiked,
      likes: comment.likes
    }


    // 낙관적 업데이트
    const optimisticIsLiked = !comment.isLiked
    const optimisticLikes = comment.likes + (optimisticIsLiked ? 1 : -1)
    
    
    onLikeToggle(comment.id, optimisticIsLiked, optimisticLikes)

    try {
      const response = await fetch(`/api/support-comments/${comment.id}/like`, {
        method: 'PATCH',
      })

      const data = await response.json()


      if (response.ok && data.success) {
        // 서버 값으로 동기화
        onLikeToggle(comment.id, data.isLiked, data.likes)
      } else {
        // 롤백
        if (previousStateRef.current) {
          onLikeToggle(
            comment.id,
            previousStateRef.current.isLiked,
            previousStateRef.current.likes
          )
        }
        
        console.error('좋아요 실패:', data.error)
        if (data.error && data.error !== '좋아요 처리에 실패했습니다.') {
          alert(data.error)
        }
      }
    } catch (error) {
      // 네트워크 에러 롤백
      if (previousStateRef.current) {
        onLikeToggle(
          comment.id,
          previousStateRef.current.isLiked,
          previousStateRef.current.likes
        )
      }
      
      console.error('네트워크 에러:', error)
      alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsLiking(false)
      previousStateRef.current = null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return '방금 전'
    if (diffMins < 60) return `${diffMins}분 전`
    if (diffHours < 24) return `${diffHours}시간 전`
    if (diffDays < 7) return `${diffDays}일 전`
    
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // 🔍 디버깅: 렌더링 시 isLiked 값 확인
  const isLikedDisplay = comment.isLiked === true

  return (
    <div className="group p-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/40 shadow-sm hover:shadow-lg hover:border-purple-200 transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-gray-900">{comment.author_name}</span>
            <span className="text-xs text-gray-400">{formatDate(comment.created_at)}</span>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap break-words leading-relaxed">
            {comment.message}
          </p>
        </div>

        <button
          onClick={handleLike}
          disabled={!user || isLiking}
          className={`
            flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 shrink-0
            ${!user ? 'opacity-50 cursor-not-allowed' : ''}
            ${isLiking ? 'scale-95 opacity-70' : ''}
            ${isLikedDisplay
              ? 'bg-pink-50 text-pink-600 hover:bg-pink-100' 
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }
          `}
          title={!user ? '로그인이 필요합니다' : ''}
        >
          <Heart 
            className={`w-5 h-5 transition-all duration-300 ${
              isLikedDisplay ? 'fill-current scale-110' : ''
            } ${isLiking ? 'animate-pulse' : ''}`}
          />
          <span className="text-xs font-semibold min-w-[2ch] text-center">
            {comment.likes}
          </span>
        </button>
      </div>
    </div>
  )
}

export default CommentItem