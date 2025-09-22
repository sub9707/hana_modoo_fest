import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql/connection'

// 댓글 통계 조회
export async function GET(request: NextRequest) {
  try {
    const stats = await query(`
      SELECT 
        COUNT(*) as total_comments,
        COALESCE(SUM(likes), 0) as total_likes
      FROM support_comments
    `)

    return NextResponse.json({
      totalComments: stats[0].total_comments,
      totalLikes: stats[0].total_likes
    })

  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: '통계를 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}