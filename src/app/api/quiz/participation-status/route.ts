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

    // 테스트 앱: 항상 참여 가능하도록 설정
    // 무한정 퀴즈 참여 허용
    return NextResponse.json({
      success: true,
      hasParticipated: false,
    })

  } catch (error) {
    console.error('참여 상태 확인 오류:', error)
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}