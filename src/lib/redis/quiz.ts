// src/lib/redis/quiz.ts
import { getRedisClient, isRedisHealthy } from '@/lib/redis/connection'
import type { RedisClient } from '@/lib/redis/connection'

// Redis 키 생성 유틸리티
export const QuizRedisKeys = {
  quizParticipant: (userId: string) => `quiz:participant:${userId}`,
  quizAttempts: (userId: string) => `quiz:attempts:${userId}`,
  quizStats: () => 'quiz:stats:global',
  dailyParticipants: (date: string) => `quiz:daily:${date}`,
  quizData: () => 'quiz:data:current',
  quizVersion: () => 'quiz:version',
} as const

// 퀴즈 Redis 유틸리티 클래스
export class QuizRedisService {
  private redis: RedisClient | null = null

  private async getRedis(): Promise<RedisClient | null> {
    try {
      const healthy = await isRedisHealthy()
      if (!healthy) return null

      this.redis = await getRedisClient()
      return this.redis
    } catch (error) {
      console.error('Redis connection failed:', error)
      return null
    }
  }

  // 사용자가 이미 참여했는지 확인
  async hasUserParticipated(userId: string): Promise<boolean> {
    try {
      const redis = await this.getRedis()
      if (!redis) return false

      const exists = await redis.exists(QuizRedisKeys.quizParticipant(userId))
      return exists === 1
    } catch (error) {
      console.error('Redis error checking participation:', error)
      return false
    }
  }

  // 사용자 참여 기록
  async recordParticipation(userId: string, data: {
    perfectScore: boolean
    totalQuestions: number
    correctAnswers: number
    completionTime: number
  }): Promise<void> {
    try {
      const redis = await this.getRedis()
      if (!redis) return

      const key = QuizRedisKeys.quizParticipant(userId)
      const participationData = {
        ...data,
        participatedAt: new Date().toISOString()
      }
      
      await redis.setEx(key, 7 * 24 * 60 * 60, JSON.stringify(participationData))
      
      const today = new Date().toISOString().split('T')[0]
      await redis.incr(QuizRedisKeys.dailyParticipants(today))
      await redis.expire(QuizRedisKeys.dailyParticipants(today), 7 * 24 * 60 * 60)

      await this.updateGlobalStats(data.perfectScore)
    } catch (error) {
      console.error('Redis error recording participation:', error)
    }
  }

  // 전체 통계 업데이트
  private async updateGlobalStats(perfectScore: boolean): Promise<void> {
    try {
      const redis = await this.getRedis()
      if (!redis) return

      const statsKey = QuizRedisKeys.quizStats()
      const multi = redis.multi()
      
      multi.hIncrBy(statsKey, 'totalParticipants', 1)
      if (perfectScore) {
        multi.hIncrBy(statsKey, 'perfectScoreParticipants', 1)
      }
      multi.expire(statsKey, 24 * 60 * 60)
      
      await multi.exec()
    } catch (error) {
      console.error('Redis error updating stats:', error)
    }
  }

  // 쿨다운 체크
  async checkCooldown(userId: string, action: string): Promise<boolean> {
    try {
      const redis = await this.getRedis()
      if (!redis) return true

      const key = `quiz:cooldown:${userId}:${action}`
      const exists = await redis.exists(key)
      return exists === 0
    } catch (error) {
      console.error('Redis error checking cooldown:', error)
      return true
    }
  }

  // 쿨다운 설정
  async setCooldown(userId: string, action: string, seconds: number = 1): Promise<void> {
    try {
      const redis = await this.getRedis()
      if (!redis) return

      const key = `quiz:cooldown:${userId}:${action}`
      await redis.setEx(key, seconds, '1')
    } catch (error) {
      console.error('Redis error setting cooldown:', error)
    }
  }

  // 전체 통계 조회
  async getGlobalStats(): Promise<{
    totalParticipants: number
    perfectScoreParticipants: number
  }> {
    try {
      const redis = await this.getRedis()
      if (!redis) {
        return { totalParticipants: 0, perfectScoreParticipants: 0 }
      }

      const statsKey = QuizRedisKeys.quizStats()
      const [totalParticipants, perfectScoreParticipants] = await Promise.all([
        redis.hGet(statsKey, 'totalParticipants'),
        redis.hGet(statsKey, 'perfectScoreParticipants')
      ])
      
      return {
        totalParticipants: parseInt(totalParticipants || '0'),
        perfectScoreParticipants: parseInt(perfectScoreParticipants || '0')
      }
    } catch (error) {
      console.error('Redis error getting global stats:', error)
      return { totalParticipants: 0, perfectScoreParticipants: 0 }
    }
  }

  // 일일 참여자 수 조회
  async getDailyParticipants(date?: string): Promise<number> {
    try {
      const redis = await this.getRedis()
      if (!redis) return 0

      const targetDate = date || new Date().toISOString().split('T')[0]
      const count = await redis.get(QuizRedisKeys.dailyParticipants(targetDate))
      return count ? parseInt(count) : 0
    } catch (error) {
      console.error('Redis error getting daily participants:', error)
      return 0
    }
  }
}

export const quizRedisService = new QuizRedisService()