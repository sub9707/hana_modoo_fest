import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql/connection'
import { getCurrentUser } from '@/lib/mysql/server'

// 댓글 목록 조회 (타입 변환 수정)
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sortBy') || 'latest'
    const offset = (page - 1) * limit

    const user = await getCurrentUser()
    
    // 정렬 조건
    let orderBy = 'sc.created_at DESC'
    if (sortBy === 'popular') {
      orderBy = 'sc.likes DESC, sc.created_at DESC'
    }

    // 좋아요 정보를 한 번의 쿼리로 조회
    const comments = await query(`
      SELECT 
        sc.id,
        sc.message,
        sc.likes,
        sc.created_at,
        u.name as author_name,
        u.id as user_id,
        CASE WHEN scl.id IS NOT NULL THEN 1 ELSE 0 END as isLiked
      FROM support_comments sc
      JOIN users u ON sc.user_id = u.id
      LEFT JOIN support_comment_likes scl 
        ON sc.id = scl.comment_id AND scl.user_id = ?
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `, [user?.id || null, limit, offset])

    //   문자열, 숫자 모두 처리하는 boolean 변환
    comments.forEach((comment: any) => {
      // '1', 1, true 모두 true로 변환
      // '0', 0, false, null, undefined 모두 false로 변환
      comment.isLiked = Boolean(Number(comment.isLiked))
    })

    return NextResponse.json({
      comments,
      hasMore: comments.length === limit,
      processingTime: Date.now() - startTime
    })

  } catch (error) {
    console.error('댓글 조회 에러:', error)
    return NextResponse.json(
      { error: '댓글을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// 댓글 생성
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    const { message } = await request.json()
    
    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: '메시지를 입력해주세요.' }, { status: 400 })
    }

    if (message.length > 200) {
      return NextResponse.json({ error: '메시지는 200자 이내로 입력해주세요.' }, { status: 400 })
    }

    // 속도 제한 확인
    const recentComment = await query(`
      SELECT created_at 
      FROM support_comments 
      WHERE user_id = ? 
        AND created_at > DATE_SUB(NOW(), INTERVAL 30 SECOND)
      ORDER BY created_at DESC 
      LIMIT 1
    `, [user.id])

    if (recentComment.length > 0) {
      const timeDiff = 30 - Math.floor(
        (Date.now() - new Date(recentComment[0].created_at).getTime()) / 1000
      )
      return NextResponse.json(
        { error: `${timeDiff}초 후에 다시 작성할 수 있습니다.` },
        { status: 429 }
      )
    }

    const commentId = crypto.randomUUID()
    
    // DB에 댓글 저장
    await query(`
      INSERT INTO support_comments (id, user_id, message, likes) 
      VALUES (?, ?, ?, 0)
    `, [commentId, user.id, message.trim()])

    const newComment = {
      id: commentId,
      message: message.trim(),
      likes: 0,
      created_at: new Date().toISOString(),
      author_name: user.name,
      user_id: user.id,
      isLiked: false
    }

    return NextResponse.json({
      success: true,
      comment: newComment,
      processingTime: Date.now() - startTime
    })

  } catch (error) {
    console.error('댓글 작성 에러:', error)
    return NextResponse.json(
      { error: '댓글 작성에 실패했습니다.' },
      { status: 500 }
    )
  }
}