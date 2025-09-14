import { Quiz } from '@/types/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const quiz: Quiz = await request.json()

    // 실제로는 데이터베이스에서 업데이트
    // await db.quizzes.update({
    //   where: { id },
    //   data: quiz
    // })

    return NextResponse.json({ ...quiz, id })
  } catch (error) {
    return NextResponse.json(
      { error: '퀴즈 업데이트에 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    // 실제로는 데이터베이스에서 삭제
    // await db.quizzes.delete({ where: { id } })

    return NextResponse.json({ message: '퀴즈가 삭제되었습니다.' })
  } catch (error) {
    return NextResponse.json(
      { error: '퀴즈 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
}
