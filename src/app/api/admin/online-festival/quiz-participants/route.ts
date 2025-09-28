import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { query } from '@/lib/mysql/connection'

interface QuizParticipant {
  id: string
  user_id: string
  name: string
  phone: string
  quiz_version: string
  perfect_score: boolean
  total_questions: number
  correct_answers: number
  completion_time: number
  participated_at: string
}

// GET: 퀴즈 참여자 목록 조회
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
    const quizVersion = searchParams.get('quiz_version') || ''
    const perfectOnly = searchParams.get('perfect_only') === 'true'

    const offset = (page - 1) * limit

    // 검색 조건 구성
    let whereClause = 'WHERE 1=1'
    const queryParams: any[] = []

    if (search) {
      whereClause += ' AND (u.name LIKE ? OR u.phone LIKE ?)'
      queryParams.push(`%${search}%`, `%${search}%`)
    }

    if (quizVersion) {
      whereClause += ' AND qep.quiz_version = ?'
      queryParams.push(quizVersion)
    }

    if (perfectOnly) {
      whereClause += ' AND qep.perfect_score = 1'
    }

    // 총 개수 조회
    const countQuery = `
      SELECT COUNT(*) as total
      FROM quiz_event_participants qep
      JOIN users u ON qep.user_id = u.id
      ${whereClause}
    `
    const countResult = await query(countQuery, queryParams)
    const total = countResult[0]?.total || 0

    // 목록 조회
    const listQuery = `
      SELECT 
        qep.id,
        qep.user_id,
        u.name,
        u.phone,
        qep.quiz_version,
        qep.perfect_score,
        qep.total_questions,
        qep.correct_answers,
        qep.completion_time,
        qep.participated_at
      FROM quiz_event_participants qep
      JOIN users u ON qep.user_id = u.id
      ${whereClause}
      ORDER BY qep.participated_at DESC
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
    console.error('Get quiz participants error:', error)
    return NextResponse.json(
      { success: false, error: '퀴즈 참여자 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}