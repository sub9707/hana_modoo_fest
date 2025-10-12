import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { query } from '@/lib/mysql/connection'

interface Registration {
  id: string
  user_id: string
  name: string
  phone: string
  registration_number: string
  participant_type: string
  companions: number
  companion_details: string | null
  address: string
  address_detail: string | null
  zip_code: string
  special_requests: string | null
  marketing_consent: boolean
  privacy_consent: boolean
  status: string
  created_at: string
}

// GET: 사전접수 목록 조회
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
    const program = searchParams.get('program') || ''

    const offset = (page - 1) * limit

    // 검색 조건 구성
    let whereClause = 'WHERE 1=1'
    const queryParams: any[] = []

    if (search) {
      whereClause += ' AND (u.name LIKE ? OR u.phone LIKE ?)'
      queryParams.push(`%${search}%`, `%${search}%`)
    }

    if (program) {
      whereClause += ' AND r.participant_type = ?'
      queryParams.push(program)
    }

    // 총 개수 조회
    const countQuery = `
      SELECT COUNT(*) as total
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      ${whereClause}
    `
    const countResult = await query(countQuery, queryParams)
    const total = countResult[0]?.total || 0

    // 총 참가예정인원 계산 (신청자 + 동행자)
    const totalParticipantsQuery = `
      SELECT SUM(r.companions + 1) as totalParticipants
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      ${whereClause}
    `
    const totalParticipantsResult = await query(totalParticipantsQuery, queryParams)
    const totalParticipants = totalParticipantsResult[0]?.totalParticipants || 0

    // 목록 조회
    const listQuery = `
      SELECT 
        r.id,
        r.user_id,
        u.name,
        u.phone,
        r.registration_number,
        r.participant_type,
        r.companions,
        r.companion_details,
        r.address,
        r.address_detail,
        r.zip_code,
        r.special_requests,
        r.marketing_consent,
        r.privacy_consent,
        r.status,
        r.created_at
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      ${whereClause}
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `
    
    const registrations = await query(listQuery, [...queryParams, limit, offset])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: {
        items: registrations,
        total,
        totalParticipants,
        page,
        totalPages
      }
    })

  } catch (error) {
    console.error('Get registrations error:', error)
    return NextResponse.json(
      { success: false, error: '사전접수 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}