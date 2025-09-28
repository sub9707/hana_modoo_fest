import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { query } from '@/lib/mysql/connection'

// DELETE: 사전접수 삭제
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

    // 사전접수 존재 확인
    const existingRegistration = await query(
      'SELECT id FROM registrations WHERE id = ?',
      [id]
    )

    if (existingRegistration.length === 0) {
      return NextResponse.json(
        { success: false, error: '존재하지 않는 사전접수입니다.' },
        { status: 404 }
      )
    }

    // 사전접수 삭제
    await query('DELETE FROM registrations WHERE id = ?', [id])

    return NextResponse.json({
      success: true,
      message: '사전접수가 삭제되었습니다.'
    })

  } catch (error) {
    console.error('Delete registration error:', error)
    return NextResponse.json(
      { success: false, error: '사전접수 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}