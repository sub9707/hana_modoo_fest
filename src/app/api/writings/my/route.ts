import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql/connection'
import { getCurrentUser } from '@/lib/mysql/server'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    const offset = (page - 1) * limit

    // 내 글 목록 조회
    const writings = await query(`
      SELECT 
        w.id,
        w.topic,
        w.title,
        w.content,
        w.likes_count,
        CASE 
          WHEN w.id IN (
            SELECT id FROM (
              SELECT id, ROW_NUMBER() OVER (ORDER BY likes_count DESC, created_at DESC) as rn
              FROM writings 
              WHERE likes_count > 0
            ) ranked 
            WHERE rn <= 10
          ) THEN true 
          ELSE false 
        END as is_featured,
        w.created_at,
        u.name as author_name,
        true as is_mine
      FROM writings w
      JOIN users u ON w.user_id = u.id
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC
      LIMIT ? OFFSET ?
    `, [user.id, limit, offset])

    // 총 개수 조회
    const totalCountResult = await query(`
      SELECT COUNT(*) as total
      FROM writings
      WHERE user_id = ?
    `, [user.id])

    const totalCount = totalCountResult[0]?.total || 0
    const hasMore = (page * limit) < totalCount

    return NextResponse.json({
      success: true,
      data: {
        writings,
        pagination: {
          page,
          limit,
          totalCount,
          hasMore,
          totalPages: Math.ceil(totalCount / limit)
        }
      }
    })
  } catch (error) {
    console.error('Error fetching my writings:', error)
    return NextResponse.json(
      { success: false, error: '내 글 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}