import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { queryOne } from '@/lib/mysql/connection'
import type { ApiResponse } from '@/types/event'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: true,
        data: {
          can_participate: false,
          has_participated_today: false,
          requires_login: true
        }
      })
    }

    // 오늘 참여 여부 확인
    const today = new Date().toISOString().split('T')[0]
    const todayParticipation = await queryOne(
      `SELECT id FROM event_participations 
       WHERE user_id = ? AND participation_date = ?`,
      [user.id, today]
    )

    // 이벤트 활성 상태 확인
    const eventActive = await queryOne(
      'SELECT setting_value FROM event_settings WHERE setting_key = ?',
      ['event_active']
    )

    const canParticipate = !todayParticipation && 
                          eventActive && 
                          eventActive.setting_value === 'true'

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        can_participate: canParticipate,
        has_participated_today: !!todayParticipation,
        requires_login: false,
        user_name: user.name
      }
    })
  } catch (error) {
    console.error('Check participation error:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: '참여 가능 여부 확인 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}