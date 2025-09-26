import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql/connection'
import { getRedisClient, isRedisHealthy } from '@/lib/redis/connection'

const REDIS_KEYS = {
  STATS_TOTAL: 'stats:comments:total',
  STATS_LIKES: 'stats:likes:total'
} as const

// 댓글 통계 조회 (Redis 캐싱 적용)
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const redis = await isRedisHealthy() ? await getRedisClient() : null
    
    if (redis) {
      // Redis에서 실시간 통계 조회
      const [totalComments, totalLikes] = await Promise.all([
        redis.get(REDIS_KEYS.STATS_TOTAL),
        redis.get(REDIS_KEYS.STATS_LIKES)
      ])
      
      if (totalComments && totalLikes) {
        console.log(`[${Date.now() - startTime}ms] Redis 통계 조회 완료`)
        return NextResponse.json({
          totalComments: parseInt(totalComments),
          totalLikes: parseInt(totalLikes),
          fromCache: true,
          processingTime: Date.now() - startTime
        })
      }
    }
    
    // 캐시 미스 시 DB에서 조회
    console.log(`[${Date.now() - startTime}ms] DB 통계 조회 시작`)
    
    const stats = await query(`
      SELECT 
        COUNT(*) as total_comments,
        COALESCE(SUM(likes), 0) as total_likes
      FROM support_comments
    `)
    
    console.log(`[${Date.now() - startTime}ms] DB 통계 조회 완료`)

    // Redis에 통계 캐시 (1시간)
    if (redis) {
      await Promise.all([
        redis.setEx(REDIS_KEYS.STATS_TOTAL, 3600, stats[0].total_comments.toString()),
        redis.setEx(REDIS_KEYS.STATS_LIKES, 3600, stats[0].total_likes.toString())
      ])
    }

    return NextResponse.json({
      totalComments: stats[0].total_comments,
      totalLikes: stats[0].total_likes,
      fromCache: false,
      processingTime: Date.now() - startTime
    })

  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: '통계를 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}