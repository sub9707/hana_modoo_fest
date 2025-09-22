'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Heart } from 'lucide-react'

interface RecentComment {
  id: string // UUID 형태로 변경
  message: string
  likes: number
  author_name: string
  created_at: string
}

export default function RecentCommentsSlider() {
  const [comments, setComments] = useState<RecentComment[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRecentComments()
  }, [])

  useEffect(() => {
    if (comments.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % comments.length)
      }, 3000) // 3초마다 변경

      return () => clearInterval(interval)
    }
  }, [comments.length])

  const fetchRecentComments = async () => {
    try {
      const response = await fetch('/api/support-comments/recent?limit=5')
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments)
      }
    } catch (error) {
      console.error('Error fetching recent comments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-center h-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </div>
    )
  }

  if (comments.length === 0) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-center h-20">
          <div className="text-center">
            <MessageCircle className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-gray-600">아직 응원 메시지가 없습니다</p>
          </div>
        </div>
      </div>
    )
  }

  const currentComment = comments[currentIndex]

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 relative overflow-hidden">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">
            {currentComment.author_name[0]}
          </span>
        </div>
        <div>
          <div className="font-semibold text-gray-900">
            {currentComment.author_name}
          </div>
          <div className="text-sm text-gray-500">
            {new Date(currentComment.created_at).toLocaleDateString('ko-KR')}
          </div>
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed mb-4 min-h-[3rem]">
        {currentComment.message}
      </p>

      <div className="flex items-center justify-end">

        <div className="flex space-x-1">
          {comments.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex
                  ? 'bg-purple-500'
                  : 'bg-purple-200 hover:bg-purple-300'
              }`}
              aria-label={`${index + 1}번째 댓글 보기`}
            />
          ))}
        </div>
      </div>

      {/* 배경 장식 */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full transform translate-x-8 -translate-y-8"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full transform -translate-x-6 translate-y-6"></div>
    </div>
  )
}