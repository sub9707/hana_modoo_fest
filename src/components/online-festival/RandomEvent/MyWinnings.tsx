// components/MyWinnings.tsx
'use client'

import { useEffect, useState } from 'react'
import { Trophy, Calendar, Gift, TrendingUp, RotateCcw, Dices, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface MyParticipationRecord {
  id: string
  participation_date: string
  participated_at: string
  prize_name: string | null
  prize_icon: string | null
  prize_color: string | null
  prize_description: string | null
  prize_type: string | null
  won_at: string | null
  is_winner: boolean
}

interface ParticipationData {
  records: MyParticipationRecord[]
  stats: {
    total_participations: number
    total_wins: number
    prize_wins: number
    consolation_wins: number
  }
}

export default function MyWinnings() {
  const { user } = useAuth()
  const [participationData, setParticipationData] = useState<ParticipationData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMyParticipations = async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/event/winners/my', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })

      const data = await response.json()

      if (data.success && data.data) {
        setParticipationData(data.data)
      } else {
        setError(data.error || '참여 내역을 불러오지 못했습니다.')
      }
    } catch (error) {
      console.error('Failed to fetch participations:', error)
      setError('참여 내역 조회 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchMyParticipations()
    }
  }, [user])

  // 로그인하지 않은 경우 아무것도 렌더링하지 않음
  if (!user) {
    return null
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatParticipationDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    })
  }

  // 결과 표시 함수 - prize_type으로 정확하게 판단
    const getResultDisplay = (record: MyParticipationRecord) => {
      // 실제 당첨 여부: is_winner가 true이고 prize_type이 'none'이 아닌 경우
      const isRealWinner = record.is_winner && record.prize_type !== 'none'
      console.log(record)
    
    // 꽝인 경우 (prize_type이 'none'이거나 is_winner가 false)
    if (!isRealWinner) {
      return {
        icon: <X className="w-6 h-6" />,
        name: '아쉬워요',
        description: '다음 기회에 도전하세요',
        color: '#9CA3AF'
      }
    }

    // 실제 상품 당첨인 경우
    return {
      icon: record.prize_icon ? record.prize_icon : <Gift className="w-6 h-6" />,
      name: record.prize_name || '상품',
      description: record.prize_description || '',
      color: record.prize_color || '#F59E0B'
    }
  }

  // 실제 당첨 여부 확인 헬퍼 함수
  const isRealPrizeWinner = (record: MyParticipationRecord): boolean => {
    return record.is_winner && record.prize_type !== 'none'
  }

  return (
    <div className="mt-12 bg-white/80 rounded-3xl p-8 border border-white/20 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center">
          <RotateCcw className="w-6 h-6 mr-3 text-festival-orange" />
          내 참여 내역
        </h3>
        <button
          onClick={fetchMyParticipations}
          disabled={isLoading}
          className="inline-flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-festival-orange transition-colors disabled:opacity-50"
        >
          <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>새로고침</span>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-xl">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2 text-gray-500">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-festival-orange"></div>
            <span>참여 내역을 불러오는 중...</span>
          </div>
        </div>
      ) : participationData ? (
        <>
          {/* 통계 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">총 참여</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {participationData.stats.total_participations}회
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Gift className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-800">상품 당첨</span>
              </div>
              <div className="text-2xl font-bold text-green-900">
                {participationData.stats.prize_wins}회
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="w-5 h-5 text-orange-600 mr-2" />
                <span className="text-sm font-medium text-orange-800">꽝</span>
              </div>
              <div className="text-2xl font-bold text-orange-900">
                {participationData.stats.consolation_wins}회
              </div>
            </div>
          </div>

          {/* 참여 내역 테이블 */}
          {participationData.records.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="bg-white/60 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50/80">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          결과
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          참여일
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          참여시간
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/50">
                      {participationData.records.map((record) => {
                        const result = getResultDisplay(record)
                        const isPrizeWinner = isRealPrizeWinner(record)
                        
                        return (
                          <tr key={record.id} className="hover:bg-white/40 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-4">
                                <div 
                                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                                  style={{ backgroundColor: `${result.color}20` }}
                                >
                                  {result.icon}
                                </div>
                                <div className="min-w-0">
                                  <div className={`font-semibold ${isPrizeWinner ? 'text-green-700' : 'text-gray-600'}`}>
                                    {result.name}
                                  </div>
                                  <div className="text-sm text-gray-600 truncate">
                                    {result.description}
                                  </div>
                                  {isPrizeWinner && (
                                    <div className="text-xs text-green-600 font-medium mt-1">
                                      당첨
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {formatParticipationDate(record.participation_date)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">
                                {formatDate(record.participated_at)}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Dices className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <div className="text-lg font-medium text-gray-700 mb-2">
                아직 참여 내역이 없습니다
              </div>
              <div className="text-gray-500">
                룰렛을 돌려서 행운의 상품을 받아보세요
              </div>
            </div>
          )}

          {/* 안내 메시지 */}
          {participationData.records.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50/60 rounded-2xl">
              <div className="flex items-start space-x-3">
                <div className="text-blue-500 mt-0.5">ℹ️</div>
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">참여 내역 안내</p>
                  <ul className="space-y-1 text-blue-600">
                    <li>• 기프티콘은 가입된 전화번호로 전달됩니다</li>
                    <li>• 상품 관련 문의는 고객센터로 연락해주세요</li>
                    <li>• 하루 1회만 참여 가능합니다</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  )
}