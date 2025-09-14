import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // 실제로는 여러 테이블에서 집계 데이터 조회
    const stats = {
      totalVisitors: 12543,
      pageViews: 28392,
      registrations: 1234,
      campaignParticipants: 892,
      recentRegistrations: [
        { date: '2024-09-13', count: 45 },
        { date: '2024-09-12', count: 38 },
        { date: '2024-09-11', count: 52 }
      ],
      topPages: [
        { page: '홈페이지', views: 8921, visitors: 5234 },
        { page: '프로그램', views: 6432, visitors: 3156 },
        { page: '사전참가신청', views: 4567, visitors: 2891 }
      ]
    }

    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json(
      { error: '통계 데이터를 가져오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}