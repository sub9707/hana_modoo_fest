// app/api/event/winners/my/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { query } from '@/lib/mysql/connection'
import type { ApiResponse } from '@/types/event'

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

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    // 해당 유저의 모든 참여 기록 조회
    const participationRecords = await query(
      `SELECT 
        ep.id,
        ep.participation_date,
        ep.participated_at,
        p.name as prize_name,
        p.icon as prize_icon,
        p.color as prize_color,
        p.description as prize_description,
        p.type as prize_type,
        ew.won_at,
        ew.id as winner_id
       FROM event_participations ep
       LEFT JOIN event_winners ew ON ep.id = ew.participation_id
       LEFT JOIN prizes p ON ew.prize_id = p.id
       WHERE ep.user_id = ?
       ORDER BY ep.participated_at DESC
       LIMIT 50`,
      [user.id]
    )

    // 통계 정보 계산
    const stats = await query(
      `SELECT 
        COUNT(ep.id) as total_participations,
        COUNT(ew.id) as total_wins,
        COUNT(CASE WHEN p.type IS NOT NULL AND p.type != 'none' THEN 1 END) as prize_wins,
        COUNT(CASE WHEN ew.id IS NULL OR p.type = 'none' THEN 1 END) as consolation_wins
       FROM event_participations ep
       LEFT JOIN event_winners ew ON ep.id = ew.participation_id
       LEFT JOIN prizes p ON ew.prize_id = p.id
       WHERE ep.user_id = ?`,
      [user.id]
    )

    // JavaScript에서 is_winner 판단 (더 안전함)
    const records: MyParticipationRecord[] = participationRecords.map((record: any) => {
      // 실제 당첨 조건: winner_id가 있고, prize_type이 'none'이 아님
      const isRealWinner = 
        record.winner_id != null && 
        record.prize_type != null && 
        record.prize_type !== 'none'

      return {
        id: record.id,
        participation_date: record.participation_date,
        participated_at: record.participated_at,
        prize_name: record.prize_name,
        prize_icon: record.prize_icon,
        prize_color: record.prize_color,
        prize_description: record.prize_description,
        prize_type: record.prize_type,
        won_at: record.won_at,
        is_winner: isRealWinner
      }
    })

    return NextResponse.json<ApiResponse<{
      records: MyParticipationRecord[]
      stats: {
        total_participations: number
        total_wins: number
        prize_wins: number
        consolation_wins: number
      }
    }>>({
      success: true,
      data: {
        records,
        stats: {
          total_participations: stats[0].total_participations,
          total_wins: stats[0].total_wins,
          prize_wins: stats[0].prize_wins,
          consolation_wins: stats[0].consolation_wins
        }
      }
    })

  } catch (error) {
    console.error('Get my participations error:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: '참여 내역 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}