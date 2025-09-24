'use client'

import { useState, useEffect } from 'react'
import { Send, Lock, Clock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface CommentFormProps {
  onCommentSubmitted: () => void
}

export default function CommentForm({ onCommentSubmitted }: CommentFormProps) {
  const { user } = useAuth()
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [remainingTime])

  const handleSubmit = async () => {
    if (!user) {
      setError('로그인이 필요합니다.')
      return
    }

    if (!message.trim()) {
      setError('메시지를 입력해주세요.')
      return
    }

    if (message.length > 200) {
      setError('메시지는 200자 이내로 입력해주세요.')
      return
    }

    if (remainingTime > 0) {
      setError(`${remainingTime}초 후에 다시 작성할 수 있습니다.`)
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/support-comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('')
        setRemainingTime(30) // 30초 제한 시작
        onCommentSubmitted()
        setError('')
      } else {
        setError(data.error || '댓글 작성에 실패했습니다.')

        // 429 에러 (Too Many Requests)인 경우 남은 시간 파싱
        if (response.status === 429 && data.error) {
          const timeMatch = data.error.match(/(\d+)초/)
          if (timeMatch) {
            setRemainingTime(parseInt(timeMatch[1]))
          }
        }
      }
    } catch (error) {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey && !isSubmitting) {
      handleSubmit()
    }
  }

  const isDisabled = isSubmitting || remainingTime > 0 || !user
  const buttonText = !user
    ? '로그인 후 이용하세요'
    : remainingTime > 0
      ? `${remainingTime}초 후 작성 가능`
      : isSubmitting
        ? '작성 중...'
        : '응원글 등록'

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">응원 메시지 남기기</h3>
      </div>

      {!user && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Lock className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-amber-700 leading-relaxed">
              응원 메시지를 남기려면 로그인이 필요합니다.
            </span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <textarea
          placeholder={user ? "따뜻한 응원 메시지를 남겨주세요..." : "로그인 후 응원 메시지를 남겨보세요"}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={!user}
          className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white transition-all resize-none disabled:bg-gray-50 disabled:text-gray-500 text-sm sm:text-base"
          rows={4}
          maxLength={200}
        />

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
          <div className="flex items-center justify-between sm:justify-start sm:space-x-4">
            <span className="text-sm text-gray-500">
              {message.length}/200
            </span>
            {remainingTime > 0 && (
              <div className="flex items-center space-x-1 text-amber-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {remainingTime}초 후 작성 가능
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isDisabled || !message.trim()}
            className={`flex items-center justify-center space-x-2 w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold rounded-xl transition-all ${isDisabled || !message.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl active:scale-95 sm:hover:scale-105'
              }`}
          >
            {!user ? (
              <Lock className="w-4 h-4" />
            ) : remainingTime > 0 ? (
              <Clock className="w-4 h-4" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{buttonText}</span>
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 leading-relaxed">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}