import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql/connection'

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

    // DB에서 참여 여부 확인
    const participationRecord = await query(
      'SELECT id FROM quiz_event_participants WHERE user_id = ? AND quiz_version = ? LIMIT 1',
      [userId, 'v1']
    )

    const hasParticipated = participationRecord.length > 0

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