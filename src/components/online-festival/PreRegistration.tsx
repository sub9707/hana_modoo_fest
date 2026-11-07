'use client'

import { useState, useEffect } from 'react'
import { Users, Calendar, MapPin, Gift, Loader2, CheckCircle, PartyPopper } from 'lucide-react'
import HeroCTAButton from '@/components/home/HeroCTAButton'
import FestivalTabHeader from './FestivalTabHeader'

interface CampaignStats {
  preregistration_count: number
  total_participants: number
  comment_count: number
  writing_count: number
  active_campaigns: number
}

const TARGET_PARTICIPANTS = 2000 // 목표 인원

// 혜택 카드 컴포넌트
interface BenefitCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  showShadow?: boolean
}

const BenefitCard = ({ icon: Icon, title, description, showShadow = true }: BenefitCardProps) => (
  <div className={`flex items-start space-x-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl hover:bg-white/90 transition-all duration-300 ${showShadow ? 'shadow-lg hover:shadow-xl' : ''}`}>
    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
      <Icon className="w-6 h-6 text-blue-600" />
    </div>
    <div>
      <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </div>
)

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
        gradient: 'bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent'
      },
      {
        number: TARGET_PARTICIPANTS.toLocaleString(),
        label: '목표 인원',
        gradient: 'bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent'
      },
      {
        number: isLoading ? '...' : isAchieved ? '달성!' : `${achievementRate}%`,
        label: '달성률',
        gradient: isAchieved
          ? 'bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent'
          : 'bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent'
      }
    ]
  }

  return (
    <div className="p-8 md:p-12">
      {/* 헤더 섹션 */}
      <FestivalTabHeader
        title={<>모두하나대축제 <br className='flex sm:hidden'/> 사전참가 신청</>}
        description={
          <p className="text-lg text-gray-600 max-w-2xl mx-auto break-keep">
            10월 18일 여의도공원에서 열리는 모두하나대축제에 미리 신청하고<br />
            더 특별한 혜택을 받아보세요!
          </p>
        }
        titleColorVariant="default"
        className="mb-12"
      />

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
          <div key={index} className="text-center p-0 sm:p-6 bg-white/80 backdrop-blur-sm rounded-2xl relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            )}
            <div className={`text-xl sm:text-2xl md:text-3xl font-bold ${stat.gradient} mb-2 ${isLoading ? 'opacity-30' : ''}`}>
              {stat.number}
            </div>
            <div className={`text-sm md:text-base text-gray-600 ${isLoading ? 'opacity-30' : ''}`}>
              {stat.label}
            </div>
            {/* 달성 축하 효과 */}
            {isAchieved && index === 2 && !isLoading && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-festival-pink rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 달성 축하 메시지 */}
      {isAchieved && !isLoading && (
        <div className="mb-8 p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl text-center shadow-lg">
          <PartyPopper className="w-12 h-12 text-pink-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-pink-600 mb-2">
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
          <BenefitCard
            icon={Gift}
            title="사전접수 선물"
            description="사전 접수 후 현장 참여 시 선물제공"
            showShadow={false}
          />
        </div>
      </div>

      {/* 축제 정보 카드 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-12 shadow-lg">
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">축제 날짜</h4>
            <p className="text-gray-600">2025년 10월 18일 (토)</p>
            <p className="text-gray-600">11:00 - 17:00</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">축제 장소</h4>
            <p className="text-gray-600">여의도공원</p>
            <p className="text-gray-600">문화의마당</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">참가 대상</h4>
            <p className="text-gray-600">시민, 가족</p>
            <p className="text-gray-600">누구나 무료 참가</p>
          </div>
        </div>
      </div>

      {/* 신청 버튼 */}
      <div className="text-center">
        <div className="max-w-md mx-auto">
          <HeroCTAButton
            text="사전참가 신청하기"
            href="/registration"
          />
        </div>
        <p className="text-sm text-gray-500 mt-4">
          신청은 무료이며, 언제든지 취소 가능합니다
        </p>
      </div>

      {/* 주의사항 */}
      <div className="mt-12 rounded-lg border border-gray-200 bg-gray-50 px-6 py-5">
        <h4 className="font-bold text-gray-900 mb-2">안내사항</h4>
        <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
          <li>사전접수는 10월 17일(금) 17시까지 가능합니다</li>
          <li>개인정보는 축제 운영 목적으로만 사용되며, 종료 후 안전하게 폐기됩니다</li>
          <li>기상 악화 시 축제 일정이 변경될 수 있습니다</li>
        </ul>
      </div>
    </div>
  )
}