import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { query } from '@/lib/mysql/connection'

// GET: 랜덤이벤트 당첨자 통계 조회
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      )
    }

    // 전체 당첨자 통계
    const overallStats = await query(`
      SELECT 
        COUNT(*) as total_winners,
        SUM(CASE WHEN ew.is_claimed = 1 THEN 1 ELSE 0 END) as claimed_count,
        SUM(CASE WHEN ew.is_claimed = 0 THEN 1 ELSE 0 END) as unclaimed_count,
        SUM(p.value) as total_value
      FROM event_winners ew
      JOIN prizes p ON ew.prize_id = p.id
    `)

    // 상품별 당첨 통계
    const prizeBreakdown = await query(`
      SELECT 
        p.name as prize_name,
        p.icon as prize_icon,
        p.color as prize_color,
        COUNT(ew.id) as count,
        p.value as value,
        SUM(p.value) as total_value
      FROM prizes p
      LEFT JOIN event_winners ew ON p.id = ew.prize_id
      WHERE p.type != 'none'
      GROUP BY p.id, p.name, p.icon, p.color, p.value
      ORDER BY count DESC
    `)

    const stats = {
      total_winners: overallStats[0]?.total_winners || 0,
      claimed_count: overallStats[0]?.claimed_count || 0,
      unclaimed_count: overallStats[0]?.unclaimed_count || 0,
      total_value: overallStats[0]?.total_value || 0,
      prize_breakdown: prizeBreakdown
    }

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Get winners stats error:', error)
    return NextResponse.json(
      { success: false, error: '당첨자 통계 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}