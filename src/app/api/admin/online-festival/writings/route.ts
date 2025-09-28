import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { query } from '@/lib/mysql/connection'

interface Writing {
  id: string
  user_id: string
  name: string
  phone: string
  topic: string
  title: string
  content: string
  likes_count: number
  is_featured: boolean
  created_at: string
}

// GET: 가족주제글짓기 목록 조회
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
    const topic = searchParams.get('topic') || ''
    const featured = searchParams.get('featured')

    const offset = (page - 1) * limit

    // 검색 조건 구성
    let whereClause = 'WHERE 1=1'
    const queryParams: any[] = []

    if (search) {
      whereClause += ' AND (w.title LIKE ? OR w.content LIKE ? OR u.name LIKE ?)'
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    if (topic) {
      whereClause += ' AND w.topic = ?'
      queryParams.push(topic)
    }

    if (featured !== null && featured !== undefined) {
      whereClause += ' AND w.is_featured = ?'
      queryParams.push(featured === 'true' ? 1 : 0)
    }

    // 총 개수 조회
    const countQuery = `
      SELECT COUNT(*) as total
      FROM writings w
      JOIN users u ON w.user_id = u.id
      ${whereClause}
    `
    const countResult = await query(countQuery, queryParams)
    const total = countResult[0]?.total || 0

    // 목록 조회
    const listQuery = `
      SELECT 
        w.id,
        w.user_id,
        u.name,
        u.phone,
        w.topic,
        w.title,
        w.content,
        w.likes_count,
        w.is_featured,
        w.created_at
      FROM writings w
      JOIN users u ON w.user_id = u.id
      ${whereClause}
      ORDER BY w.is_featured DESC, w.created_at DESC
      LIMIT ? OFFSET ?
    `
    
    const writings = await query(listQuery, [...queryParams, limit, offset])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: {
        items: writings,
        total,
        page,
        totalPages
      }
    })

  } catch (error) {
    console.error('Get writings error:', error)
    return NextResponse.json(
      { success: false, error: '가족주제글짓기 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}