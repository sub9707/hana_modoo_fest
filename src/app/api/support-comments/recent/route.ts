import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql/connection'

// 최근 댓글 조회 (슬라이더용)
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '5')
    
    const recentComments = await query(`
      SELECT 
        sc.id,
        sc.message,
        sc.likes,
        sc.created_at,
        u.name as author_name
      FROM support_comments sc
      JOIN users u ON sc.user_id = u.id
      ORDER BY sc.created_at DESC
      LIMIT ?
    `, [limit])

    return NextResponse.json({ 
      comments: recentComments,
      processingTime: Date.now() - startTime
    })

  } catch (error) {
    console.error('최근 댓글 조회 에러:', error)
    return NextResponse.json(
      { error: '최근 댓글을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}