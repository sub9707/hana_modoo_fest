// lib/redis/rateLimiter.ts
import { redis } from './connection'

export class RedisRateLimiter {
  async checkRateLimit(
    key: string, 
    maxRequests: number, 
    windowSeconds: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const now = Date.now()
    const window = Math.floor(now / (windowSeconds * 1000))
    const rateLimitKey = `rate_limit:${key}:${window}`
    
    const current = await redis.incr(rateLimitKey)
    
    if (current === 1) {
      await redis.expire(rateLimitKey, windowSeconds)
    }
    
    const remaining = Math.max(0, maxRequests - current)
    const resetTime = (window + 1) * windowSeconds * 1000
    
    return {
      allowed: current <= maxRequests,
      remaining,
      resetTime
    }
  }
}