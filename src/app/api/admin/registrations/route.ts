import { NextRequest, NextResponse } from 'next/server'
import { Registration } from '@/types/admin'


// GET /api/admin/registrations - 사전접수 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const program = searchParams.get('program') || ''

    // 실제로는 데이터베이스에서 조회
    // const registrations = await db.registrations.findMany({
    //   where: {
    //     ...(search && {
    //       OR: [
    //         { name: { contains: search } },
    //         { email: { contains: search } },
    //         { phone: { contains: search } }
    //       ]
    //     }),
    //     ...(program && { programs: { has: program } })
    //   },
    //   skip: (page - 1) * limit,
    //   take: limit,
    //   orderBy: { registeredAt: 'desc' }
    // })

    // 샘플 응답
    const mockData = {
      registrations: [
        {
          id: '1',
          name: '김가족',
          email: 'family@example.com',
          phone: '010-1111-2222',
          companions: 3,
          programs: ['공연관람', '체험부스'],
          registeredAt: '2024-09-13'
        }
      ],
      total: 100,
      page,
      limit,
      totalPages: Math.ceil(100 / limit)
    }

    return NextResponse.json(mockData)
  } catch (error) {
    return NextResponse.json(
      { error: '사전접수 목록을 가져오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// POST /api/admin/registrations - 사전접수 추가 (관리자용)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, companions, programs } = body

    // 유효성 검사
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // 실제로는 데이터베이스에 저장
    // const registration = await db.registrations.create({
    //   data: {
    //     name,
    //     email,
    //     phone,
    //     companions: companions || 0,
    //     programs: programs || [],
    //     registeredAt: new Date()
    //   }
    // })

    const mockRegistration = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      companions: companions || 0,
      programs: programs || [],
      registeredAt: new Date().toISOString().split('T')[0]
    }

    return NextResponse.json(mockRegistration, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: '사전접수 추가에 실패했습니다.' },
      { status: 500 }
    )
  }
}