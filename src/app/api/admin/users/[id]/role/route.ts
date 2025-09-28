import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, checkUserRole } from '@/lib/mysql/server'
import { getUserById, updateUserRole, getAdminCount } from '@/lib/services/users-service'
import { Role } from '@/types/auth'

interface RouteParams {
  params: Promise<{ id: string }>
}


// PATCH: 사용자 역할 변경
export async function PATCH(request: NextRequest, { params }: RouteParams) {
   const { id } = (await params) as { id: string }
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
    const { role } = body

    // 역할 유효성 검증
    const validRoles: Role[] = ['admin', 'editor', 'user']
    if (!role || !validRoles.includes(role)) {
      return NextResponse.json({ error: '유효하지 않은 역할입니다.' }, { status: 400 })
    }

    // 사용자 존재 확인
    const existingUser = await getUserById(id)
    if (!existingUser) {
      return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 })
    }

    // 자기 자신의 관리자 권한을 제거하려는 시도 방지
    if (currentUser.id === id && existingUser.role === 'admin' && role !== 'admin') {
      return NextResponse.json({
        error: '자신의 관리자 권한을 제거할 수 없습니다.'
      }, { status: 400 })
    }

    // 이미 같은 역할인 경우
    if (existingUser.role === role) {
      return NextResponse.json({
        message: '이미 해당 역할을 가지고 있습니다.',
        user: existingUser
      })
    }

    const updatedUser = await updateUserRole(id, role)

    return NextResponse.json({
      message: `${existingUser.name}님의 역할이 ${role}(으)로 변경되었습니다.`,
      user: updatedUser,
      previousRole: existingUser.role,
      newRole: role
    })
  } catch (error) {
    console.error('Error updating user role:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '사용자 역할 변경에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// GET: 역할 변경 가능 여부 확인
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = (await params) as { id: string }
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

    // 사용자 존재 확인
    const existingUser = await getUserById(id)
    if (!existingUser) {
      return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 })
    }

    // 변경 가능한 역할 목록 계산
    let availableRoles: Role[] = ['admin', 'editor', 'user']
    let canChangeRole = true
    let restrictions: string[] = []

    // 자기 자신인 경우
    if (currentUser.id === id) {
      if (existingUser.role === 'admin') {
        availableRoles = ['admin'] // 자신의 관리자 권한은 제거 불가
        canChangeRole = false
        restrictions.push('자신의 관리자 권한을 제거할 수 없습니다.')
      }
    }

    // 마지막 관리자인 경우
    if (existingUser.role === 'admin') {
      const adminCount = await getAdminCount()
      if (adminCount <= 1) {
        availableRoles = ['admin'] // 마지막 관리자는 권한 변경 불가
        canChangeRole = false
        restrictions.push('마지막 관리자의 권한을 변경할 수 없습니다.')
      }
    }

    return NextResponse.json({
      currentRole: existingUser.role,
      availableRoles,
      canChangeRole,
      restrictions,
      user: {
        id: existingUser.id,
        name: existingUser.name,
        role: existingUser.role
      }
    })
  } catch (error) {
    console.error('Error checking role change availability:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '역할 변경 가능 여부 확인에 실패했습니다.' },
      { status: 500 }
    )
  }
}