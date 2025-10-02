import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql/connection'
import { getCurrentUser } from '@/lib/mysql/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const topic = searchParams.get('topic') || 'all'
    
    const currentUser = await getCurrentUser()
    
    // is_liked 서브쿼리
    let isLikedSelect = '0 as is_liked'
    const userParams: any[] = []
    
    if (currentUser) {
      isLikedSelect = `IF(
        (SELECT COUNT(*) FROM writing_likes WHERE writing_id = w.id AND user_id = ?) > 0,
        1,
        0
      ) as is_liked`
      userParams.push(currentUser.id)
    }

    // 각 주제별 우수작품 ID를 먼저 조회
    const featuredIdsQuery = `
      SELECT id, topic
      FROM (
        SELECT 
          id,
          topic,
          likes_count,
          ROW_NUMBER() OVER (PARTITION BY topic ORDER BY likes_count DESC, created_at DESC) as rn
        FROM writings
        WHERE likes_count >= 1
      ) ranked
      WHERE rn <= 10
    `
    
    const featuredIds = await query(featuredIdsQuery)
    
    if (featuredIds.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          writings: [],
          stats: []
        }
      })
    }

    // 주제 필터링
    let filteredIds = featuredIds
    if (topic !== 'all') {
      filteredIds = featuredIds.filter((item: any) => item.topic === topic)
    }

    if (filteredIds.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          writings: [],
          stats: []
        }
      })
    }

    const idList = filteredIds.map((item: any) => item.id)
    const placeholders = idList.map(() => '?').join(',')

    // 우수작품 상세 정보 조회
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
      WHERE w.id IN (${placeholders})
      ORDER BY w.likes_count DESC, w.created_at DESC
    `

    const writings = await query(writingsQuery, [...userParams, ...idList])

    // is_liked를 명시적으로 boolean으로 변환
    const processedWritings = writings.map((writing: any) => ({
      ...writing,
      is_featured: true,
      is_liked: Number(writing.is_liked) === 1
    }))

    // 각 주제별 통계
    const topicStats = await query(`
      SELECT 
        topic,
        COUNT(*) as count,
        MAX(likes_count) as max_likes
      FROM writings
      WHERE likes_count >= 1
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