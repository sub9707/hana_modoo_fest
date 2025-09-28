import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { query } from '@/lib/mysql/connection'

// PATCH: 당첨자 수령 상태 토글
export async function PATCH(
  request: NextRequest,
   { params }: { params: any }
) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      )
    }

    const { id } = (await params) as { id: string }
    const { is_claimed, notes } = await request.json()

    // 당첨자 존재 확인
    const existingWinner = await query(
      'SELECT id, is_claimed FROM event_winners WHERE id = ?',
      [id]
    )

    if (existingWinner.length === 0) {
      return NextResponse.json(
        { success: false, error: '존재하지 않는 당첨자입니다.' },
        { status: 404 }
      )
    }

    // 수령 상태 업데이트
    const updateFields = ['is_claimed = ?']
    const updateValues = [is_claimed ? 1 : 0]

    if (is_claimed) {
      updateFields.push('claimed_at = CURRENT_TIMESTAMP')
    } else {
      updateFields.push('claimed_at = NULL')
    }

    if (notes !== undefined) {
      updateFields.push('notes = ?')
      updateValues.push(notes)
    }

    updateValues.push(Number(id))

    await query(
      `UPDATE event_winners SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    )

    return NextResponse.json({
      success: true,
      message: is_claimed ? '수령 완료로 변경되었습니다.' : '수령 대기로 변경되었습니다.'
    })

  } catch (error) {
    console.error('Toggle winner claim error:', error)
    return NextResponse.json(
      { success: false, error: '수령 상태 변경 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}