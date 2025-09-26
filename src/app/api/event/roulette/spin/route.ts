// app/api/event/roulette/spin/route.ts (UUID 테이블 지원으로 수정)
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { query, queryOne, transaction } from '@/lib/mysql/connection'
import { getRedisClient, isRedisHealthy } from '@/lib/redis/connection'
import { headers } from 'next/headers'
import { randomUUID } from 'crypto'
import type { SpinResponse, PrizeWithProbability } from '@/types/event'
import type { RedisClient } from '@/lib/redis/connection'

// Redis 키 상수
const REDIS_KEYS = {
  CONCURRENT_SPIN: (userId: string) => `roulette:concurrent:${userId}`,
  DAILY_PARTICIPATION: (userId: string, date: string) => `roulette:daily:${userId}:${date}`,
  COOLDOWN: (userId: string) => `roulette:cooldown:${userId}`,
  SERVER_LOAD: 'roulette:server_load',
  PRIZES_CACHE: 'roulette:prizes:active'
} as const

export async function POST(request: NextRequest) {
  try {
    // 사용자 인증 확인
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json<SpinResponse>(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    // IP 및 User Agent 정보 수집
    const headersList = await headers()
    const ip_address = headersList.get('x-forwarded-for') ||
      headersList.get('x-real-ip') ||
      'unknown'
    const user_agent = headersList.get('user-agent') || 'unknown'

    // Redis 상태 확인 및 클라이언트 가져오기
    const redisHealthy = await isRedisHealthy()
    let redis: RedisClient | null = null

    if (redisHealthy) {
      try {
        redis = await getRedisClient()
      } catch (error) {
        console.warn('Redis connection failed, falling back to DB-only mode:', error)
        redis = null
      }
    }

    // 이벤트 활성 상태 확인
    const eventActive = await queryOne(
      'SELECT setting_value FROM event_settings WHERE setting_key = ?',
      ['event_active']
    )

    if (!eventActive || eventActive.setting_value !== 'true') {
      return NextResponse.json<SpinResponse>(
        { success: false, error: '현재 이벤트가 진행되지 않습니다.' },
        { status: 400 }
      )
    }

    const today = new Date().toISOString().split('T')[0]

    // Redis를 사용한 일일 참여 제한 확인 (우선순위)
    let hasParticipatedToday = false

    if (redis) {
      try {
        const redisParticipation = await redis.get(REDIS_KEYS.DAILY_PARTICIPATION(user.id, today))
        hasParticipatedToday = !!redisParticipation
      } catch (error) {
        console.warn('Redis daily participation check failed:', error)
        // Redis 에러 시 아래 DB 체크로 fallback
      }
    }

    // Redis 실패하거나 없는 경우 DB 확인
    if (!redis || !hasParticipatedToday) {
      const todayParticipation = await queryOne(
        `SELECT id FROM event_participations 
         WHERE user_id = ? AND participation_date = ?`,
        [user.id, today]
      )
      hasParticipatedToday = !!todayParticipation
    }

    if (hasParticipatedToday) {
      return NextResponse.json<SpinResponse>(
        { success: false, error: '오늘 이미 참여하셨습니다.' },
        { status: 400 }
      )
    }

    // Redis를 사용한 쿨다운 확인
    if (redis) {
      try {
        const cooldownTTL = await redis.ttl(REDIS_KEYS.COOLDOWN(user.id))
        if (cooldownTTL > 0) {
          return NextResponse.json<SpinResponse>(
            { success: false, error: `${cooldownTTL}초 후에 다시 시도해주세요.` },
            { status: 429 }
          )
        }
      } catch (error) {
        console.warn('Redis cooldown check failed:', error)
        // Redis 에러 시 DB로 쿨다운 확인
        const recentSpin = await queryOne(
          `SELECT id FROM event_participations 
           WHERE user_id = ? AND participated_at > DATE_SUB(NOW(), INTERVAL 5 SECOND)`,
          [user.id]
        )

        if (recentSpin) {
          return NextResponse.json<SpinResponse>(
            { success: false, error: '잠시만 기다려주세요.' },
            { status: 429 }
          )
        }
      }
    } else {
      // Redis 사용 불가 시 DB로 쿨다운 확인
      const recentSpin = await queryOne(
        `SELECT id FROM event_participations 
         WHERE user_id = ? AND participated_at > DATE_SUB(NOW(), INTERVAL 5 SECOND)`,
        [user.id]
      )

      if (recentSpin) {
        return NextResponse.json<SpinResponse>(
          { success: false, error: '잠시만 기다려주세요.' },
          { status: 429 }
        )
      }
    }

    // Redis를 사용한 동시 실행 제한
    if (redis) {
      try {
        const currentConcurrent = await redis.get(REDIS_KEYS.CONCURRENT_SPIN(user.id))
        if (currentConcurrent && parseInt(currentConcurrent) > 0) {
          return NextResponse.json<SpinResponse>(
            { success: false, error: '이미 처리 중입니다. 잠시만 기다려주세요.' },
            { status: 429 }
          )
        }

        // 동시 실행 카운터 증가
        const multi = redis.multi()
        multi.incr(REDIS_KEYS.CONCURRENT_SPIN(user.id))
        multi.expire(REDIS_KEYS.CONCURRENT_SPIN(user.id), 10)
        await multi.exec()
      } catch (error) {
        console.warn('Redis concurrent limit check failed:', error)
      }
    }

    try {
      // 서버 부하 기록 (Redis) - 수정된 메서드 사용
      if (redis) {
        try {
          const timestamp = Date.now()
          const requestId = `request:${timestamp}:${user.id}`

          // node-redis v4+ 올바른 사용법
          await redis.zAdd(REDIS_KEYS.SERVER_LOAD, {
            score: timestamp,
            value: requestId
          })

          // 5분 이전 데이터 정리
          const fiveMinutesAgo = timestamp - (5 * 60 * 1000)
          await redis.zRemRangeByScore(REDIS_KEYS.SERVER_LOAD, fiveMinutesAgo, timestamp)
        } catch (error) {
          console.warn('Redis server load tracking failed:', error)
        }
      }

      // 트랜잭션으로 룰렛 실행
      const result = await transaction(async (connection) => {
        // 캐시된 상품 조회 시도 (Redis)
        let activePrizes: any[] | null = null

        if (redis) {
          try {
            const cachedPrizes = await redis.get(REDIS_KEYS.PRIZES_CACHE)
            if (cachedPrizes) {
              activePrizes = JSON.parse(cachedPrizes)
            }
          } catch (error) {
            console.warn('Redis prizes cache read failed:', error)
          }
        }

        // 캐시 미스 시 DB에서 조회
        if (!activePrizes) {
          activePrizes = await query(
            `SELECT p.*, pp.probability 
             FROM prizes p
             JOIN prize_probabilities pp ON p.id = pp.prize_id
             WHERE p.is_active = 1 AND pp.is_active = 1 AND p.current_quantity > 0
             ORDER BY p.sort_order`
          )

          // Redis에 캐시 저장 (1분)
          if (redis && activePrizes) {
            try {
              await redis.setEx(REDIS_KEYS.PRIZES_CACHE, 60, JSON.stringify(activePrizes))
            } catch (error) {
              console.warn('Redis prizes cache write failed:', error)
            }
          }
        }

        if (!activePrizes || activePrizes.length === 0) {
          throw new Error('현재 참여 가능한 상품이 없습니다.')
        }

        // 확률 계산 및 상품 선택
        const totalProbability = activePrizes.reduce((sum: number, prize: any) => sum + parseFloat(prize.probability), 0)
        const random = Math.random() * totalProbability

        let accumulator = 0
        let selectedPrize: PrizeWithProbability | null = null

        for (const prize of activePrizes) {
          accumulator += parseFloat(prize.probability)
          if (random <= accumulator) {
            selectedPrize = {
              ...prize,
              probability: parseFloat(prize.probability)
            }
            break
          }
        }

        // fallback으로 마지막 상품 선택 (안전장치)
        if (!selectedPrize) {
          selectedPrize = {
            ...activePrizes[activePrizes.length - 1],
            probability: parseFloat(activePrizes[activePrizes.length - 1].probability)
          }
        }

        // 타입 가드: selectedPrize가 반드시 존재함을 보장
        if (!selectedPrize) {
          throw new Error('상품 선택 과정에서 오류가 발생했습니다.')
        }

        // UUID 미리 생성
        const participationId = randomUUID()

        // 참여 기록 생성 (UUID 명시적으로 지정)
        const participationResult = await connection.execute(
          `INSERT INTO event_participations (id, user_id, participation_date, ip_address, user_agent)
           VALUES (?, ?, ?, ?, ?)`,
          [participationId, user.id, today, ip_address.substring(0, 45), user_agent.substring(0, 500)]
        )

        let winnerId: string | undefined = undefined

        // 당첨 처리 (꽝이 아닌 경우)
        if (selectedPrize.type !== 'none') {
          const updateResult = await connection.execute(
            'UPDATE prizes SET current_quantity = current_quantity - 1 WHERE id = ? AND current_quantity > 0',
            [selectedPrize.id]
          )

          if ((updateResult[0] as any).affectedRows === 0) {
            throw new Error('상품 수량이 부족합니다.')
          }

          // 당첨자 ID도 미리 생성
          winnerId = randomUUID()

          const winnerResult = await connection.execute(
            `INSERT INTO event_winners (id, participation_id, user_id, prize_id)
             VALUES (?, ?, ?, ?)`,
            [winnerId, participationId, user.id, selectedPrize.id]
          )

          // Redis 캐시 무효화 (상품 수량 변경으로 인해)
          if (redis) {
            try {
              await redis.del(REDIS_KEYS.PRIZES_CACHE)
            } catch (error) {
              console.warn('Redis cache invalidation failed:', error)
            }
          }
        }

        // 업데이트된 수량 조회
        const updatedPrize = await connection.execute(
          'SELECT current_quantity FROM prizes WHERE id = ?',
          [selectedPrize.id]
        )

        const remainingQuantity = Number((updatedPrize[0] as any)[0]?.current_quantity) || 0

        return {
          prize: selectedPrize,
          participation_id: participationId,
          winner_id: winnerId,
          remaining_quantity: remainingQuantity
        }
      })

      // Redis에 참여 기록 저장 (다음날 자정까지)
      if (redis) {
        try {
          const tomorrow = new Date()
          tomorrow.setDate(tomorrow.getDate() + 1)
          tomorrow.setHours(0, 0, 0, 0)
          const ttl = Math.floor((tomorrow.getTime() - Date.now()) / 1000)

          await redis.setEx(REDIS_KEYS.DAILY_PARTICIPATION(user.id, today), ttl, '1')

          // 쿨다운 설정 (5분)
          await redis.setEx(REDIS_KEYS.COOLDOWN(user.id), 300, '1')
        } catch (error) {
          console.warn('Redis participation/cooldown recording failed:', error)
        }
      }

      return NextResponse.json<SpinResponse>({
        success: true,
        data: result
      })

    } catch (transactionError) {
      console.error('Roulette transaction error:', transactionError)
      return NextResponse.json<SpinResponse>(
        {
          success: false,
          error: transactionError instanceof Error ? transactionError.message : '룰렛 처리 중 오류가 발생했습니다.'
        },
        { status: 500 }
      )
    } finally {
      // 동시 실행 카운터 감소
      if (redis) {
        try {
          await redis.decr(REDIS_KEYS.CONCURRENT_SPIN(user.id))
        } catch (error) {
          console.warn('Redis concurrent counter cleanup failed:', error)
        }
      }
    }

  } catch (error) {
    console.error('Roulette spin error:', error)
    return NextResponse.json<SpinResponse>(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_APP_URL || '',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  })
}