import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { query } from '@/lib/mysql/connection'

// PATCH: 우수작품 토글
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
    const { is_featured } = await request.json()

    // 글 존재 확인
    const existingWriting = await query(
      'SELECT id, is_featured FROM writings WHERE id = ?',
      [id]
    )

    if (existingWriting.length === 0) {
      return NextResponse.json(
        { success: false, error: '존재하지 않는 글입니다.' },
        { status: 404 }
      )
    }

    // 우수작품 상태 업데이트
    await query(
      'UPDATE writings SET is_featured = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [is_featured ? 1 : 0, id]
    )

    return NextResponse.json({
      success: true,
      message: is_featured ? '우수작품으로 선정되었습니다.' : '우수작품 선정이 해제되었습니다.'
    })

  } catch (error) {
    console.error('Toggle featured writing error:', error)
    return NextResponse.json(
      { success: false, error: '우수작품 설정 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}