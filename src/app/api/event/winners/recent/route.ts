import { NextResponse } from 'next/server'
import { query } from '@/lib/mysql/connection'
import type { ApiResponse, RecentWinner } from '@/types/event'
import { maskKoreanName } from '@/lib/utils/privacy'

export async function GET() {
  try {
    const recentWinners = await query(
      `SELECT 
        ew.id,
        u.name as user_name,
        p.name as prize_name,
        p.icon as prize_icon,
        p.color as prize_color,
        ew.won_at
       FROM event_winners ew
       JOIN users u ON ew.user_id = u.id
       JOIN prizes p ON ew.prize_id = p.id
       WHERE p.type != 'none'
       ORDER BY ew.won_at DESC
       LIMIT 5`
    )

    const winners: RecentWinner[] = recentWinners.map((winner: any) => ({
      id: winner.id,
      masked_name: maskKoreanName(winner.user_name),
      prize_name: winner.prize_name,
      prize_icon: winner.prize_icon,
      prize_color: winner.prize_color,
      won_at: winner.won_at
    }))

    return NextResponse.json<ApiResponse<RecentWinner[]>>({
      success: true,
      data: winners
    })
  } catch (error) {
    console.error('Get recent winners error:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: '당첨자 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}