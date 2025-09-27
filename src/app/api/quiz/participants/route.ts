// src/app/api/quiz/participants/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql/connection'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const search = searchParams.get('search')
    const offset = (page - 1) * limit

    // 검색 조건 구성
    let whereClause = ''
    let queryParams: any[] = []

    if (search && search.trim()) {
      whereClause = 'WHERE (u.name LIKE ? OR u.username LIKE ?)'
      const searchTerm = `%${search.trim()}%`
      queryParams.push(searchTerm, searchTerm)
    }

    // 전체 참여자 수 조회
    const totalCountQuery = `
      SELECT COUNT(*) as total 
      FROM quiz_event_participants qep
      JOIN users u ON qep.user_id = u.id
      ${whereClause}
    `
    const totalCountResult = await query(totalCountQuery, queryParams)
    const totalCount = totalCountResult[0]?.total || 0

    // 참여자 목록 조회 (사용자 정보와 조인)
    const participantsQuery = `
      SELECT 
        qep.id,
        qep.user_id,
        u.name,
        u.username,
        u.company,
        u.phone,
        qep.quiz_version,
        qep.perfect_score,
        qep.total_questions,
        qep.correct_answers,
        qep.completion_time,
        qep.ip_address,
        qep.participated_at,
        qep.created_at
      FROM quiz_event_participants qep
      JOIN users u ON qep.user_id = u.id
      ${whereClause}
      ORDER BY qep.participated_at DESC
      LIMIT ? OFFSET ?
    `

    const participants = await query(participantsQuery, [...queryParams, limit, offset])

    return NextResponse.json({
      success: true,
      data: {
        participants,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNext: offset + limit < totalCount,
          hasPrev: page > 1
        }
      }
    })

  } catch (error) {
    console.error('참여자 목록 조회 오류:', error)
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}