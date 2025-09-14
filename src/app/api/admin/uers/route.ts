import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const dateFilter = searchParams.get('dateFilter')

    // 실제로는 데이터베이스에서 조회
    const mockUsers = [
      {
        id: '1',
        name: '김철수',
        email: 'kim@example.com',
        phone: '010-1234-5678',
        registeredAt: '2024-09-10',
        status: 'active'
      }
    ]

    return NextResponse.json({
      users: mockUsers,
      total: mockUsers.length
    })
  } catch (error) {
    return NextResponse.json(
      { error: '사용자 목록을 가져오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}