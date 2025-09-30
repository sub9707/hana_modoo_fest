import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql/connection'
import { getCurrentUser } from '@/lib/mysql/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const topic = searchParams.get('topic') || 'all'
    
    // 현재 사용자 확인
    const currentUser = await getCurrentUser()
    
    // 주제별 우수 작품 조회 (좋아요 순 상위 10개, 좋아요 0개는 제외)
    let topicCondition = 'WHERE w.likes_count > 0'
    const topicParams: any[] = []
    
    if (topic !== 'all') {
      topicCondition = 'WHERE w.likes_count > 0 AND w.topic = ?'
      topicParams.push(topic)
    }

    // 🚀 서브쿼리로 is_liked 체크 (더 확실함)
    let isLikedSelect = '0 as is_liked'
    const userParams: any[] = []
    
    if (currentUser) {
      // IF 문으로 명확하게 0 또는 1 반환
      isLikedSelect = `IF(
        (SELECT COUNT(*) FROM writing_likes WHERE writing_id = w.id AND user_id = ?) > 0,
        1,
        0
      ) as is_liked`
      userParams.push(currentUser.id)
    }

    const writingsQuery = `
      SELECT 
        w.id,
        w.topic,
        w.title,
        w.content,
        w.likes_count,
        1 as is_featured,
        w.created_at,
        u.name as author_name,
        ${isLikedSelect}
      FROM writings w
      JOIN users u ON w.user_id = u.id
      ${topicCondition}
      ORDER BY w.likes_count DESC, w.created_at DESC
      LIMIT 10
    `

    // 🚀 파라미터 순서: userParams, topicParams
    const queryParams = [...userParams, ...topicParams]

    const writings = await query(writingsQuery, queryParams)

    // 🔍 디버깅: 첫 번째 글의 실제 좋아요 여부 확인
    if (writings.length > 0 && currentUser) {
      const checkLike = await query(
        `SELECT COUNT(*) as count FROM writing_likes WHERE writing_id = ? AND user_id = ?`,
        [writings[0].id, currentUser.id]
      )
    }

    // 🚀 is_liked를 명시적으로 boolean으로 변환
    const processedWritings = writings.map((writing: any) => ({
      ...writing,
      is_featured: true,
      is_liked: Number(writing.is_liked) === 1 // 문자열 "1"도 숫자 1로 변환 후 체크
    }))

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
        writings: processedWritings,
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