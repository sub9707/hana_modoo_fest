import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, checkUserRole } from '@/lib/mysql/server'
import { getUserById, updateUser, deleteUser, UpdateUserData } from '@/lib/users-service'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET: 특정 사용자 정보 조회
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
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

    const user = await getUserById(id)
    if (!user) {
      return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '사용자 정보를 가져오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// PUT: 사용자 정보 업데이트
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
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
    const { name, company, gender, birth_date, phone, role } = body

    // 입력 데이터 검증
    if (!name || !gender || !birth_date || !phone || !role) {
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

    // 자기 자신의 관리자 권한을 제거하려는 시도 방지
    if (currentUser.id === id && role !== 'admin') {
      return NextResponse.json({ 
        error: '자신의 관리자 권한을 제거할 수 없습니다.' 
      }, { status: 400 })
    }

    const userData: UpdateUserData = {
      name,
      company,
      gender,
      birth_date,
      phone,
      role
    }

    const updatedUser = await updateUser(id, userData)
    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '사용자 정보 업데이트에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// DELETE: 사용자 삭제
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params
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

    // 자기 자신을 삭제하려는 시도 방지
    if (currentUser.id === id) {
      return NextResponse.json({ 
        error: '자신의 계정을 삭제할 수 없습니다.' 
      }, { status: 400 })
    }

    await deleteUser(id)
    return NextResponse.json({ message: '사용자가 성공적으로 삭제되었습니다.' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '사용자 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
}