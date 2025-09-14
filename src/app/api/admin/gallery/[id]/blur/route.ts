import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const { isBlurred } = await request.json()

    // 실제로는 데이터베이스에서 업데이트
    // await db.gallery.update({
    //   where: { id },
    //   data: { isBlurred }
    // })

    return NextResponse.json({ message: 'Blur 상태가 변경되었습니다.' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Blur 상태 변경에 실패했습니다.' },
      { status: 500 }
    )
  }
}
