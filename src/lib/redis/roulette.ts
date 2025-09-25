// lib/redis/roulette.ts (타입 오류 수정된 버전)
import { redis } from './connection'

export class RouletteRedisManager {
  private readonly CONCURRENT_KEY_PREFIX = 'roulette:concurrent:'
  private readonly DAILY_PARTICIPATION_KEY_PREFIX = 'roulette:daily:'
  private readonly COOLDOWN_KEY_PREFIX = 'roulette:cooldown:'
  private readonly SERVER_LOAD_KEY = 'roulette:server_load'

  // 동시 실행 제한
  async checkConcurrentLimit(userId: string, maxConcurrent: number = 5): Promise<boolean> {
    const key = `${this.CONCURRENT_KEY_PREFIX}${userId}`
    const current = await redis.get(key)
    return !current || parseInt(current) < maxConcurrent
  }

  async setConcurrentSpin(userId: string, ttl: number = 10): Promise<void> {
    const key = `${this.CONCURRENT_KEY_PREFIX}${userId}`
    await redis.multi()
      .incr(key)
      .expire(key, ttl)
      .exec()
  }

  async removeConcurrentSpin(userId: string): Promise<void> {
    const key = `${this.CONCURRENT_KEY_PREFIX}${userId}`
    await redis.decr(key)
  }

  // 일일 참여 제한
  async canParticipateToday(userId: string): Promise<boolean> {
    const today = new Date().toISOString().split('T')[0]
    const key = `${this.DAILY_PARTICIPATION_KEY_PREFIX}${userId}:${today}`
    const participated = await redis.get(key)
    return !participated // 참여하지 않았으면 참여 가능
  }

  async hasParticipatedToday(userId: string): Promise<boolean> {
    const today = new Date().toISOString().split('T')[0]
    const key = `${this.DAILY_PARTICIPATION_KEY_PREFIX}${userId}:${today}`
    const participated = await redis.get(key)
    return !!participated // 참여했으면 true
  }

  async setDailyParticipation(userId: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0]
    const key = `${this.DAILY_PARTICIPATION_KEY_PREFIX}${userId}:${today}`
    
    // 다음날 자정까지 유효
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    const ttl = Math.floor((tomorrow.getTime() - Date.now()) / 1000)
    
    await redis.setEx(key, ttl, '1')
  }

  // 쿨다운 관리
  async checkCooldown(userId: string): Promise<{ canSpin: boolean; timeLeft: number }> {
    const key = `${this.COOLDOWN_KEY_PREFIX}${userId}`
    const ttl = await redis.ttl(key)
    
    if (ttl <= 0) {
      return { canSpin: true, timeLeft: 0 }
    }
    
    return { canSpin: false, timeLeft: ttl }
  }

  async setCooldown(userId: string, cooldownSeconds: number = 60): Promise<void> {
    const key = `${this.COOLDOWN_KEY_PREFIX}${userId}`
    await redis.setEx(key, cooldownSeconds, '1')
  }

  // 수정: 서버 부하 모니터링 (올바른 zAdd 사용법)
  async updateServerLoad(): Promise<void> {
    const timestamp = Date.now()
    const requestId = `${timestamp}_${Math.random().toString(36).substr(2, 9)}`
    
    try {
      // node-redis v4+ 올바른 사용법
      await redis.zAdd(this.SERVER_LOAD_KEY, {
        score: timestamp,
        value: requestId
      })
    } catch (error) {
      console.warn('Redis zAdd failed:', error)
    }
    
    // 5분 이전 데이터 정리
    const fiveMinutesAgo = timestamp - (5 * 60 * 1000)
    await redis.zRemRangeByScore(this.SERVER_LOAD_KEY, fiveMinutesAgo, timestamp)
  }

  async getServerLoad(): Promise<{ level: 'low' | 'medium' | 'high'; requestCount: number }> {
    const timestamp = Date.now()
    const oneMinuteAgo = timestamp - (60 * 1000)
    
    const requestCount = await redis.zCount(this.SERVER_LOAD_KEY, oneMinuteAgo, timestamp)
    
    let level: 'low' | 'medium' | 'high' = 'low'
    if (requestCount > 100) {
      level = 'high'
    } else if (requestCount > 50) {
      level = 'medium'
    }
    
    return { level, requestCount }
  }

  // 실시간 통계
  async incrementParticipationCount(): Promise<number> {
    const today = new Date().toISOString().split('T')[0]
    const key = `roulette:stats:participation:${today}`
    
    const count = await redis.incr(key)
    await redis.expire(key, 86400 * 7) // 7일 보관
    
    return count
  }

  async incrementWinnerCount(prizeId: number): Promise<number> {
    const today = new Date().toISOString().split('T')[0]
    const key = `roulette:stats:winner:${prizeId}:${today}`
    
    const count = await redis.incr(key)
    await redis.expire(key, 86400 * 7) // 7일 보관
    
    return count
  }

  // 최근 당첨자 캐시
  async cacheRecentWinners(winners: any[]): Promise<void> {
    const key = 'roulette:recent_winners'
    await redis.setEx(key, 300, JSON.stringify(winners)) // 5분 캐시
  }

  async getCachedRecentWinners(): Promise<any[] | null> {
    const key = 'roulette:recent_winners'
    const cached = await redis.get(key)
    return cached ? JSON.parse(cached) : null
  }

  // 에러 처리와 함께 사용할 수 있는 안전한 래퍼
  async safeExecute<T>(operation: () => Promise<T>, fallbackValue: T): Promise<T> {
    try {
      return await operation()
    } catch (error) {
      console.warn('Redis operation failed:', error)
      return fallbackValue
    }
  }

  // 안전한 일일 참여 체크 (Redis 실패 시 DB 체크로 fallback)
  async canParticipateWithFallback(userId: string, dbCheck: () => Promise<boolean>): Promise<boolean> {
    try {
      return await this.canParticipateToday(userId)
    } catch (error) {
      console.warn('Redis daily participation check failed, falling back to DB:', error)
      return await dbCheck()
    }
  }

  // 추가: 여러 멤버를 한 번에 추가하는 경우의 예시
  async addMultipleToSortedSet(key: string, members: Array<{ score: number; value: string }>): Promise<void> {
    try {
      // 여러 멤버 추가 시 배열로 전달
      await redis.zAdd(key, members.map(member => ({
        score: member.score,
        value: member.value
      })))
    } catch (error) {
      console.warn('Redis zAdd multiple members failed:', error)
    }
  }
}

export const rouletteRedis = new RouletteRedisManager()

// 타입 안전성을 위한 인터페이스
export interface RedisRouletteManager {
  canParticipateToday(userId: string): Promise<boolean>
  hasParticipatedToday(userId: string): Promise<boolean>
  setDailyParticipation(userId: string): Promise<void>
  checkCooldown(userId: string): Promise<{ canSpin: boolean; timeLeft: number }>
  setCooldown(userId: string, cooldownSeconds?: number): Promise<void>
  checkConcurrentLimit(userId: string, maxConcurrent?: number): Promise<boolean>
  setConcurrentSpin(userId: string, ttl?: number): Promise<void>
  removeConcurrentSpin(userId: string): Promise<void>
  updateServerLoad(): Promise<void>
  getServerLoad(): Promise<{ level: 'low' | 'medium' | 'high'; requestCount: number }>
}

// Redis SortedSet 멤버 타입 (참고용)
export interface SortedSetMember {
  score: number
  value: string
}