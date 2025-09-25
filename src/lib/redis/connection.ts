// lib/redis/connection.ts
import { createClient } from 'redis'

/**
 * Redis 클라이언트 타입
 * createClient()가 반환하는 실제 타입을 그대로 추론
 */
export type RedisClient = ReturnType<typeof createClient>

declare global {
  // HMR 대응: 개발 환경에서 글로벌 캐시에 저장
  // eslint-disable-next-line no-var
  var __redis_client: RedisClient | undefined
}

let redis: RedisClient

function createRedisClient(): RedisClient {
  return createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
      connectTimeout: 60_000,
      reconnectStrategy: (retries) => {
        if (retries > 3) return new Error('Redis reconnect failed')
        return Math.min(retries * 100, 3000) // 재시도 딜레이(ms)
      },
    },
  })
}

// 환경별 Redis 클라이언트 생성
if (process.env.NODE_ENV === 'production') {
  redis = createRedisClient()
} else {
  if (!global.__redis_client) {
    global.__redis_client = createRedisClient()
  }
  redis = global.__redis_client
}

// 이벤트 핸들링
redis.on('error', (err) => {
  console.error('Redis connection error:', err)
})
redis.on('connect', () => console.log('Redis connected successfully'))
redis.on('ready', () => console.log('Redis ready to use'))
redis.on('end', () => console.log('Redis connection ended'))

/**
 * Redis 연결
 */
export async function connectRedis(): Promise<RedisClient> {
  if (!redis.isOpen) {
    try {
      await redis.connect()
    } catch (error) {
      console.error('Failed to connect to Redis:', error)
      throw error
    }
  }
  return redis
}

/**
 * Redis 클라이언트 가져오기 (연결 보장)
 */
export async function getRedisClient(): Promise<RedisClient> {
  await connectRedis()
  return redis
}

/**
 * Redis 상태 확인
 */
export async function isRedisHealthy(): Promise<boolean> {
  try {
    if (!redis.isOpen) await connectRedis()
    const result = await redis.ping()
    return result === 'PONG'
  } catch (error) {
    console.error('Redis health check failed:', error)
    return false
  }
}

/**
 * Redis 연결 종료
 */
export async function closeRedis(): Promise<void> {
  try {
    if (redis.isOpen) await redis.quit()
  } catch (error) {
    console.error('Error closing Redis connection:', error)
  }
}

// 프로세스 종료 시 정리
if (typeof process !== 'undefined') {
  process.on('SIGTERM', closeRedis)
  process.on('SIGINT', closeRedis)
  process.on('beforeExit', closeRedis)
}

export { redis }
