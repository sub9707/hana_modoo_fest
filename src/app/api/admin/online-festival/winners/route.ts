import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { query } from '@/lib/mysql/connection'

interface Winner {
  id: string
  user_id: string
  name: string
  phone: string
  prize_name: string
  prize_icon: string
  prize_color: string
  prize_value: number
  is_claimed: boolean
  won_at: string
  claimed_at: string | null
  notes: string | null
}

// GET: 랜덤이벤트 당첨자 목록 조회
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
    const prize = searchParams.get('prize') || ''
    const claimed = searchParams.get('claimed')

    const offset = (page - 1) * limit

    // 검색 조건 구성
    let whereClause = 'WHERE 1=1'
    const queryParams: any[] = []

    if (search) {
      whereClause += ' AND (u.name LIKE ? OR u.phone LIKE ?)'
      queryParams.push(`%${search}%`, `%${search}%`)
    }

    if (prize) {
      whereClause += ' AND p.name = ?'
      queryParams.push(prize)
    }

    if (claimed !== null && claimed !== undefined) {
      whereClause += ' AND ew.is_claimed = ?'
      queryParams.push(claimed === 'true' ? 1 : 0)
    }

    // 총 개수 조회
    const countQuery = `
      SELECT COUNT(*) as total
      FROM event_winners ew
      JOIN users u ON ew.user_id = u.id
      JOIN prizes p ON ew.prize_id = p.id
      ${whereClause}
    `
    const countResult = await query(countQuery, queryParams)
    const total = countResult[0]?.total || 0

    // 목록 조회
    const listQuery = `
      SELECT 
        ew.id,
        ew.user_id,
        u.name,
        u.phone,
        p.name as prize_name,
        p.icon as prize_icon,
        p.color as prize_color,
        p.value as prize_value,
        ew.is_claimed,
        ew.won_at,
        ew.claimed_at,
        ew.notes
      FROM event_winners ew
      JOIN users u ON ew.user_id = u.id
      JOIN prizes p ON ew.prize_id = p.id
      ${whereClause}
      ORDER BY ew.won_at DESC
      LIMIT ? OFFSET ?
    `
    
    const winners = await query(listQuery, [...queryParams, limit, offset])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: {
        items: winners,
        total,
        page,
        totalPages
      }
    })

  } catch (error) {
    console.error('Get winners error:', error)
    return NextResponse.json(
      { success: false, error: '당첨자 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}