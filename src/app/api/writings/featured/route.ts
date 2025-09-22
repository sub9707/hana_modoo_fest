import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql/connection'
import { getCurrentUser } from '@/lib/mysql/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const topic = searchParams.get('topic') || 'all'
    
    // 현재 사용자 확인 (좋아요 상태 체크용)
    const currentUser = await getCurrentUser()
    
    const likesJoin = currentUser 
      ? `LEFT JOIN writing_likes wl ON w.id = wl.writing_id AND wl.user_id = '${currentUser.id}'`
      : ''
    
    const likesSelect = currentUser 
      ? ', CASE WHEN wl.id IS NOT NULL THEN true ELSE false END as is_liked'
      : ', false as is_liked'

    // 주제별 우수 작품 조회 (좋아요 순 상위 10개, 좋아요 0개는 제외)
    let topicCondition = 'WHERE w.likes_count > 0'
    const params: any[] = []
    
    if (topic !== 'all') {
      topicCondition = 'WHERE w.likes_count > 0 AND w.topic = ?'
      params.push(topic)
    }

    const writings = await query(`
      SELECT 
        w.id,
        w.topic,
        w.title,
        w.content,
        w.likes_count,
        true as is_featured,
        w.created_at,
        u.name as author_name
        ${likesSelect}
      FROM writings w
      JOIN users u ON w.user_id = u.id
      ${likesJoin}
      ${topicCondition}
      ORDER BY w.likes_count DESC, w.created_at DESC
      LIMIT 10
    `, params)

    // 각 주제별 통계
    const topicStats = await query(`
      SELECT 
        topic,
        COUNT(*) as count,
        MAX(likes_count) as max_likes
      FROM writings
      WHERE likes_count > 0
      GROUP BY topic
    `)

    return NextResponse.json({
      success: true,
      data: {
        writings,
        stats: topicStats
      }
    })
  } catch (error) {
    console.error('Error fetching featured writings:', error)
    return NextResponse.json(
      { success: false, error: '우수 작품을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}