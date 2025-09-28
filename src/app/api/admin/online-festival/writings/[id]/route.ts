import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { query } from '@/lib/mysql/connection'

// DELETE: 가족주제글짓기 삭제
export async function DELETE(
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

    // 글 존재 확인
    const existingWriting = await query(
      'SELECT id FROM writings WHERE id = ?',
      [id]
    )

    if (existingWriting.length === 0) {
      return NextResponse.json(
        { success: false, error: '존재하지 않는 글입니다.' },
        { status: 404 }
      )
    }

    // 관련된 좋아요 먼저 삭제
    await query('DELETE FROM writing_likes WHERE writing_id = ?', [id])

    // 글 삭제
    await query('DELETE FROM writings WHERE id = ?', [id])

    return NextResponse.json({
      success: true,
      message: '글이 삭제되었습니다.'
    })

  } catch (error) {
    console.error('Delete writing error:', error)
    return NextResponse.json(
      { success: false, error: '글 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}