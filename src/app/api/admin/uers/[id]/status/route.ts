import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const { status } = await request.json()

    if (status !== 'active' && status !== 'inactive') {
      return NextResponse.json(
        { error: '올바르지 않은 상태값입니다.' },
        { status: 400 }
      )
    }

    // 실제로는 데이터베이스에서 업데이트
    // await db.users.update({
    //   where: { id },
    //   data: { status }
    // })

    return NextResponse.json({ message: '사용자 상태가 변경되었습니다.' })
  } catch (error) {
    return NextResponse.json(
      { error: '사용자 상태 변경에 실패했습니다.' },
      { status: 500 }
    )
  }
}