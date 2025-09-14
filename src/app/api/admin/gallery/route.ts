import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const isBlurred = searchParams.get('isBlurred')

    // 실제로는 데이터베이스에서 조회
    const mockPhotos = [
      {
        id: '1',
        title: '2024 개막식',
        description: '축제 개막식 현장',
        category: '개막식',
        uploadedAt: '2024-09-10',
        isBlurred: true,
        photographer: '서울시한부모가족지원센터'
      }
    ]

    return NextResponse.json(mockPhotos)
  } catch (error) {
    return NextResponse.json(
      { error: '갤러리 목록을 가져오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}