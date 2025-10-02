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

    const offset = (page - 1) * limit

    // 우수작품 ID 목록 먼저 조회
    const featuredIdsQuery = `
      SELECT id
      FROM (
        SELECT 
          id,
          ROW_NUMBER() OVER (PARTITION BY topic ORDER BY likes_count DESC, created_at DESC) as rn
        FROM writings
        WHERE likes_count >= 1
      ) ranked
      WHERE rn <= 10
    `
    
    const featuredIdsResult = await query(featuredIdsQuery)
    const featuredIds = featuredIdsResult.map((row: any) => row.id)

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
        w.created_at
      FROM writings w
      JOIN users u ON w.user_id = u.id
      ${whereClause}
      ORDER BY w.created_at DESC
      LIMIT ? OFFSET ?
    `
    
    const writings = await query(listQuery, [...queryParams, limit, offset])

    // 우수작품 여부 판정
    const processedWritings = writings.map((w: any) => ({
      ...w,
      is_featured: featuredIds.includes(w.id)
    }))

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: {
        items: processedWritings,
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