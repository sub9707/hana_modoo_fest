import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, checkUserRole } from '@/lib/mysql/server'
import { getAllUsers, createUser, CreateUserData } from '@/lib/services/users-service'

// GET: 사용자 목록 조회
export async function GET(request: NextRequest) {
  try {
    // 권한 확인
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
    }

    const hasAdminRole = await checkUserRole('admin')
    if (!hasAdminRole) {
      return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 })
    }

    const users = await getAllUsers()
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '사용자 목록을 가져오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// POST: 새 사용자 생성 (관리자용)
export async function POST(request: NextRequest) {
  try {
    // 권한 확인
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
    }

    const hasAdminRole = await checkUserRole('admin')
    if (!hasAdminRole) {
      return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 })
    }

    const body = await request.json()
    const { name, username, company, gender, birth_date, phone, role, password } = body

    // 입력 데이터 검증
    if (!name || !username || !gender || !birth_date || !phone || !role || !password) {
      return NextResponse.json({ error: '필수 필드가 누락되었습니다.' }, { status: 400 })
    }

    // 역할 유효성 검증
    const validRoles = ['admin', 'editor', 'user']
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: '유효하지 않은 역할입니다.' }, { status: 400 })
    }

    // 성별 유효성 검증
    const validGenders = ['male', 'female', 'none']
    if (!validGenders.includes(gender)) {
      return NextResponse.json({ error: '유효하지 않은 성별입니다.' }, { status: 400 })
    }

    const userData: CreateUserData = {
      name,
      username,
      company,
      gender,
      birth_date,
      phone,
      role,
      password
    }

    const newUser = await createUser(userData)
    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '사용자 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}