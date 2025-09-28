import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { query } from '@/lib/mysql/connection'
import * as XLSX from 'xlsx'

// GET: 퀴즈 참여자 엑셀 다운로드
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      )
    }

    // 모든 퀴즈 참여자 데이터 조회
    const participants = await query(`
      SELECT 
        u.name as '이름',
        u.phone as '전화번호',
        u.gender as '성별',
        u.birth_date as '생년월일',
        qep.quiz_version as '퀴즈버전',
        CASE WHEN qep.perfect_score = 1 THEN '만점' ELSE '일반' END as '점수구분',
        qep.total_questions as '총문제수',
        qep.correct_answers as '정답수',
        CONCAT(
          FLOOR(qep.completion_time / 60), '분 ',
          qep.completion_time % 60, '초'
        ) as '완료시간',
        qep.ip_address as 'IP주소',
        DATE_FORMAT(qep.participated_at, '%Y-%m-%d %H:%i:%s') as '참여일시'
      FROM quiz_event_participants qep
      JOIN users u ON qep.user_id = u.id
      ORDER BY qep.participated_at DESC
    `)

    // 통계 데이터
    const totalParticipants = participants.length
    const perfectScoreCount = participants.filter((p: any) => p['점수구분'] === '만점').length
    const averageTime = participants.reduce((sum: number, p: any) => {
      const timeStr = p['완료시간']
      const minutes = parseInt(timeStr.split('분')[0])
      const seconds = parseInt(timeStr.split(' ')[1].split('초')[0])
      return sum + (minutes * 60 + seconds)
    }, 0) / totalParticipants

    const statsData = [
      { '항목': '총 참여자 수', '값': totalParticipants },
      { '항목': '만점자 수', '값': perfectScoreCount },
      { '항목': '만점 비율', '값': `${((perfectScoreCount / totalParticipants) * 100).toFixed(1)}%` },
      { '항목': '평균 완료시간', '값': `${Math.floor(averageTime / 60)}분 ${Math.round(averageTime % 60)}초` }
    ]

    // 일별 참여 통계
    const dailyStats = participants.reduce((acc: any, p: any) => {
      const date = p['참여일시'].split(' ')[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {})

    const dailyStatsData = Object.entries(dailyStats)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({
        '날짜': date,
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
      { wch: 10 }, // 퀴즈버전
      { wch: 10 }, // 점수구분
      { wch: 10 }, // 총문제수
      { wch: 10 }, // 정답수
      { wch: 12 }, // 완료시간
      { wch: 15 }, // IP주소
      { wch: 20 }  // 참여일시
    ]

    XLSX.utils.book_append_sheet(workbook, mainWorksheet, '퀴즈참여자목록')

    // 통계 시트
    const statsWorksheet = XLSX.utils.json_to_sheet(statsData)
    statsWorksheet['!cols'] = [{ wch: 20 }, { wch: 15 }]
    XLSX.utils.book_append_sheet(workbook, statsWorksheet, '전체통계')

    // 일별 통계 시트
    const dailyStatsWorksheet = XLSX.utils.json_to_sheet(dailyStatsData)
    dailyStatsWorksheet['!cols'] = [{ wch: 12 }, { wch: 10 }]
    XLSX.utils.book_append_sheet(workbook, dailyStatsWorksheet, '일별통계')

    // 엑셀 파일 생성
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx',
      compression: true
    })

    // 파일명 생성
    const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '')
    const filename = `퀴즈참여자목록_${timestamp}.xlsx`

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
    console.error('Export quiz participants error:', error)
    return NextResponse.json(
      { success: false, error: '엑셀 다운로드 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}