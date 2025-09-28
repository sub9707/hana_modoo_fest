import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { query } from '@/lib/mysql/connection'

// DELETE: 퀴즈 참여자 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      )
    }

    const { id } = params

    // 퀴즈 참여자 존재 확인
    const existingParticipant = await query(
      'SELECT id FROM quiz_event_participants WHERE id = ?',
      [id]
    )

    if (existingParticipant.length === 0) {
      return NextResponse.json(
        { success: false, error: '존재하지 않는 퀴즈 참여자입니다.' },
        { status: 404 }
      )
    }

    // 퀴즈 참여자 삭제
    await query('DELETE FROM quiz_event_participants WHERE id = ?', [id])

    return NextResponse.json({
      success: true,
      message: '퀴즈 참여자가 삭제되었습니다.'
    })

  } catch (error) {
    console.error('Delete quiz participant error:', error)
    return NextResponse.json(
      { success: false, error: '퀴즈 참여자 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}