import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { query } from '@/lib/mysql/connection'
import * as XLSX from 'xlsx'

// GET: 응원댓글 참여자 엑셀 다운로드
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      )
    }

    // 모든 응원댓글 참여자 데이터 조회 (중복 제거)
    const participants = await query(`
      SELECT 
        u.name as '이름',
        u.phone as '전화번호',
        u.gender as '성별',
        u.birth_date as '생년월일',
        COUNT(sc.id) as '댓글수',
        SUM(sc.likes) as '총좋아요수',
        MIN(DATE_FORMAT(sc.created_at, '%Y-%m-%d %H:%i:%s')) as '최초댓글일시',
        MAX(DATE_FORMAT(sc.created_at, '%Y-%m-%d %H:%i:%s')) as '최근댓글일시'
      FROM support_comments sc
      JOIN users u ON sc.user_id = u.id
      GROUP BY sc.user_id, u.name, u.phone, u.gender, u.birth_date
      ORDER BY MAX(sc.created_at) DESC
    `)

    // 통계 데이터
    const totalParticipants = participants.length
    const totalComments = participants.reduce((sum: number, p: any) => sum + p['댓글수'], 0)
    const totalLikes = participants.reduce((sum: number, p: any) => sum + (p['총좋아요수'] || 0), 0)
    const averageCommentsPerParticipant = totalComments / totalParticipants

    const statsData = [
      { '항목': '총 참여자 수', '값': totalParticipants },
      { '항목': '총 댓글 수', '값': totalComments },
      { '항목': '총 좋아요 수', '값': totalLikes },
      { '항목': '참여자당 평균 댓글 수', '값': averageCommentsPerParticipant.toFixed(1) },
      { '항목': '댓글당 평균 좋아요 수', '값': (totalLikes / totalComments).toFixed(1) }
    ]

    // 댓글 활동도별 분류
    const activityLevels = participants.reduce((acc: any, p: any) => {
      const commentCount = p['댓글수']
      if (commentCount >= 10) acc['매우활발(10개이상)'] = (acc['매우활발(10개이상)'] || 0) + 1
      else if (commentCount >= 5) acc['활발(5-9개)'] = (acc['활발(5-9개)'] || 0) + 1
      else if (commentCount >= 2) acc['보통(2-4개)'] = (acc['보통(2-4개)'] || 0) + 1
      else acc['적음(1개)'] = (acc['적음(1개)'] || 0) + 1
      return acc
    }, {})

    const activityData = Object.entries(activityLevels).map(([level, count]) => ({
      '활동도': level,
      '참여자수': count
    }))

    // 워크북 생성
    const workbook = XLSX.utils.book_new()

    // 메인 데이터 시트
    const mainWorksheet = XLSX.utils.json_to_sheet(participants)
    
    // 컬럼 너비 설정
    mainWorksheet['!cols'] = [
      { wch: 10 }, // 이름
      { wch: 15 }, // 전화번호
      { wch: 8 },  // 성별
      { wch: 12 }, // 생년월일
      { wch: 10 }, // 댓글수
      { wch: 12 }, // 총좋아요수
      { wch: 20 }, // 최초댓글일시
      { wch: 20 }  // 최근댓글일시
    ]

    XLSX.utils.book_append_sheet(workbook, mainWorksheet, '응원댓글참여자목록')

    // 통계 시트
    const statsWorksheet = XLSX.utils.json_to_sheet(statsData)
    statsWorksheet['!cols'] = [{ wch: 25 }, { wch: 15 }]
    XLSX.utils.book_append_sheet(workbook, statsWorksheet, '전체통계')

    // 활동도별 통계 시트
    const activityWorksheet = XLSX.utils.json_to_sheet(activityData)
    activityWorksheet['!cols'] = [{ wch: 20 }, { wch: 12 }]
    XLSX.utils.book_append_sheet(workbook, activityWorksheet, '활동도별통계')

    // 엑셀 파일 생성
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx',
      compression: true
    })

    // 파일명 생성
    const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '')
    const filename = `응원댓글참여자목록_${timestamp}.xlsx`

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
    console.error('Export support comment participants error:', error)
    return NextResponse.json(
      { success: false, error: '엑셀 다운로드 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}