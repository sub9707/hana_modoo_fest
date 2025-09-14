import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const { isApproved } = await request.json()

    // 실제로는 데이터베이스에서 업데이트
    // await db.comments.update({
    //   where: { id },
    //   data: { isApproved }
    // })

    return NextResponse.json({ message: '댓글 승인 상태가 변경되었습니다.' })
  } catch (error) {
    return NextResponse.json(
      { error: '댓글 승인 상태 변경에 실패했습니다.' },
      { status: 500 }
    )
  }
}