import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser, checkUserRole } from '@/lib/mysql/server'
import { getAllUsers } from '@/lib/services/users-service'
import * as XLSX from 'xlsx'

// POST: 사용자 목록 엑셀 내보내기
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
    const { users, filters } = body

    // 데이터베이스에서 최신 데이터 가져오기 (보안상 클라이언트 데이터보다 서버 데이터 우선)
    const dbUsers = await getAllUsers()

    // 엑셀용 데이터 변환
    const excelData = dbUsers.map((user, index) => ({
      '번호': index + 1,
      '이름': user.name,
      '사용자명': user.username,
      '소속': user.company || '',
      '연락처': user.phone,
      '성별': user.gender === 'male' ? '남성' : user.gender === 'female' ? '여성' : '비공개',
      '생년월일': user.birth_date,
      '나이': new Date().getFullYear() - new Date(user.birth_date).getFullYear(),
      '권한': user.role === 'admin' ? '관리자' : user.role === 'editor' ? '편집자' : '일반회원',
      '가입일': formatDateForExcel(user.created_at),
      '최근 로그인': user.last_login_at ? formatDateForExcel(user.last_login_at) : '',
      '최근 활동': user.last_activity_at ? formatDateForExcel(user.last_activity_at) : '',
      '정보 수정일': formatDateForExcel(user.updated_at)
    }))

    // 통계 데이터 생성
    const stats = {
      '전체 회원 수': dbUsers.length,
      '관리자': dbUsers.filter(u => u.role === 'admin').length,
      '편집자': dbUsers.filter(u => u.role === 'editor').length,
      '일반회원': dbUsers.filter(u => u.role === 'user').length,
      '남성': dbUsers.filter(u => u.gender === 'male').length,
      '여성': dbUsers.filter(u => u.gender === 'female').length,
      '성별 비공개': dbUsers.filter(u => u.gender === 'none').length,
    }

    const now = new Date()
    const newThisMonth = dbUsers.filter(user => {
      const userDate = new Date(user.created_at)
      return (now.getTime() - userDate.getTime()) <= (30 * 24 * 60 * 60 * 1000)
    }).length

    stats['신규 가입 (최근 1개월)'] = newThisMonth

    // 통계 시트용 데이터 변환
    const statsData = Object.entries(stats).map(([key, value]) => ({
      '항목': key,
      '수치': value
    }))

    // 워크북 생성
    const workbook = XLSX.utils.book_new()

    // 회원 목록 시트 생성
    const usersWorksheet = XLSX.utils.json_to_sheet(excelData)
    
    // 컬럼 너비 설정
    const usersColWidths = [
      { wch: 8 },   // 번호
      { wch: 12 },  // 이름
      { wch: 15 },  // 사용자명
      { wch: 20 },  // 소속
      { wch: 15 },  // 연락처
      { wch: 8 },   // 성별
      { wch: 12 },  // 생년월일
      { wch: 8 },   // 나이
      { wch: 10 },  // 권한
      { wch: 20 },  // 가입일
      { wch: 20 },  // 최근 로그인
      { wch: 20 },  // 최근 활동
      { wch: 20 }   // 정보 수정일
    ]
    usersWorksheet['!cols'] = usersColWidths

    // 통계 시트 생성
    const statsWorksheet = XLSX.utils.json_to_sheet(statsData)
    const statsColWidths = [
      { wch: 25 },  // 항목
      { wch: 15 }   // 수치
    ]
    statsWorksheet['!cols'] = statsColWidths

    // 시트를 워크북에 추가
    XLSX.utils.book_append_sheet(workbook, usersWorksheet, '회원 목록')
    XLSX.utils.book_append_sheet(workbook, statsWorksheet, '통계')

    // 메타데이터 시트 생성
    const metaData = [
      { '항목': '추출일시', '내용': new Date().toLocaleString('ko-KR') },
      { '항목': '추출자', '내용': currentUser.name },
      { '항목': '필터 조건', '내용': filters ? JSON.stringify(filters, null, 2) : '전체' },
      { '항목': '총 데이터 수', '내용': excelData.length }
    ]
    const metaWorksheet = XLSX.utils.json_to_sheet(metaData)
    metaWorksheet['!cols'] = [{ wch: 15 }, { wch: 30 }]
    XLSX.utils.book_append_sheet(workbook, metaWorksheet, '메타데이터')

    // 엑셀 파일 생성
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx',
      compression: true
    })

    // 파일명 생성
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `회원목록_${timestamp}.xlsx`

    // 응답 헤더 설정
    const headers = new Headers()
    headers.set('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`)
    headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    headers.set('Content-Length', excelBuffer.length.toString())

    return new NextResponse(excelBuffer, {
      status: 200,
      headers
    })

  } catch (error) {
    console.error('Error exporting excel:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '엑셀 내보내기에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// 날짜 포맷팅 함수
function formatDateForExcel(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch (error) {
    return dateString
  }
}

// GET: 내보내기 가능 여부 확인
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

    // 총 사용자 수 확인
    const users = await getAllUsers()
    
    return NextResponse.json({
      canExport: true,
      totalUsers: users.length,
      maxExportLimit: 10000, // 최대 내보내기 제한
      formats: ['xlsx'],
      estimatedFileSize: `${Math.round(users.length * 0.5)}KB` // 대략적인 파일 크기
    })

  } catch (error) {
    console.error('Error checking export availability:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '내보내기 가능 여부 확인에 실패했습니다.' },
      { status: 500 }
    )
  }
}