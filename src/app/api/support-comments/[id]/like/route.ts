import { NextRequest, NextResponse } from 'next/server'
import { query, transaction } from '@/lib/mysql/connection'
import { getCurrentUser } from '@/lib/mysql/server'

// UUID 형식 검증 함수
function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

// 좋아요 토글
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const { id: commentId } = await context.params   // ✅ await 추가

    if (!isValidUUID(commentId)) {
      return NextResponse.json(
        { error: '잘못된 댓글 ID입니다.' },
        { status: 400 }
      )
    }

    // 댓글 존재 확인
    const comment = await query(
      `SELECT id FROM support_comments WHERE id = ?`,
      [commentId]
    )

    if (comment.length === 0) {
      return NextResponse.json(
        { error: '댓글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    const result = await transaction(async (connection) => {
      // 이미 좋아요 눌렀는지 확인
      const [existingLike] = await connection.execute(
        `
        SELECT id FROM support_comment_likes 
        WHERE comment_id = ? AND user_id = ?
      `,
        [commentId, user.id]
      )

      let isLiked: boolean
      let likesChange: number

      if ((existingLike as any[]).length > 0) {
        // 좋아요 취소
        await connection.execute(
          `DELETE FROM support_comment_likes WHERE comment_id = ? AND user_id = ?`,
          [commentId, user.id]
        )

        await connection.execute(
          `UPDATE support_comments SET likes = likes - 1 WHERE id = ?`,
          [commentId]
        )

        isLiked = false
        likesChange = -1
      } else {
        // 좋아요 추가
        const likeId = crypto.randomUUID()

        await connection.execute(
          `INSERT INTO support_comment_likes (id, comment_id, user_id) VALUES (?, ?, ?)`,
          [likeId, commentId, user.id]
        )

        await connection.execute(
          `UPDATE support_comments SET likes = likes + 1 WHERE id = ?`,
          [commentId]
        )

        isLiked = true
        likesChange = 1
      }

      const [updatedComment] = await connection.execute(
        `SELECT likes FROM support_comments WHERE id = ?`,
        [commentId]
      )

      return {
        isLiked,
        likes: (updatedComment as any[])[0].likes,
        likesChange,
      }
    })

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json(
      { error: '좋아요 처리에 실패했습니다.' },
      { status: 500 }
    )
  }
}
