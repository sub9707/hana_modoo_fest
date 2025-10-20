'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { MessageSquare, Clock } from 'lucide-react'

interface CommentFormProps {
  onCommentSubmitted: () => void
}

export default function CommentForm({ onCommentSubmitted }: CommentFormProps) {
  const { user } = useAuth()
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [remainingTime, setRemainingTime] = useState(0)

  // 종료 상태
  const EVENT_ENDED = true

  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setTimeout(() => {
        setRemainingTime(remainingTime - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [remainingTime])

  const handleSubmit = async () => {
    // 이벤트 종료시 작성 불가
    if (EVENT_ENDED) {
      setError('응원댓글 이벤트가 종료되었습니다.')
      return
    }

    if (!user) {
      setError('로그인이 필요합니다.')
      return
    }

    if (!message.trim()) {
      setError('응원 메시지를 입력해주세요.')
      return
    }

    if (message.length > 200) {
      setError('응원 메시지는 200자를 초과할 수 없습니다.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/support-comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage('')
        setRemainingTime(10)
        onCommentSubmitted()
      } else {
        setError(data.error || '댓글 작성에 실패했습니다.')
      }
    } catch (error) {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6">
      {/* 이벤트 종료 안내 */}
      {EVENT_ENDED && (
        <div className="mb-4 p-4 bg-gray-100 border border-gray-300 rounded-xl">
          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-gray-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">이벤트 종료 안내</h4>
              <p className="text-sm text-gray-600">
                응원댓글 이벤트가 종료되었습니다. 작성된 댓글은 계속 조회하실 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      )}

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={EVENT_ENDED ? "이벤트가 종료되어 댓글 작성이 불가능합니다." : "따뜻한 응원 메시지를 남겨주세요..."}
        className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        rows={4}
        maxLength={200}
        disabled={EVENT_ENDED || !user}
      />
      
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          {message.length}/200
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={EVENT_ENDED || isSubmitting || remainingTime > 0 || !message.trim() || !user}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            EVENT_ENDED || isSubmitting || remainingTime > 0 || !message.trim() || !user
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
          }`}
        >
          {EVENT_ENDED 
            ? '이벤트 종료'
            : remainingTime > 0 
              ? `${remainingTime}초 후 작성 가능`
              : isSubmitting 
                ? '작성 중...' 
                : '응원글 등록'
          }
        </button>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}