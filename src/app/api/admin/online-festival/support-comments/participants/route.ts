import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { query } from '@/lib/mysql/connection'

interface CommentParticipant {
  user_id: string
  name: string
  phone: string
  comment_count: number
  latest_comment_at: string
}

// GET: 응원댓글 참여자 목록 조회 (중복 제거)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''

    const offset = (page - 1) * limit

    // 검색 조건 구성
    let whereClause = 'WHERE 1=1'
    const queryParams: any[] = []

    if (search) {
      whereClause += ' AND (u.name LIKE ? OR u.phone LIKE ?)'
      queryParams.push(`%${search}%`, `%${search}%`)
    }

    // 총 개수 조회 (중복 제거된 참여자)
    const countQuery = `
      SELECT COUNT(DISTINCT sc.user_id) as total
      FROM support_comments sc
      JOIN users u ON sc.user_id = u.id
      ${whereClause}
    `
    const countResult = await query(countQuery, queryParams)
    const total = countResult[0]?.total || 0

    // 참여자 목록 조회 (중복 제거, 댓글 수와 최근 댓글 일시 포함)
    const listQuery = `
      SELECT 
        sc.user_id,
        u.name,
        u.phone,
        COUNT(sc.id) as comment_count,
        MAX(sc.created_at) as latest_comment_at
      FROM support_comments sc
      JOIN users u ON sc.user_id = u.id
      ${whereClause}
      GROUP BY sc.user_id, u.name, u.phone
      ORDER BY latest_comment_at DESC
      LIMIT ? OFFSET ?
    `
    
    const participants = await query(listQuery, [...queryParams, limit, offset])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: {
        items: participants,
        total,
        page,
        totalPages
      }
    })

  } catch (error) {
    console.error('Get support comment participants error:', error)
    return NextResponse.json(
      { success: false, error: '응원댓글 참여자 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}