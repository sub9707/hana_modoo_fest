// src/app/api/quiz/participation-status/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql/connection'
import { quizRedisService } from '@/lib/redis/quiz'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, message: '사용자 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // Redis에서 먼저 확인
    const hasParticipatedRedis = await quizRedisService.hasUserParticipated(userId)

    if (hasParticipatedRedis) {
      return NextResponse.json({
        success: true,
        hasParticipated: true,
      })
    }

    // Redis에 없으면 DB에서 확인
    const participationRecord = await query(
      'SELECT id FROM quiz_event_participants WHERE user_id = ? AND quiz_version = ? LIMIT 1',
      [userId, 'v1']
    )

    const hasParticipated = participationRecord.length > 0

    // DB에 참여 기록이 있으면 Redis에도 캐싱
    if (hasParticipated) {
      await quizRedisService.recordParticipation(userId, {
        perfectScore: true,
        totalQuestions: 0,
        correctAnswers: 0,
        completionTime: 0
      })
    }

    return NextResponse.json({
      success: true,
      hasParticipated,
    })

  } catch (error) {
    console.error('참여 상태 확인 오류:', error)
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}