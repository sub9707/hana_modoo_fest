'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface Comment {
  id: string // UUID 형태로 변경
  message: string
  likes: number
  created_at: string
  author_name: string
  user_id: string // UUID 형태로 변경
  isLiked?: boolean
}

interface CommentItemProps {
  comment: Comment
  onLikeToggle: (commentId: string, isLiked: boolean, newLikes: number) => void
}

export default function CommentItem({ comment, onLikeToggle }: CommentItemProps) {
  const { user } = useAuth()
  const [isLiking, setIsLiking] = useState(false)

  const handleLike = async () => {
    if (!user || isLiking) return

    setIsLiking(true)

    try {
      const response = await fetch(`/api/support-comments/${comment.id}/like`, {
        method: 'PATCH',
      })

      const data = await response.json()

      if (response.ok) {
        onLikeToggle(comment.id, data.isLiked, data.likes)
      } else {
        console.error('Failed to toggle like:', data.error)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
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
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
            comment.isLiked
              ? 'bg-gradient-to-r from-pink-100 to-red-100 text-pink-600 border border-pink-200'
              : user
              ? 'bg-gray-100 text-gray-600 hover:bg-gradient-to-r hover:from-pink-50 hover:to-red-50 hover:text-pink-500 border border-gray-200 hover:border-pink-200'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-100'
          } ${isLiking ? 'animate-pulse' : ''}`}
          title={!user ? '로그인 후 좋아요를 누를 수 있습니다' : ''}
        >
          <Heart 
            className={`w-4 h-4 transition-all duration-200 ${
              comment.isLiked ? 'fill-current scale-110' : ''
            }`} 
          />
          <span className="text-sm font-medium">{comment.likes}</span>
        </button>

        {comment.user_id === user?.id && (
          <div className="px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
            <span className="text-xs font-medium text-purple-700">내가 작성</span>
          </div>
        )}
      </div>
    </div>
  )
}