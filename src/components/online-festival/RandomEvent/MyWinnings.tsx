'use client'

import { useEffect, useState } from 'react'
import { RotateCcw } from 'lucide-react'
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

  // 실제 당첨 여부: is_winner가 true이고 prize_type이 'none'이 아닌 경우
  const isRealPrizeWinner = (record: MyParticipationRecord): boolean => {
    return record.is_winner && record.prize_type !== 'none'
  }

  const stats = participationData?.stats
  const statItems = stats
    ? [
        { label: '총 참여', value: stats.total_participations },
        { label: '상품 당첨', value: stats.prize_wins },
        { label: '꽝', value: stats.consolation_wins },
      ]
    : []

  return (
    <section className="mt-12 bg-white rounded-lg border border-gray-200 p-6 md:p-8">
      <header className="flex items-center justify-between mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900">내 참여 내역</h3>
        <button
          onClick={fetchMyParticipations}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:border-orange-300 hover:text-orange-600 transition-colors disabled:opacity-50"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          새로고침
        </button>
      </header>

      {error && (
        <p className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {isLoading ? (
        <p className="py-10 text-center text-sm text-gray-500">참여 내역을 불러오는 중...</p>
      ) : participationData ? (
        <>
          {/* 통계 */}
          <dl className="grid grid-cols-3 divide-x divide-gray-200 rounded-lg border border-gray-200 mb-6">
            {statItems.map((item) => (
              <div key={item.label} className="px-4 py-5 text-center">
                <dt className="text-sm text-gray-500 mb-1">{item.label}</dt>
                <dd className="text-2xl font-bold text-gray-900 tabular-nums">
                  {item.value}
                  <span className="ml-0.5 text-base font-medium text-gray-500">회</span>
                </dd>
              </div>
            ))}
          </dl>

          {/* 참여 내역 테이블 */}
          {participationData.records.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-500">
                    <th className="px-4 py-3 font-medium">결과</th>
                    <th className="px-4 py-3 font-medium">참여일</th>
                    <th className="px-4 py-3 font-medium">참여시간</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {participationData.records.map((record) => {
                    const isPrizeWinner = isRealPrizeWinner(record)

                    return (
                      <tr key={record.id}>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          {isPrizeWinner ? (
                            <div>
                              <span className="mr-2 inline-block rounded bg-orange-50 px-1.5 py-0.5 text-xs font-semibold text-orange-700">당첨</span>
                              <span className="font-semibold text-gray-900">{record.prize_name || '상품'}</span>
                              {record.prize_description && (
                                <p className="mt-0.5 text-xs text-gray-500 truncate">{record.prize_description}</p>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500">꽝</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-gray-900 tabular-nums">
                          {formatParticipationDate(record.participation_date)}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-gray-500 tabular-nums">
                          {formatDate(record.participated_at)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="font-medium text-gray-700 mb-1">아직 참여 내역이 없습니다</p>
              <p className="text-sm text-gray-500">룰렛을 돌려서 행운의 상품을 받아보세요</p>
            </div>
          )}

          {participationData.records.length > 0 && (
            <ul className="mt-6 space-y-1 border-t border-gray-100 pt-4 text-xs text-gray-500 list-disc pl-4">
              <li>기프티콘은 가입된 전화번호로 전달됩니다</li>
              <li>상품 관련 문의는 고객센터로 연락해주세요</li>
              <li>하루 1회만 참여 가능합니다</li>
            </ul>
          )}
        </>
      ) : null}
    </section>
  )
}
