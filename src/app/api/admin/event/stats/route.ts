import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { query } from '@/lib/mysql/connection'
import type { ApiResponse } from '@/types/event'

// 이벤트 통계 조회 (관리자만)
export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      )
    }

    // 오늘 통계
    const today = new Date().toISOString().split('T')[0]
    
    const todayStats = await query(`
      SELECT 
        COUNT(DISTINCT ep.user_id) as today_participants,
        COUNT(ew.id) as today_winners,
        COUNT(CASE WHEN p.type != 'none' THEN 1 END) as today_prize_winners
      FROM event_participations ep
      LEFT JOIN event_winners ew ON ep.id = ew.participation_id
      LEFT JOIN prizes p ON ew.prize_id = p.id
      WHERE ep.participation_date = ?
    `, [today])

    // 전체 통계
    const totalStats = await query(`
      SELECT 
        COUNT(DISTINCT ep.user_id) as total_participants,
        COUNT(ew.id) as total_winners,
        COUNT(CASE WHEN p.type != 'none' THEN 1 END) as total_prize_winners
      FROM event_participations ep
      LEFT JOIN event_winners ew ON ep.id = ew.participation_id
      LEFT JOIN prizes p ON ew.prize_id = p.id
    `)

    // 상품별 당첨 통계
    const prizeStats = await query(`
      SELECT 
        p.name,
        p.icon,
        p.color,
        p.current_quantity,
        p.initial_quantity,
        COUNT(ew.id) as winner_count,
        COALESCE(SUM(p.value), 0) as total_value
      FROM prizes p
      LEFT JOIN event_winners ew ON p.id = ew.prize_id
      WHERE p.type != 'none'
      GROUP BY p.id
      ORDER BY winner_count DESC
    `)

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        today: todayStats[0],
        total: totalStats[0],
        prizes: prizeStats
      }
    })
  } catch (error) {
    console.error('Get event stats error:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: '통계 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}