import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql/connection'
import * as XLSX from 'xlsx'

export async function GET(request: NextRequest) {
  try {
    // 모든 참여자 데이터 조회
    const participants = await query(`
      SELECT 
        u.name as '이름',
        u.username as '사용자명',
        u.company as '소속',
        u.phone as '전화번호',
        qep.quiz_version as '퀴즈버전',
        qep.correct_answers as '정답수',
        qep.total_questions as '총문제수',
        ROUND(qep.correct_answers / qep.total_questions * 100, 1) as '정답률(%)',
        CONCAT(
          FLOOR(qep.completion_time / 60), '분 ', 
          (qep.completion_time % 60), '초'
        ) as '완료시간',
        DATE_FORMAT(qep.participated_at, '%Y-%m-%d %H:%i:%s') as '참여일시',
        qep.ip_address as 'IP주소'
      FROM quiz_event_participants qep
      JOIN users u ON qep.user_id = u.id
      ORDER BY qep.participated_at DESC
    `)

    if (participants.length === 0) {
      return NextResponse.json(
        { success: false, message: '내보낼 데이터가 없습니다.' },
        { status: 404 }
      )
    }

    // 엑셀 워크북 생성
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(participants)

    // 컬럼 너비 설정
    const columnWidths = [
      { wch: 12 }, // 이름
      { wch: 15 }, // 사용자명
      { wch: 20 }, // 소속
      { wch: 15 }, // 전화번호
      { wch: 10 }, // 퀴즈버전
      { wch: 8 },  // 정답수
      { wch: 8 },  // 총문제수
      { wch: 10 }, // 정답률
      { wch: 12 }, // 완료시간
      { wch: 20 }, // 참여일시
      { wch: 15 }  // IP주소
    ]
    worksheet['!cols'] = columnWidths

    XLSX.utils.book_append_sheet(workbook, worksheet, '퀴즈 참여자')

    // 엑셀 파일 생성
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    // 파일명 생성 (한국 시간 기준)
    const now = new Date()
    const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000))
    const fileName = `퀴즈참여자목록_${koreaTime.toISOString().split('T')[0]}.xlsx`

    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
        'Content-Length': excelBuffer.length.toString(),
      },
    })

  } catch (error) {
    console.error('엑셀 내보내기 오류:', error)
    return NextResponse.json(
      { success: false, message: '엑셀 파일 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}