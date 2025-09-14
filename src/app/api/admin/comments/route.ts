import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isApproved = searchParams.get('isApproved')
    const search = searchParams.get('search')

    // 실제로는 데이터베이스에서 조회
    const mockComments = [
      {
        id: '1',
        author: '응원자1',
        content: '축제 너무 기대돼요!',
        createdAt: '2024-09-13',
        isApproved: true
      }
    ]

    return NextResponse.json(mockComments)
  } catch (error) {
    return NextResponse.json(
      { error: '댓글 목록을 가져오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}
