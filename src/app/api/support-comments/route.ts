import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql/connection'
import { getCurrentUser } from '@/lib/mysql/server'
import { getRedisClient, isRedisHealthy } from '@/lib/redis/connection'

const REDIS_KEYS = {
  COMMENTS_CACHE: (page: number, sortBy: string) => `comments:page:${page}:${sortBy}`,
  USER_LIKES: (userId: string) => `user:${userId}:likes`,
  STATS_TOTAL: 'stats:comments:total',
  COMMENT_LIKES: (commentId: string) => `comment:${commentId}:likes`,
  RECENT_COMMENTS: 'comments:recent',
  RATE_LIMIT: (userId: string) => `rate_limit:comment:${userId}`
} as const

// 댓글 목록 조회 (Redis 캐싱 추가)
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sortBy') || 'latest'
    const offset = (page - 1) * limit

    // Redis에서 캐시된 댓글 목록 확인
    const redisHealthy = await isRedisHealthy()
    let redis: any = null
    let comments: any[] = []
    
    if (redisHealthy) {
      try {
        redis = await getRedisClient()
        const cacheKey = REDIS_KEYS.COMMENTS_CACHE(page, sortBy)
        const cachedComments = await redis.get(cacheKey)
        
        if (cachedComments) {
          comments = JSON.parse(cachedComments)
        }
      } catch (error) {
        console.warn('Redis cache read failed:', error)
      }
    }

    if (comments.length === 0) {
      // 캐시 미스 - DB에서 조회
      
      let orderBy = 'sc.created_at DESC'
      if (sortBy === 'popular') {
        orderBy = 'sc.likes DESC, sc.created_at DESC'
      }

      comments = await query(`
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
    

      // Redis에 캐시 저장 (5분)
      if (redis && comments.length > 0) {
        try {
          const cacheKey = REDIS_KEYS.COMMENTS_CACHE(page, sortBy)
          await redis.setEx(cacheKey, 300, JSON.stringify(comments))
        } catch (error) {
          console.warn('Redis cache write failed:', error)
        }
      }
    }

    // 사용자 좋아요 정보 조회 (Redis 우선, DB fallback)
    const user = await getCurrentUser()
    if (user && comments.length > 0) {
      if (redis) {
        try {
          const userLikesKey = REDIS_KEYS.USER_LIKES(user.id)
          const userLikes = await redis.sMembers(userLikesKey)
          const likedSet = new Set(userLikes)
          
          comments.forEach((comment: any) => {
            comment.isLiked = likedSet.has(comment.id)
          })
          
        } catch (error) {
          console.warn('Redis user likes read failed, falling back to DB:', error)
          // DB fallback
          await addLikeInfoFromDB(comments, user.id)
        }
      } else {
        await addLikeInfoFromDB(comments, user.id)
      }
    } else {
      comments.forEach((comment: any) => {
        comment.isLiked = false
      })
    }

    return NextResponse.json({
      comments,
      hasMore: comments.length === limit,
      processingTime: Date.now() - startTime
    })

  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: '댓글을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// DB에서 좋아요 정보 조회하는 헬퍼 함수
async function addLikeInfoFromDB(comments: any[], userId: string) {
  const commentIds = comments.map((c: any) => c.id)
  const placeholders = commentIds.map(() => '?').join(',')
  
  const likedComments = await query(`
    SELECT comment_id FROM support_comment_likes 
    WHERE user_id = ? AND comment_id IN (${placeholders})
  `, [userId, ...commentIds])
  
  const likedIds = new Set(likedComments.map((like: any) => like.comment_id))
  
  comments.forEach((comment: any) => {
    comment.isLiked = likedIds.has(comment.id)
  })
}

// 댓글 생성 (Redis 실시간 업데이트 추가)
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

    const redis = await isRedisHealthy() ? await getRedisClient() : null
    
    // 속도 제한 확인 (Redis 우선)
    if (redis) {
      const rateLimitKey = `rate_limit:comment:${user.id}`
      const lastComment = await redis.get(rateLimitKey)
      
      if (lastComment) {
        const timeLeft = await redis.ttl(rateLimitKey)
        return NextResponse.json(
          { error: `${timeLeft}초 후에 다시 작성할 수 있습니다.` },
          { status: 429 }
        )
      }
    } else {
      // DB 기반 속도 제한
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
    }

    const commentId = crypto.randomUUID()
    
    // DB에 댓글 저장
    await query(`
      INSERT INTO support_comments (id, user_id, message) 
      VALUES (?, ?, ?)
    `, [commentId, user.id, message.trim()])

    // Redis 실시간 업데이트
    if (redis) {
      const multi = redis.multi()
      
      // 통계 업데이트
      multi.incr(REDIS_KEYS.STATS_TOTAL)
      
      // 댓글 좋아요 수 초기화
      multi.set(REDIS_KEYS.COMMENT_LIKES(commentId), '0')
      
      // 최근 댓글에 추가
      const newComment = {
        id: commentId,
        message: message.trim(),
        likes: 0,
        created_at: new Date().toISOString(),
        author_name: user.name,
        user_id: user.id,
        isLiked: false
      }
      
      multi.lPush(REDIS_KEYS.RECENT_COMMENTS, JSON.stringify(newComment))
      multi.lTrim(REDIS_KEYS.RECENT_COMMENTS, 0, 9) // 최대 10개 유지
      
      // 속도 제한 설정 (30초)
      multi.setEx(`rate_limit:comment:${user.id}`, 30, Date.now().toString())
      
      await multi.exec()
      
      // 댓글 캐시 무효화
      await invalidateCommentCaches(redis, commentId)
    
    }

    // 생성된 댓글 정보 반환
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
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: '댓글 작성에 실패했습니다.' },
      { status: 500 }
    )
  }
}

async function invalidateCommentCaches(redis: any, commentId: string) {
  try {
    const pattern = 'comments:page:*'
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(keys)
    }
    await redis.del(REDIS_KEYS.RECENT_COMMENTS)
  } catch (error) {
    console.warn('Cache invalidation failed:', error)
  }
}