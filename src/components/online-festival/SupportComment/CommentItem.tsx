'use client'

import React, { useState } from 'react'
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

  const handleLike = async () => {
    if (!user || isLiking) return

    // 🚀 즉시 UI 업데이트 (낙관적 업데이트)
    const newIsLiked = !comment.isLiked
    const newLikes = comment.likes + (newIsLiked ? 1 : -1)
    
    // UI를 즉시 업데이트
    onLikeToggle(comment.id, newIsLiked, newLikes)
    setIsLiking(true)

    try {
      const response = await fetch(`/api/support-comments/${comment.id}/like`, {
        method: 'PATCH',
      })

      const data = await response.json()

      if (response.ok) {
        // 서버 응답과 동기화 (이미 낙관적으로 업데이트했으므로 차이가 있을 때만)
        if (data.isLiked !== newIsLiked || data.likes !== newLikes) {
          onLikeToggle(comment.id, data.isLiked, data.likes)
        }
        
        // 🔥 개발 환경에서 console.log만 사용 (UI 업데이트 제거)
        if (process.env.NODE_ENV === 'development' && data.processingTime) {
          console.log(`좋아요 처리: ${data.processingTime}ms`)
        }
        
      } else {
        // 에러 시 원래 상태로 복원
        onLikeToggle(comment.id, !!comment.isLiked, comment.likes)
        console.error('Failed to toggle like:', data.error)
        
        // 사용자에게 에러 메시지 표시 (선택사항)
        if (data.error && data.error !== '좋아요 처리에 실패했습니다.') {
          alert(data.error)
        }
      }
    } catch (error) {
      // 네트워크 에러 시 원래 상태로 복원
      onLikeToggle(comment.id, !!comment.isLiked, comment.likes)
      console.error('Error toggling like:', error)
      
      // 네트워크 에러 메시지
      alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsLiking(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return `${diffInMinutes}분 전`
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`
    } else {
      return date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-md p-6 hover:bg-white/80 transition-all duration-200 group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
            {comment.author_name[0]}
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              {comment.author_name}
            </div>
            <div className="text-sm text-gray-500">
              {formatDate(comment.created_at)}
            </div>
          </div>
        </div>
      </div>

      <p className="text-gray-700 mb-4 leading-relaxed">
        {comment.message}
      </p>

      <div className="flex items-center justify-between">
        <button
          onClick={handleLike}
          disabled={!user || isLiking}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 transform ${
            comment.isLiked
              ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg scale-105'
              : 'bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-pink-600 hover:scale-105'
          } ${
            isLiking 
              ? 'opacity-75 cursor-not-allowed' 
              : user 
                ? 'cursor-pointer hover:shadow-md active:scale-95' 
                : 'cursor-not-allowed opacity-50'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Heart 
            className={`w-4 h-4 transition-all duration-200 ${
              comment.isLiked ? 'fill-current' : ''
            } ${isLiking ? 'animate-pulse' : ''}`} 
          />
          <span className="font-medium">
            {comment.likes.toLocaleString()}
          </span>
          {isLiking && <span className="text-xs">처리중...</span>}
        </button>

        {!user && (
          <div className="text-xs text-gray-400">
            로그인 후 좋아요를 누를 수 있습니다
          </div>
        )}
      </div>
    </div>
  )
}

export default React.memo(CommentItem)