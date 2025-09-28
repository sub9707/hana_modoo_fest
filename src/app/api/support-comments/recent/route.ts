import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql/connection'
import { getRedisClient, isRedisHealthy } from '@/lib/redis/connection'

// Redis 키 상수 추가
const REDIS_KEYS = {
  RECENT_COMMENTS: 'comments:recent'
} as const

// 최근 댓글 조회 (슬라이더용) - Redis 캐싱 적용
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '5')
    
    const redis = await isRedisHealthy() ? await getRedisClient() : null
    
    if (redis) {
      // Redis에서 최근 댓글 조회
      const cachedComments = await redis.lRange(REDIS_KEYS.RECENT_COMMENTS, 0, limit - 1)
      
      if (cachedComments.length > 0) {
        const recentComments = cachedComments.map(comment => JSON.parse(comment))
        return NextResponse.json({ 
          comments: recentComments,
          fromCache: true,
          processingTime: Date.now() - startTime
        })
      }
    }
    
    const recentComments = await query(`
      SELECT 
        sc.id,
        sc.message,
        sc.likes,
        sc.created_at,
        u.name as author_name
      FROM support_comments sc
      JOIN users u ON sc.user_id = u.id
      ORDER BY sc.created_at DESC
      LIMIT ?
    `, [limit])
  
    
    // Redis에 캐시 저장
    if (redis && recentComments.length > 0) {
      const multi = redis.multi()
      recentComments.forEach(comment => {
        multi.lPush(REDIS_KEYS.RECENT_COMMENTS, JSON.stringify(comment))
      })
      multi.expire(REDIS_KEYS.RECENT_COMMENTS, 300) // 5분 캐시
      await multi.exec()
    }

    return NextResponse.json({ 
      comments: recentComments,
      fromCache: false,
      processingTime: Date.now() - startTime
    })

  } catch (error) {
    console.error('Error fetching recent comments:', error)
    return NextResponse.json(
      { error: '최근 댓글을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}