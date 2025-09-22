import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql/connection'
import { getCurrentUser } from '@/lib/mysql/server'

// 댓글 목록 조회 (무한스크롤)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sortBy') || 'latest' // latest, popular
    const offset = (page - 1) * limit

    let orderBy = 'sc.created_at DESC'
    if (sortBy === 'popular') {
      orderBy = 'sc.likes DESC, sc.created_at DESC'
    }

    const comments = await query(`
      SELECT 
        sc.id,
        sc.message,
        sc.likes,
        sc.created_at,
        u.name as author_name,
        u.id as user_id
      FROM support_comments sc
      JOIN users u ON sc.user_id = u.id
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `, [limit, offset])

    // 현재 사용자의 좋아요 정보 확인
    const user = await getCurrentUser()
    if (user && comments.length > 0) {
      const commentIds = comments.map((c: any) => c.id)
      const placeholders = commentIds.map(() => '?').join(',')
      
      const likedComments = await query(`
        SELECT comment_id FROM support_comment_likes 
        WHERE user_id = ? AND comment_id IN (${placeholders})
      `, [user.id, ...commentIds])
      
      const likedIds = new Set(likedComments.map((like: any) => like.comment_id))
      
      comments.forEach((comment: any) => {
        comment.isLiked = likedIds.has(comment.id)
      })
    } else {
      comments.forEach((comment: any) => {
        comment.isLiked = false
      })
    }

    return NextResponse.json({
      comments,
      hasMore: comments.length === limit
    })

  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: '댓글을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// 댓글 생성
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const { message } = await request.json()

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: '메시지를 입력해주세요.' },
        { status: 400 }
      )
    }

    if (message.length > 200) {
      return NextResponse.json(
        { error: '메시지는 200자 이내로 입력해주세요.' },
        { status: 400 }
      )
    }

    // 30초 내 댓글 작성 제한 확인
    const recentComment = await query(`
      SELECT created_at FROM support_comments 
      WHERE user_id = ? 
      AND created_at > DATE_SUB(NOW(), INTERVAL 30 SECOND)
      ORDER BY created_at DESC 
      LIMIT 1
    `, [user.id])

    if (recentComment.length > 0) {
      const timeDiff = 30 - Math.floor((Date.now() - new Date(recentComment[0].created_at).getTime()) / 1000)
      return NextResponse.json(
        { error: `${timeDiff}초 후에 다시 작성할 수 있습니다.` },
        { status: 429 }
      )
    }

    // UUID 생성하여 댓글 삽입
    const commentId = crypto.randomUUID()
    
    await query(`
      INSERT INTO support_comments (id, user_id, message) 
      VALUES (?, ?, ?)
    `, [commentId, user.id, message.trim()])

    // 생성된 댓글 조회
    const newComment = await query(`
      SELECT 
        sc.id,
        sc.message,
        sc.likes,
        sc.created_at,
        u.name as author_name,
        u.id as user_id
      FROM support_comments sc
      JOIN users u ON sc.user_id = u.id
      WHERE sc.id = ?
    `, [commentId])

    return NextResponse.json({
      success: true,
      comment: {
        ...newComment[0],
        isLiked: false
      }
    })

  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: '댓글 작성에 실패했습니다.' },
      { status: 500 }
    )
  }
}