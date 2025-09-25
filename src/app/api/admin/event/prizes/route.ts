import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { query, transaction } from '@/lib/mysql/connection'
import type { ApiResponse, Prize, PrizeProbability } from '@/types/event'

// 모든 상품 조회 (관리자만)
export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      )
    }

    const prizes = await query(`
      SELECT p.*, pp.probability, pp.is_active as probability_active
      FROM prizes p
      LEFT JOIN prize_probabilities pp ON p.id = pp.prize_id
      ORDER BY p.sort_order
    `)

    return NextResponse.json<ApiResponse<Prize[]>>({
      success: true,
      data: prizes
    })
  } catch (error) {
    console.error('Get all prizes error:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: '상품 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 상품 확률 업데이트 (관리자만)
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { prize_id, probability, is_active } = body

    if (!prize_id || probability === undefined) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: '상품 ID와 확률이 필요합니다.' },
        { status: 400 }
      )
    }

    if (probability < 0 || probability > 100) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: '확률은 0-100 사이의 값이어야 합니다.' },
        { status: 400 }
      )
    }

    await transaction(async (connection) => {
      // 상품 확률 업데이트
      await connection.execute(
        `UPDATE prize_probabilities 
         SET probability = ?, is_active = ? 
         WHERE prize_id = ?`,
        [probability, is_active !== undefined ? is_active : true, prize_id]
      )

      // 총 확률 합계 확인
      const totalProbability = await connection.execute(
        `SELECT SUM(probability) as total 
         FROM prize_probabilities 
         WHERE is_active = 1`
      )

      const total = (totalProbability[0] as any)[0]?.total || 0

      if (Math.abs(total - 100) > 0.01) {
        console.warn(`확률 합계가 100%가 아닙니다: ${total}%`)
      }
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      message: '상품 확률이 업데이트되었습니다.'
    })
  } catch (error) {
    console.error('Update prize probability error:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: '확률 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}