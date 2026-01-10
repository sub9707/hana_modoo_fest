import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { query } from '@/lib/mysql/connection'
import type { ApiResponse } from '@/types/common'

// 상품 수량 업데이트 (관리자만)
export async function PATCH(
  request: NextRequest,
  context: { params: any }
) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { current_quantity } = body
    const { id: prizeId } = await context.params

    if (current_quantity === undefined || current_quantity < 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: '유효한 수량을 입력해주세요.' },
        { status: 400 }
      )
    }

    const result = await query(
      'UPDATE prizes SET current_quantity = ? WHERE id = ?',
      [current_quantity, prizeId]
    )

    if ((result as any).affectedRows === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: '상품을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: '상품 수량이 업데이트되었습니다.'
    })
  } catch (error) {
    console.error('Update prize quantity error:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: '수량 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}