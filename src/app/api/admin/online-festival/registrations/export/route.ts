import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { query } from '@/lib/mysql/connection'
import * as XLSX from 'xlsx'

// GET: 사전접수 엑셀 다운로드
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      )
    }

    // 모든 사전접수 데이터 조회
    const registrations = await query(`
      SELECT 
        r.registration_number as '신청번호',
        u.name as '이름',
        u.phone as '전화번호',
        u.gender as '성별',
        u.birth_date as '생년월일',
        CASE r.participant_type
          WHEN 'citizen' THEN '일반시민'
          WHEN 'single-parent' THEN '한부모가족'
          WHEN 'self-help' THEN '자조모임'
          WHEN 'volunteer' THEN '자원봉사자'
          WHEN 'organization' THEN '유관기관'
          ELSE r.participant_type
        END as '참여유형',
        r.companions as '동반자수',
        r.companion_details as '동반자정보',
        r.address as '주소',
        r.address_detail as '상세주소',
        r.zip_code as '우편번호',
        r.special_requests as '특별요청사항',
        CASE WHEN r.marketing_consent = 1 THEN 'Y' ELSE 'N' END as '마케팅수신동의',
        CASE WHEN r.privacy_consent = 1 THEN 'Y' ELSE 'N' END as '개인정보수집동의',
        CASE r.status
          WHEN 'confirmed' THEN '확정'
          WHEN 'pending' THEN '대기'
          WHEN 'cancelled' THEN '취소'
          ELSE r.status
        END as '상태',
        DATE_FORMAT(r.created_at, '%Y-%m-%d %H:%i:%s') as '신청일시'
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `)

    // 통계 데이터 추가
    const statsData = [
      { '항목': '총 신청자 수', '값': registrations.length },
      { '항목': '총 참가 예상 인원', '값': registrations.reduce((sum: number, reg: any) => sum + 1 + (reg['동반자수'] || 0), 0) },
      { '항목': '확정된 신청', '값': registrations.filter((reg: any) => reg['상태'] === '확정').length },
      { '항목': '대기 중인 신청', '값': registrations.filter((reg: any) => reg['상태'] === '대기').length }
    ]

    // 참여유형별 통계
    const typeStats = registrations.reduce((acc: any, reg: any) => {
      const type = reg['참여유형']
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})

    const typeStatsData = Object.entries(typeStats).map(([type, count]) => ({
      '참여유형': type,
      '신청자수': count
    }))

    // 워크북 생성
    const workbook = XLSX.utils.book_new()

    // 메인 데이터 시트
    const mainWorksheet = XLSX.utils.json_to_sheet(registrations)
    
    // 컬럼 너비 설정
    mainWorksheet['!cols'] = [
      { wch: 15 }, // 신청번호
      { wch: 10 }, // 이름
      { wch: 15 }, // 전화번호
      { wch: 8 },  // 성별
      { wch: 12 }, // 생년월일
      { wch: 12 }, // 참여유형
      { wch: 10 }, // 동반자수
      { wch: 30 }, // 동반자정보
      { wch: 25 }, // 주소
      { wch: 20 }, // 상세주소
      { wch: 10 }, // 우편번호
      { wch: 25 }, // 특별요청사항
      { wch: 12 }, // 마케팅수신동의
      { wch: 15 }, // 개인정보수집동의
      { wch: 8 },  // 상태
      { wch: 20 }  // 신청일시
    ]

    XLSX.utils.book_append_sheet(workbook, mainWorksheet, '사전접수목록')

    // 통계 시트
    const statsWorksheet = XLSX.utils.json_to_sheet(statsData)
    statsWorksheet['!cols'] = [{ wch: 20 }, { wch: 15 }]
    XLSX.utils.book_append_sheet(workbook, statsWorksheet, '전체통계')

    // 참여유형별 통계 시트
    const typeStatsWorksheet = XLSX.utils.json_to_sheet(typeStatsData)
    typeStatsWorksheet['!cols'] = [{ wch: 15 }, { wch: 10 }]
    XLSX.utils.book_append_sheet(workbook, typeStatsWorksheet, '참여유형별통계')

    // 엑셀 파일 생성
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx',
      compression: true
    })

    // 파일명 생성
    const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '')
    const filename = `사전접수목록_${timestamp}.xlsx`

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
    console.error('Export registrations error:', error)
    return NextResponse.json(
      { success: false, error: '엑셀 다운로드 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}