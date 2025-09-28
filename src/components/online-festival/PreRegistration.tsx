'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Users, Calendar, MapPin, Gift, Loader2 } from 'lucide-react'

interface CampaignStats {
  preregistration_count: number
  total_participants: number
  comment_count: number
  writing_count: number
  active_campaigns: number
}

const benefits = [
  {
    icon: <Gift className="w-6 h-6" />,
    title: '사전접수 선물',
    description: '사전 접수 후 현장 참여 시 선물제공'
  }
]

const TARGET_PARTICIPANTS = 2000 // 목표 인원

export default function PreRegistration() {
  const [stats, setStats] = useState<CampaignStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // API에서 통계 데이터 가져오기
  const fetchStats = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/campaign/stats', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })

      if (!response.ok) {
        throw new Error('통계 데이터를 가져올 수 없습니다.')
      }

      const data = await response.json()
      
      if (data.success && data.data) {
        setStats(data.data)
        setError(null)
      } else {
        throw new Error(data.error || '데이터 형식이 올바르지 않습니다.')
      }
    } catch (err) {
      console.error('Stats fetch error:', err)
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
      // 에러 시 기본값 설정
      setStats({
        preregistration_count: 0,
        total_participants: 0,
        comment_count: 0,
        writing_count: 0,
        active_campaigns: 0
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    
    // 30초마다 자동 새로고침
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  // 달성률 계산
  const achievementRate = stats ? Math.round((stats.total_participants / TARGET_PARTICIPANTS) * 100) : 0
  const isAchieved = achievementRate >= 100

  // 통계 배열 생성
  const getStatsArray = () => {
    if (!stats) return []

    return [
      { 
        number: isLoading ? '...' : stats.total_participants.toLocaleString(), 
        label: '참여 인원', 
        color: 'text-festival-blue' 
      },
      { 
        number: TARGET_PARTICIPANTS.toLocaleString(), 
        label: '목표 인원', 
        color: 'text-festival-green' 
      },
      { 
        number: isLoading ? '...' : isAchieved ? '달성!' : `${achievementRate}%`, 
        label: '달성률', 
        color: isAchieved ? 'text-festival-pink' : 'text-festival-purple'
      }
    ]
  }

  return (
    <div className="p-8 md:p-12">
      {/* 헤더 섹션 */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-festival-blue/10 rounded-full mb-6">
          <span className="text-2xl">✍️</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          모두하나대축제 <br className='flex sm:hidden'/> 사전참가 신청
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto break-keep">
          10월 18일 여의도공원에서 열리는 모두하나대축제에 미리 신청하고<br />
          더 특별한 혜택을 받아보세요!
        </p>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
          <p className="text-red-600 text-sm">{error}</p>
          <button 
            onClick={fetchStats}
            className="mt-2 text-red-700 underline text-sm hover:text-red-800"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 통계 섹션 */}
      <div className="grid grid-cols-3 gap-6 mb-12">
        {getStatsArray().map((stat, index) => (
          <div key={index} className="text-center p-0 sm:p-6 bg-white/50 rounded-2xl relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            )}
            <div className={`text-xl sm:text-2xl md:text-3xl font-bold ${stat.color} mb-2 ${isLoading ? 'opacity-30' : ''}`}>
              {stat.number}
            </div>
            <div className={`text-sm md:text-base text-gray-600 ${isLoading ? 'opacity-30' : ''}`}>
              {stat.label}
            </div>
            {/* 달성 축하 효과 */}
            {isAchieved && index === 2 && !isLoading && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-festival-pink rounded-full flex items-center justify-center animate-bounce">
                <span className="text-white text-xs">🎉</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 달성 축하 메시지 */}
      {isAchieved && !isLoading && (
        <div className="mb-8 p-6 bg-gradient-to-r from-festival-pink/10 to-festival-purple/10 border-2 border-festival-pink/20 rounded-2xl text-center">
          <div className="text-2xl mb-2">🎉</div>
          <h3 className="text-xl font-bold text-festival-pink mb-2">
            목표 달성 축하합니다!
          </h3>
          <p className="text-gray-600">
            많은 분들의 관심 덕분에 목표 인원을 달성했습니다. 더욱 풍성한 축제를 준비하겠습니다!
          </p>
        </div>
      )}

      {/* 혜택 섹션 */}
      <div className="mb-12">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-8 text-center">
          사전접수 혜택
        </h3>
        <div className="flex justify-center">
          <div className="flex items-start space-x-4 p-6 bg-white/50 rounded-2xl hover:bg-white/70 transition-colors duration-300">
            <div className="flex-shrink-0 w-12 h-12 bg-festival-blue/10 rounded-full flex items-center justify-center text-festival-blue">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">사전접수 선물</h4>
              <p className="text-gray-600 text-sm">사전 접수 후 현장 참여 시 선물제공</p>
            </div>
          </div>
        </div>
      </div>

      {/* 축제 정보 카드 */}
      <div className="bg-gradient-to-br from-festival-blue/5 via-festival-purple/5 to-festival-pink/5 rounded-2xl p-8 mb-12">
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl mb-3">📅</div>
            <h4 className="font-semibold text-gray-900 mb-2">축제 날짜</h4>
            <p className="text-gray-600">2025년 10월 18일 (토)</p>
            <p className="text-gray-600">11:00 - 17:00</p>
          </div>
          <div>
            <div className="text-2xl mb-3">📍</div>
            <h4 className="font-semibold text-gray-900 mb-2">축제 장소</h4>
            <p className="text-gray-600">여의도공원</p>
            <p className="text-gray-600">문화의마당</p>
          </div>
          <div>
            <div className="text-2xl mb-3">🎪</div>
            <h4 className="font-semibold text-gray-900 mb-2">참가 대상</h4>
            <p className="text-gray-600">시민, 가족</p>
            <p className="text-gray-600">누구나 무료 참가</p>
          </div>
        </div>
      </div>

      {/* 신청 버튼 */}
      <div className="text-center">
        <Link
          href="/registration"
          className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-festival-blue to-festival-purple text-white font-semibold rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 btn-festival"
        >
          <span className="mr-2">지금 사전참가 신청하기</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="text-sm text-gray-500 mt-4">
          신청은 무료이며, 언제든지 취소 가능합니다
        </p>
      </div>

      {/* 실시간 업데이트 안내 */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400">
          참여 현황은 실시간으로 업데이트됩니다 • 마지막 업데이트: {stats ? new Date().toLocaleTimeString() : '로딩 중'}
        </p>
      </div>

      {/* 주의사항 */}
      <div className="mt-12 p-6 bg-yellow-50/80 rounded-2xl border-l-4 border-yellow-400">
        <h4 className="font-semibold text-yellow-800 mb-2">📢 안내사항</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• 사전접수는 축제 당일까지 가능합니다</li>
          <li>• 개인정보는 축제 운영 목적으로만 사용되며, 종료 후 안전하게 폐기됩니다</li>
          <li>• 기상 악화 시 축제 일정이 변경될 수 있습니다</li>
        </ul>
      </div>
    </div>
  )
}