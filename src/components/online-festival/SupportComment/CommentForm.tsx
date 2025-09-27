'use client'

import { useState, useEffect } from 'react'

export default function CommentForm({ onCommentSubmitted }: { onCommentSubmitted: () => void }) {
  const [message, setMessage] = useState('')
  const [remainingTime, setRemainingTime] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // 1. 페이지 로드 시 localStorage에서 쿨타임 확인 (즉시 표시)
  useEffect(() => {
    const checkLocalCooltime = () => {
      const lastCommentTime = localStorage.getItem('lastCommentTime')
      if (lastCommentTime) {
        const elapsed = Math.floor((Date.now() - parseInt(lastCommentTime)) / 1000)
        const remaining = Math.max(0, 30 - elapsed)
        setRemainingTime(remaining)
      }
    }

    checkLocalCooltime()
  }, [])

  // 2. 쿨타임 타이머
  useEffect(() => {
    if (remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime(prev => {
          const newTime = prev - 1
          if (newTime <= 0) {
            localStorage.removeItem('lastCommentTime')
            return 0
          }
          return newTime
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [remainingTime])

  // 3. 댓글 제출 (서버에서 최종 검증)
  const handleSubmit = async () => {
    if (!message.trim() || isSubmitting || remainingTime > 0) return

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/support-comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim() })
      })

      const data = await response.json()

      if (response.ok) {
        // 성공: localStorage에 시간 저장 + 쿨타임 시작
        localStorage.setItem('lastCommentTime', Date.now().toString())
        setRemainingTime(30)
        setMessage('')
        onCommentSubmitted()
      } else {
        // 실패: 서버 쿨타임 에러 처리
        if (response.status === 429) {
          // 서버에서 정확한 남은 시간을 알려줌
          const match = data.error.match(/(\d+)초/)
          if (match) {
            const serverRemainingTime = parseInt(match[1])
            setRemainingTime(serverRemainingTime)
            // localStorage도 서버 시간에 맞춰 업데이트
            const serverLastCommentTime = Date.now() - (30 - serverRemainingTime) * 1000
            localStorage.setItem('lastCommentTime', serverLastCommentTime.toString())
          }
        }
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
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="따뜻한 응원 메시지를 남겨주세요..."
        className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
        rows={4}
        maxLength={200}
      />
      
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          {message.length}/200
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || remainingTime > 0 || !message.trim()}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            isSubmitting || remainingTime > 0 || !message.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
          }`}
        >
          {remainingTime > 0 
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