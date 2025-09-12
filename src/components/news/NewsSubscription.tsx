'use client'

import { useState } from 'react'

export default function NewsSubscription() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail('')
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl p-6">
      <div className="text-center mb-4">
        <div className="text-2xl mb-2">📧</div>
        <h3 className="text-lg font-bold mb-2">소식 구독하기</h3>
        <p className="text-sm opacity-90">
          새로운 소식을 이메일로 받아보세요
        </p>
      </div>
      
      {isSubscribed ? (
        <div className="text-center">
          <div className="text-3xl mb-2">✅</div>
          <p className="font-medium">구독이 완료되었습니다!</p>
          <p className="text-sm opacity-90 mt-1">
            새로운 소식을 이메일로 보내드릴게요.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="이메일 주소 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-white/50 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-white text-blue-600 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            구독하기
          </button>
          <p className="text-xs opacity-75 text-center">
            언제든지 구독을 해지할 수 있습니다.
          </p>
        </form>
      )}
      
      {/* RSS 피드 */}
      <div className="mt-6 pt-4 border-t border-white/20">
        <div className="flex items-center justify-center space-x-4">
          <a
            href="/rss.xml"
            className="flex items-center space-x-2 text-sm hover:underline"
          >
            <span>📡</span>
            <span>RSS 피드</span>
          </a>
          <span className="text-white/30">|</span>
          <a
            href="/newsletter"
            className="flex items-center space-x-2 text-sm hover:underline"
          >
            <span>📰</span>
            <span>뉴스레터</span>
          </a>
        </div>
      </div>
    </div>
  )
}