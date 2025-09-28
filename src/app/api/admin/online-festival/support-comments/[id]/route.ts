import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { query } from '@/lib/mysql/connection'

// DELETE: 응원댓글 삭제
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

    // 응원댓글 존재 확인
    const existingComment = await query(
      'SELECT id FROM support_comments WHERE id = ?',
      [id]
    )

    if (existingComment.length === 0) {
      return NextResponse.json(
        { success: false, error: '존재하지 않는 응원댓글입니다.' },
        { status: 404 }
      )
    }

    // 관련된 좋아요 먼저 삭제
    await query('DELETE FROM support_comment_likes WHERE comment_id = ?', [id])

    // 응원댓글 삭제
    await query('DELETE FROM support_comments WHERE id = ?', [id])

    return NextResponse.json({
      success: true,
      message: '응원댓글이 삭제되었습니다.'
    })

  } catch (error) {
    console.error('Delete support comment error:', error)
    return NextResponse.json(
      { success: false, error: '응원댓글 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}