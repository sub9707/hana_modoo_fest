import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { query } from '@/lib/mysql/connection'

// GET: 룰렛 이벤트 참여 통계 조회
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      )
    }

    // 전체 참여 통계
    const overallStats = await query(`
      SELECT 
        COUNT(DISTINCT ep.id) as total_participations,
        COUNT(DISTINCT ep.user_id) as unique_participants,
        COUNT(DISTINCT ew.id) as total_winners,
        COUNT(DISTINCT CASE 
          WHEN p.type IS NOT NULL AND p.type != 'none' 
          THEN ew.id 
        END) as prize_winners,
        COUNT(DISTINCT CASE 
          WHEN p.type = 'none' OR ew.id IS NULL
          THEN ep.id 
        END) as consolation_count
      FROM event_participations ep
      LEFT JOIN event_winners ew ON ep.id = ew.participation_id
      LEFT JOIN prizes p ON ew.prize_id = p.id
    `)

    // 일별 참여 통계 (최근 7일)
    const dailyStats = await query(`
      SELECT 
        ep.participation_date,
        COUNT(DISTINCT ep.id) as participations,
        COUNT(DISTINCT CASE 
          WHEN p.type IS NOT NULL AND p.type != 'none' 
          THEN ew.id 
        END) as winners
      FROM event_participations ep
      LEFT JOIN event_winners ew ON ep.id = ew.participation_id
      LEFT JOIN prizes p ON ew.prize_id = p.id
      WHERE ep.participation_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY ep.participation_date
      ORDER BY ep.participation_date DESC
    `)

    const stats = {
      total_participations: overallStats[0]?.total_participations || 0,
      unique_participants: overallStats[0]?.unique_participants || 0,
      total_winners: overallStats[0]?.total_winners || 0,
      prize_winners: overallStats[0]?.prize_winners || 0,
      consolation_count: overallStats[0]?.consolation_count || 0,
      daily_stats: dailyStats
    }

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Get roulette stats error:', error)
    return NextResponse.json(
      { success: false, error: '통계 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}