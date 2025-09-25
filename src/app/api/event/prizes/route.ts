import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql/connection'
import type { ApiResponse, PrizeWithProbability } from '@/types/event'

export async function GET() {
  try {
    const prizes = await query(
      `SELECT p.*, pp.probability 
       FROM prizes p
       JOIN prize_probabilities pp ON p.id = pp.prize_id
       WHERE p.is_active = 1 AND pp.is_active = 1 AND p.current_quantity > 0
       ORDER BY p.sort_order`
    ) as PrizeWithProbability[]

    return NextResponse.json<ApiResponse<PrizeWithProbability[]>>({
      success: true,
      data: prizes.map(prize => ({
        ...prize,
        probability: parseFloat(prize.probability.toString())
      }))
    })
  } catch (error) {
    console.error('Get prizes error:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: '상품 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}