'use client'

import { memo, useEffect, useState } from 'react'
import { CheckCircle, Gift, Calendar, Clock, Trophy, Sparkles, RefreshCw } from 'lucide-react'

interface User {
  id: string
  name: string
  username: string
}

interface ParticipationData {
  participatedAt: string
  completionTime: number
  totalQuestions: number
  correctAnswers: number
}

interface ParticipationCompletedProps {
  user: User
}

export const ParticipationCompleted = memo(({ user }: ParticipationCompletedProps) => {
  const [participationData, setParticipationData] = useState<ParticipationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchParticipationData()
  }, [user.id])

  const fetchParticipationData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/quiz/participation-data?userId=${user.id}`)
      const result = await response.json()
      
      if (result.success) {
        setParticipationData(result.data)
      } else {
        setError('참여 정보를 불러올 수 없습니다.')
      }
    } catch (error) {
      console.error('참여 정보 조회 실패:', error)
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}분 ${remainingSeconds}초`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 md:p-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">참여 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 md:p-12 relative">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
          퀴즈 이벤트 참여 완료!
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          {user.name}님, 퀴즈 이벤트에 이미 참여하셨습니다!
        </p>
        <p className="text-sm text-gray-500">
          추첨 결과는 추후 공지사항을 통해 안내드릴 예정입니다.
        </p>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-2xl mx-auto space-y-6">
        {/* 참여 완료 상태 */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-3xl p-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-yellow-800" />
              </div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            만점 달성 및 이벤트 참여 완료!
          </h2>
          
          <div className="space-y-2 text-green-700 flex items-center justify-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <div>
              <p className="font-medium">모든 문제를 정답으로 맞히셨습니다!</p>
              <p className="text-sm">추첨 대상자로 등록되었습니다.</p>
            </div>
          </div>
        </div>

        {/* 참여 정보 */}
        {participationData && !error && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">참여 정보</h3>
              <button
                onClick={fetchParticipationData}
                disabled={isLoading}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                title="새로고침"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center mb-2">
                  <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-800">참여 일시</span>
                </div>
                <p className="text-blue-700 text-sm">
                  {formatDate(participationData.participatedAt)}
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-xl">
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="font-medium text-purple-800">완료 시간</span>
                </div>
                <p className="text-purple-700 text-sm">
                  {formatTime(participationData.completionTime)}
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-xl">
                <div className="flex items-center mb-2">
                  <Trophy className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-800">정답 수</span>
                </div>
                <p className="text-green-700 text-sm">
                  {participationData.correctAnswers}/{participationData.totalQuestions} 
                  <span className="ml-1 font-bold">(100%)</span>
                </p>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-xl">
                <div className="flex items-center mb-2">
                  <Gift className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="font-medium text-yellow-800">추첨 자격</span>
                </div>
                <p className="text-yellow-700 text-sm font-bold">
                    획득 완료
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 오류 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 text-center">{error}</p>
            <button
              onClick={fetchParticipationData}
              className="mt-2 w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* 이벤트 안내 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center flex items-center justify-center">
            <Gift className="w-6 h-6 mr-2 text-orange-500" />
            이벤트 안내
          </h3>
          <div className="space-y-3 text-gray-700 text-sm flex flex-col justify-center items-center">
            <InfoItem text="추첨을 통해 총 100명에게 경품을 제공합니다" />
            <InfoItem text="추첨 결과는 축제 종료 후 공지사항을 통해 발표됩니다" />
            <InfoItem text="당첨자에게는 개별 연락을 통해 경품을 전달합니다" />
            <InfoItem text="한 번 참여하면 중복 참여는 불가능합니다" />
          </div>
        </div>
      </div>
    </div>
  )
})

// 재사용 가능한 정보 아이템 컴포넌트
const InfoItem = ({ text }: { text: string }) => (
  <div className="flex items-start space-x-3">
    <CheckCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
    <span>{text}</span>
  </div>
)