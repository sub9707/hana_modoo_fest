import { Quiz } from '@/types/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const isActive = searchParams.get('isActive')

    // 실제로는 데이터베이스에서 조회
    const mockQuizzes = [
      {
        id: '1',
        question: '우리나라에서 한부모가족의 비율은?',
        options: ['약 5%', '약 10%', '약 15%', '약 20%'],
        correctAnswer: 1,
        category: '가족통계',
        explanation: '통계청 자료에 따르면 약 10%입니다.',
        isActive: true
      }
    ]

    return NextResponse.json(mockQuizzes)
  } catch (error) {
    return NextResponse.json(
      { error: '퀴즈 목록을 가져오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const quiz: Quiz = await request.json()
    
    // 유효성 검사
    if (!quiz.question || !quiz.options || quiz.options.length !== 4) {
      return NextResponse.json(
        { error: '퀴즈 데이터가 올바르지 않습니다.' },
        { status: 400 }
      )
    }

    // 실제로는 데이터베이스에 저장
    const newQuiz = {
      ...quiz,
      id: Date.now().toString()
    }

    return NextResponse.json(newQuiz, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: '퀴즈 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}
