// src/components/online-festival/SupportComment/SupportComments.tsx
'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Heart, Gift } from 'lucide-react'
import RecentCommentsSlider from './RecentCommentsSlider'
import CommentForm from './CommentForm'
import CommentList from './CommentList'
import FestivalTabHeader from '../FestivalTabHeader'

interface Stats {
  totalComments: number
  totalLikes: number
  processingTime?: number
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
      console.error('통계 로딩 실패:', error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  const handleCommentSubmitted = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* 헤더 */}
        <FestivalTabHeader
          title="온라인 축제 응원하기"
          description="여러분의 따뜻한 응원 메시지를 남겨주세요"
          titleColorVariant="purple-pink"
        />

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 gap-4">
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