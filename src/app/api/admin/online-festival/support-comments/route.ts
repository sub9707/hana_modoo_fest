import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { query } from '@/lib/mysql/connection'

interface SupportComment {
  id: string
  user_id: string
  name: string
  phone: string
  message: string
  likes: number
  created_at: string
}

// GET: 응원댓글 목록 조회
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
      whereClause += ' AND (u.name LIKE ? OR u.phone LIKE ? OR sc.message LIKE ?)'
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    // 총 개수 조회
    const countQuery = `
      SELECT COUNT(*) as total
      FROM support_comments sc
      JOIN users u ON sc.user_id = u.id
      ${whereClause}
    `
    const countResult = await query(countQuery, queryParams)
    const total = countResult[0]?.total || 0

    // 목록 조회
    const listQuery = `
      SELECT 
        sc.id,
        sc.user_id,
        u.name,
        u.phone,
        sc.message,
        sc.likes,
        sc.created_at
      FROM support_comments sc
      JOIN users u ON sc.user_id = u.id
      ${whereClause}
      ORDER BY sc.created_at DESC
      LIMIT ? OFFSET ?
    `
    
    const comments = await query(listQuery, [...queryParams, limit, offset])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: {
        items: comments,
        total,
        page,
        totalPages
      }
    })

  } catch (error) {
    console.error('Get support comments error:', error)
    return NextResponse.json(
      { success: false, error: '응원댓글 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}