// src/app/api/admin/users/[id]/password-reset/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, checkUserRole } from '@/lib/mysql/server'
import { getUserById, updateUserPassword } from '@/lib/services/users-service'

interface RouteParams {
  params: Promise<{ id: string }>
}

// POST: 관리자가 사용자 비밀번호 초기화
export async function POST(request: NextRequest, { params }: RouteParams) {
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

    // 대상 사용자 확인
    const targetUser = await getUserById(id)
    if (!targetUser) {
      return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 })
    }

    // 자기 자신의 비밀번호는 초기화 불가
    if (currentUser.id === id) {
      return NextResponse.json({ 
        error: '자신의 비밀번호는 초기화할 수 없습니다.' 
      }, { status: 400 })
    }

    // 소셜 로그인 사용자는 비밀번호 초기화 불가
    if (targetUser.signup_method === 'naver' || targetUser.signup_method === 'kakao') {
      return NextResponse.json({ 
        error: '소셜 로그인 사용자는 비밀번호 초기화가 불가능합니다.' 
      }, { status: 400 })
    }

    // 전화번호에서 '-' 제거한 값을 새 비밀번호로 설정
    const newPassword = targetUser.phone.replace(/-/g, '')
    
    // 비밀번호가 너무 짧은 경우 체크
    if (newPassword.length < 8) {
      return NextResponse.json({ 
        error: '전화번호가 너무 짧아 비밀번호로 사용할 수 없습니다.' 
      }, { status: 400 })
    }
    
    await updateUserPassword(id, newPassword)

    return NextResponse.json({
      message: `${targetUser.name}님의 비밀번호가 전화번호로 초기화되었습니다.`,
      newPassword: newPassword, // 관리자에게만 표시용
      resetMethod: 'phone_number'
    })

  } catch (error) {
    console.error('Error resetting user password:', error)
    
    // DB 제약 조건 오류 처리
    if (error instanceof Error && error.message.includes('Data too long')) {
      return NextResponse.json(
        { error: '비밀번호 해시 생성 중 오류가 발생했습니다. 데이터베이스 설정을 확인해주세요.' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '비밀번호 초기화에 실패했습니다.' },
      { status: 500 }
    )
  }
}