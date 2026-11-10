import { NextRequest, NextResponse } from 'next/server'
import { transaction } from '@/lib/mysql/connection'
import { getCurrentUser } from '@/lib/mysql/server'

// 좋아요 토글
export async function PATCH(
  request: NextRequest,
  context: { params: any }
) {
  const startTime = Date.now()

  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    const { id: commentId } = (await context.params) as { id: string }

    // 트랜잭션으로 좋아요 처리
    const result = await transaction(async (connection) => {
      // 1. 댓글 존재 확인과 현재 좋아요 상태를 한 번에 조회
      const [rows] = await connection.execute(
        `SELECT 
          sc.id, 
          sc.likes,
          scl.id as like_id 
         FROM support_comments sc
         LEFT JOIN support_comment_likes scl 
           ON sc.id = scl.comment_id AND scl.user_id = ?
         WHERE sc.id = ?`,
        [user.id, commentId]
      )

      if ((rows as any[]).length === 0) {
        throw new Error('댓글을 찾을 수 없습니다.')
      }

      const commentData = (rows as any[])[0]
      const hasLike = commentData.like_id !== null
      const isLiked = !hasLike

      if (hasLike) {
        // 좋아요 취소
        await Promise.all([
          connection.execute(
            `DELETE FROM support_comment_likes 
             WHERE comment_id = ? AND user_id = ?`,
            [commentId, user.id]
          ),
          connection.execute(
            `UPDATE support_comments 
             SET likes = likes - 1 
             WHERE id = ?`,
            [commentId]
          )
        ])
      } else {
        // 좋아요 추가
        await Promise.all([
          connection.execute(
            `INSERT INTO support_comment_likes (id, comment_id, user_id) 
             VALUES (?, ?, ?)`,
            [crypto.randomUUID(), commentId, user.id]
          ),
          connection.execute(
            `UPDATE support_comments 
             SET likes = likes + 1 
             WHERE id = ?`,
            [commentId]
          )
        ])
      }

      // 2. 업데이트된 좋아요 수 조회
      const [updatedRows] = await connection.execute(
        `SELECT likes FROM support_comments WHERE id = ?`,
        [commentId]
      )

      const finalLikes = (updatedRows as any[])[0].likes

      return {
        isLiked,
        likes: finalLikes
      }
    })

    return NextResponse.json({
      success: true,
      ...result,
      processingTime: Date.now() - startTime
    })

  } catch (error) {
    console.error(`좋아요 에러:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '좋아요 처리에 실패했습니다.' },
      { status: 500 }
    )
  }
}