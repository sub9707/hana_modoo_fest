// app/api/event/roulette/spin/route.ts (UUID 테이블 지원으로 수정)
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { query, queryOne, transaction } from '@/lib/mysql/connection'
import { headers } from 'next/headers'
import { randomUUID } from 'crypto'
import type { SpinResponse, PrizeWithProbability } from '@/types/event'

// 동시 실행 제한을 위한 인메모리 맵
const concurrentSpins = new Map<string, boolean>()

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

    // 테스트 앱: 이벤트 활성 상태 체크 제거
    // 항상 이벤트 진행 중

    const today = new Date().toISOString().split('T')[0]

    // 테스트 앱: 일일 참여 제한 및 쿨다운 제거
    // 무한정 참여 가능

    // 인메모리 동시 실행 제한
    if (concurrentSpins.get(user.id)) {
      return NextResponse.json<SpinResponse>(
        { success: false, error: '이미 처리 중입니다. 잠시만 기다려주세요.' },
        { status: 429 }
      )
    }

    // 동시 실행 플래그 설정
    concurrentSpins.set(user.id, true)

    // 10초 후 자동 제거
    setTimeout(() => {
      concurrentSpins.delete(user.id)
    }, 10000)

    try {
      // 트랜잭션으로 룰렛 실행
      const result = await transaction(async (connection) => {
        // DB에서 활성 상품 조회
        const activePrizes = await query(
          `SELECT p.*, pp.probability
           FROM prizes p
           JOIN prize_probabilities pp ON p.id = pp.prize_id
           WHERE p.is_active = 1 AND pp.is_active = 1 AND p.current_quantity > 0
           ORDER BY p.sort_order`
        )

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

      // 테스트 앱: 무한정 참여 가능

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
      // 동시 실행 플래그 제거
      concurrentSpins.delete(user.id)
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