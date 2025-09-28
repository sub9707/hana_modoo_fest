import { NextRequest, NextResponse } from 'next/server'
import { query, transaction } from '@/lib/mysql/connection'
import { getCurrentUser } from '@/lib/mysql/server'
import { getRedisClient, isRedisHealthy } from '@/lib/redis/connection'

// Redis 키 상수
const REDIS_KEYS = {
  USER_LIKES: (userId: string) => `user:${userId}:likes`,
  COMMENT_LIKES: (commentId: string) => `comment:${commentId}:likes`,
  COMMENT_LIKED_USERS: (commentId: string) => `comment:${commentId}:liked_users`,
  STATS_LIKES: 'stats:likes:total',
  LIKE_COOLDOWN: (userId: string, commentId: string) => `cooldown:like:${userId}:${commentId}`,
  COMMENTS_CACHE: (page: number, sortBy: string) => `comments:page:${page}:${sortBy}`,
  RECENT_COMMENTS: 'comments:recent'
} as const

// 캐시 무효화 함수
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

// 좋아요 토글 API - 성능 대폭 개선
export async function PATCH(
  request: NextRequest,
  context:  { params: any }
) {
  const startTime = Date.now()

  try {
    console.log(`[${Date.now() - startTime}ms] API 시작`)

    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }

    const { id: commentId } = (await context.params) as { id: string }
    console.log(`[${Date.now() - startTime}ms] 파라미터 파싱 완료`)

    // Redis 연결 확인
    const redisHealthy = await isRedisHealthy()
    let redis: any = null

    if (redisHealthy) {
      try {
        redis = await getRedisClient()
      } catch (error) {
        console.warn('Redis connection failed, falling back to DB-only mode:', error)
      }
    }

    // 쿨다운 체크 (중복 클릭 방지)
    if (redis) {
      const cooldownKey = REDIS_KEYS.LIKE_COOLDOWN(user.id, commentId)
      const inCooldown = await redis.exists(cooldownKey)

      if (inCooldown) {
        return NextResponse.json({ error: '잠시만 기다려주세요.' }, { status: 429 })
      }

      // 쿨다운 설정 (1초)
      await redis.setEx(cooldownKey, 1, '1')
    }

    let result: { isLiked: boolean; likes: number; fromCache?: boolean }

    if (redis) {
      // Redis 기반 빠른 처리
      console.log(`[${Date.now() - startTime}ms] Redis 처리 시작`)

      const multi = redis.multi()
      const userLikesKey = REDIS_KEYS.USER_LIKES(user.id)
      const commentLikesKey = REDIS_KEYS.COMMENT_LIKES(commentId)
      const commentLikedUsersKey = REDIS_KEYS.COMMENT_LIKED_USERS(commentId)

      // 현재 좋아요 상태 확인
      const isCurrentlyLiked = await redis.sIsMember(userLikesKey, commentId)
      console.log(`[${Date.now() - startTime}ms] Redis 좋아요 상태 확인 완료`)

      let newLikes: number
      let isLiked: boolean

      if (isCurrentlyLiked) {
        // 좋아요 취소
        multi.sRem(userLikesKey, commentId)
        multi.sRem(commentLikedUsersKey, user.id)
        multi.decr(commentLikesKey)
        multi.decr(REDIS_KEYS.STATS_LIKES)
        isLiked = false
      } else {
        // 좋아요 추가
        multi.sAdd(userLikesKey, commentId)
        multi.sAdd(commentLikedUsersKey, user.id)
        multi.incr(commentLikesKey)
        multi.incr(REDIS_KEYS.STATS_LIKES)
        isLiked = true
      }

      // 만료 시간 설정
      multi.expire(userLikesKey, 30 * 24 * 3600) // 30일
      multi.expire(commentLikedUsersKey, 30 * 24 * 3600) // 30일

      await multi.exec()
      console.log(`[${Date.now() - startTime}ms] Redis 트랜잭션 완료`)

      // 업데이트된 좋아요 수 조회
      newLikes = await redis.get(commentLikesKey).then((val: string) => parseInt(val || '0'))

      result = { isLiked, likes: newLikes, fromCache: true }

      // 백그라운드에서 DB 동기화 (응답 후 비동기 처리)
      Promise.resolve().then(async () => {
        try {
          console.log(`Background DB sync started for comment ${commentId}`)

          await transaction(async (connection) => {
            // 댓글 존재 확인과 좋아요 상태를 한 번에 조회
            const [rows] = await connection.execute(
              `SELECT sc.id as comment_id, scl.id as like_id 
               FROM support_comments sc
               LEFT JOIN support_comment_likes scl ON sc.id = scl.comment_id AND scl.user_id = ?
               WHERE sc.id = ?`,
              [user.id, commentId]
            )

            if ((rows as any[]).length === 0) {
              throw new Error('댓글을 찾을 수 없습니다.')
            }

            const hasLikeInDB = (rows as any[])[0].like_id !== null

            if (isLiked && !hasLikeInDB) {
              // 좋아요 추가
              await Promise.all([
                connection.execute(
                  `INSERT IGNORE INTO support_comment_likes (id, comment_id, user_id) VALUES (?, ?, ?)`,
                  [crypto.randomUUID(), commentId, user.id]
                ),
                connection.execute(
                  `UPDATE support_comments SET likes = likes + 1 WHERE id = ?`,
                  [commentId]
                )
              ])
            } else if (!isLiked && hasLikeInDB) {
              // 좋아요 취소
              await Promise.all([
                connection.execute(
                  `DELETE FROM support_comment_likes WHERE comment_id = ? AND user_id = ?`,
                  [commentId, user.id]
                ),
                connection.execute(
                  `UPDATE support_comments SET likes = likes - 1 WHERE id = ?`,
                  [commentId]
                )
              ])
            }
          })

          console.log(`Background DB sync completed for comment ${commentId}`)
        } catch (error) {
          console.error('Background DB sync error:', error)
          // Redis 상태를 DB와 재동기화하는 로직 추가 가능
        }
      })

      // 캐시 무효화
      await invalidateCommentCaches(redis, commentId)

    } else {
      // Redis 실패 시 기존 DB 방식 (최적화된 버전)
      console.log(`[${Date.now() - startTime}ms] DB 처리 시작`)

      result = await transaction(async (connection) => {
        // 댓글 존재 확인과 좋아요 상태를 한 번에 조회 (쿼리 수 감소)
        const [rows] = await connection.execute(
          `SELECT sc.id as comment_id, sc.likes, scl.id as like_id 
           FROM support_comments sc
           LEFT JOIN support_comment_likes scl ON sc.id = scl.comment_id AND scl.user_id = ?
           WHERE sc.id = ?`,
          [user.id, commentId]
        )

        if ((rows as any[]).length === 0) {
          throw new Error('댓글을 찾을 수 없습니다.')
        }

        const commentData = (rows as any[])[0]
        const hasLike = commentData.like_id !== null
        let newLikes = commentData.likes

        if (hasLike) {
          // 좋아요 취소 (병렬 실행으로 성능 개선)
          await Promise.all([
            connection.execute(
              `DELETE FROM support_comment_likes WHERE comment_id = ? AND user_id = ?`,
              [commentId, user.id]
            ),
            connection.execute(
              `UPDATE support_comments SET likes = likes - 1 WHERE id = ?`,
              [commentId]
            )
          ])
          newLikes -= 1
          return { isLiked: false, likes: newLikes }
        } else {
          // 좋아요 추가 (병렬 실행으로 성능 개선)
          await Promise.all([
            connection.execute(
              `INSERT INTO support_comment_likes (id, comment_id, user_id) VALUES (?, ?, ?)`,
              [crypto.randomUUID(), commentId, user.id]
            ),
            connection.execute(
              `UPDATE support_comments SET likes = likes + 1 WHERE id = ?`,
              [commentId]
            )
          ])
          newLikes += 1
          return { isLiked: true, likes: newLikes }
        }
      })

      console.log(`[${Date.now() - startTime}ms] DB 트랜잭션 완료`)
    }

    console.log(`[${Date.now() - startTime}ms] API 전체 완료`)

    return NextResponse.json({
      success: true,
      ...result,
      processingTime: Date.now() - startTime
    })

  } catch (error) {
    console.error(`[${Date.now() - startTime}ms] 에러 발생:`, error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '좋아요 처리에 실패했습니다.' },
      { status: 500 }
    )
  }
}