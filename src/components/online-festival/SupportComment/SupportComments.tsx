'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Heart, Gift } from 'lucide-react'
import RecentCommentsSlider from './RecentCommentsSlider'
import CommentForm from './CommentForm'
import CommentList from './CommentList'

interface Stats {
  totalComments: number
  totalLikes: number
}

export default function SupportComments() {
  const [stats, setStats] = useState<Stats>({ totalComments: 0, totalLikes: 0 })
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [refreshTrigger])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/support-comments/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  const handleCommentSubmitted = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="relative bg-gradient-to-br from-purple-50/50 via-pink-50/50 to-purple-100/50">
      <div className="p-1 sm:p-6 md:p-8 max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            따뜻한 응원 메시지
          </h3>
          <p className="text-gray-600 mb-3">
            서로에게 따뜻한 응원의 메시지를 전해주세요
          </p>
          
          {/* 이벤트 안내 */}
          <div className="inline-flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full border border-amber-200">
            <Gift className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-700">
              응원 댓글을 남기신 분들 가운데 추첨을 통해 100분께 선물을 드립니다
            </span>
          </div>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-2 gap-4 md:gap-6 mb-6">
          <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
            <div className="flex items-center justify-center mb-2">
              <MessageCircle className="w-5 h-5 text-purple-500 mr-2" />
              <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">
                {isLoadingStats ? '...' : stats.totalComments.toLocaleString()}
              </div>
            </div>
            <div className="text-sm md:text-base text-gray-600 font-medium">총 응원글</div>
          </div>
          
          <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
            <div className="flex items-center justify-center mb-2">
              <Heart className="w-5 h-5 text-pink-500 mr-2" />
              <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
                {isLoadingStats ? '...' : stats.totalLikes.toLocaleString()}
              </div>
            </div>
            <div className="text-sm md:text-base text-gray-600 font-medium">총 공감수</div>
          </div>
        </div>

        {/* 최근 댓글 슬라이더 */}
        <RecentCommentsSlider />

        {/* 응원글 작성 */}
        <CommentForm onCommentSubmitted={handleCommentSubmitted} />

        {/* 응원글 목록 */}
        <CommentList refreshTrigger={refreshTrigger} />
      </div>
    </div>
  )
}