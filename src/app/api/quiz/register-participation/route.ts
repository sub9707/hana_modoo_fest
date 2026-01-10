// src/app/api/quiz/register-participation/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql/connection'
import { getClientIP, getUserAgent } from '@/lib/utils/request'

interface ParticipationRequest {
  userId: string
  perfectScore: boolean
  totalQuestions: number
  correctAnswers: number
  completionTime: number
  participatedAt: string
}

// 쿨다운 인메모리 맵
const cooldowns = new Map<string, number>()

export async function POST(request: NextRequest) {
  try {
    const data: ParticipationRequest = await request.json()

    // 입력값 검증
    if (!data.userId || !data.perfectScore) {
      return NextResponse.json(
        { success: false, message: '만점을 달성해야 참여할 수 있습니다.' },
        { status: 400 }
      )
    }

    // 쿨다운 체크 (중복 클릭 방지)
    const cooldownKey = `${data.userId}:register`
    const lastRequest = cooldowns.get(cooldownKey)
    const now = Date.now()

    if (lastRequest && now - lastRequest < 3000) {
      return NextResponse.json(
        { success: false, message: '잠시만 기다려주세요.' },
        { status: 429 }
      )
    }

    // 쿨다운 설정 (3초)
    cooldowns.set(cooldownKey, now)
    setTimeout(() => cooldowns.delete(cooldownKey), 3000)

    // 사용자 존재 확인
    const userExists = await query(
      'SELECT id FROM users WHERE id = ? LIMIT 1',
      [data.userId]
    )

    if (userExists.length === 0) {
      return NextResponse.json(
        { success: false, message: '존재하지 않는 사용자입니다.' },
        { status: 404 }
      )
    }

    // 테스트 앱: 중복 참여 제한 제거
    // 무한정 참여 가능

    // 클라이언트 정보 추출
    const clientIP = getClientIP(request)
    const userAgent = getUserAgent(request)

    // 참여 기록 저장 (insertId 대신 affectedRows 확인)
    const result = await query(
      `INSERT INTO quiz_event_participants 
       (user_id, quiz_version, perfect_score, total_questions, correct_answers, completion_time, ip_address, user_agent) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.userId,
        'v1',
        data.perfectScore ? 1 : 0,
        data.totalQuestions,
        data.correctAnswers,
        data.completionTime,
        clientIP,
        userAgent
      ]
    )

    // MySQL에서는 insertId가 없을 수도 있으므로 affectedRows로 확인
    if (!result.affectedRows || result.affectedRows === 0) {
      throw new Error('참여 기록 저장 실패 - 영향받은 행이 없습니다')
    }

    return NextResponse.json({
      success: true,
      message: '퀴즈 이벤트 참여가 완료되었습니다!',
      participationId: result.insertId || 'success'
    })

  } catch (error) {
    console.error('참여 등록 오류:', error)

    return NextResponse.json(
      { success: false, message: `서버 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}` },
      { status: 500 }
    )
  }
}