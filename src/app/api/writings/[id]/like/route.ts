// app/api/writings/[id]/like/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { query, transaction } from '@/lib/mysql/connection'
import { getCurrentUser } from '@/lib/mysql/server'

export async function POST(
  request: NextRequest,
  context:  { params: any } 
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const { id: writingId } = (await context.params) as { id: string }

    // 글 존재 여부 확인
    const writing = await query(
      `SELECT id, user_id FROM writings WHERE id = ?`,
      [writingId]
    )

    if (!writing.length) {
      return NextResponse.json(
        { success: false, error: '존재하지 않는 글입니다.' },
        { status: 404 }
      )
    }

    // 자신의 글에는 좋아요를 누를 수 없음
    if (writing[0].user_id === user.id) {
      return NextResponse.json(
        { success: false, error: '자신의 글에는 좋아요를 누를 수 없습니다.' },
        { status: 400 }
      )
    }

    const result = await transaction(async (connection) => {
      // 기존 좋아요 확인
      const [existingLike] = await connection.execute(
        `SELECT id FROM writing_likes WHERE user_id = ? AND writing_id = ?`,
        [user.id, writingId]
      )

      let isLiked: boolean
      let likesCount: number

      if ((existingLike as any[]).length > 0) {
        // 좋아요 취소
        await connection.execute(
          `DELETE FROM writing_likes WHERE user_id = ? AND writing_id = ?`,
          [user.id, writingId]
        )

        await connection.execute(
          `UPDATE writings SET likes_count = likes_count - 1 WHERE id = ?`,
          [writingId]
        )

        isLiked = false
      } else {
        // 좋아요 추가
        await connection.execute(
          `INSERT INTO writing_likes (user_id, writing_id) VALUES (?, ?)`,
          [user.id, writingId]
        )

        await connection.execute(
          `UPDATE writings SET likes_count = likes_count + 1 WHERE id = ?`,
          [writingId]
        )

        isLiked = true
      }

      // 업데이트된 좋아요 수 조회
      const [updatedWriting] = await connection.execute(
        `SELECT likes_count FROM writings WHERE id = ?`,
        [writingId]
      )

      likesCount = (updatedWriting as any[])[0].likes_count

      return { isLiked, likesCount }
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json(
      { success: false, error: '좋아요 처리에 실패했습니다.' },
      { status: 500 }
    )
  }
}
