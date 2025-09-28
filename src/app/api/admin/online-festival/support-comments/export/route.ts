import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { query } from '@/lib/mysql/connection'
import * as XLSX from 'xlsx'

// GET: 응원댓글 엑셀 다운로드 (참여자 정보와 댓글 내용 포함)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      )
    }

    // 모든 응원댓글 데이터 조회 (참여자 정보 포함)
    const comments = await query(`
      SELECT 
        u.name as '작성자',
        u.phone as '전화번호',
        u.gender as '성별',
        u.birth_date as '생년월일',
        sc.message as '댓글내용',
        sc.likes as '좋아요수',
        DATE_FORMAT(sc.created_at, '%Y-%m-%d %H:%i:%s') as '작성일시'
      FROM support_comments sc
      JOIN users u ON sc.user_id = u.id
      ORDER BY sc.created_at DESC
    `)

    // 참여자별 댓글 요약 통계
    const participantSummary = await query(`
      SELECT 
        u.name as '작성자',
        u.phone as '전화번호',
        u.gender as '성별',
        u.birth_date as '생년월일',
        COUNT(sc.id) as '총댓글수',
        SUM(sc.likes) as '총좋아요수',
        MIN(DATE_FORMAT(sc.created_at, '%Y-%m-%d %H:%i:%s')) as '최초작성일시',
        MAX(DATE_FORMAT(sc.created_at, '%Y-%m-%d %H:%i:%s')) as '최근작성일시',
        GROUP_CONCAT(
          CONCAT('[', DATE_FORMAT(sc.created_at, '%m/%d %H:%i'), '] ', 
          LEFT(sc.message, 30), 
          CASE WHEN LENGTH(sc.message) > 30 THEN '...' ELSE '' END)
          ORDER BY sc.created_at DESC 
          SEPARATOR ' | '
        ) as '댓글요약'
      FROM support_comments sc
      JOIN users u ON sc.user_id = u.id
      GROUP BY sc.user_id, u.name, u.phone, u.gender, u.birth_date
      ORDER BY COUNT(sc.id) DESC, MAX(sc.created_at) DESC
    `)

    // 통계 데이터
    const totalComments = comments.length
    const totalParticipants = participantSummary.length
    const totalLikes = comments.reduce((sum: number, c: any) => sum + (c['좋아요수'] || 0), 0)
    const averageCommentsPerParticipant = totalComments / totalParticipants
    const averageLikesPerComment = totalLikes / totalComments

    const statsData = [
      { '항목': '총 댓글 수', '값': totalComments },
      { '항목': '총 참여자 수', '값': totalParticipants },
      { '항목': '총 좋아요 수', '값': totalLikes },
      { '항목': '참여자당 평균 댓글 수', '값': averageCommentsPerParticipant.toFixed(1) },
      { '항목': '댓글당 평균 좋아요 수', '값': averageLikesPerComment.toFixed(1) }
    ]

    // 일별 댓글 통계
    const dailyStats = comments.reduce((acc: any, c: any) => {
      const date = c['작성일시'].split(' ')[0]
      if (!acc[date]) acc[date] = { count: 0, likes: 0 }
      acc[date].count += 1
      acc[date].likes += c['좋아요수'] || 0
      return acc
    }, {})

    const dailyStatsData = Object.entries(dailyStats)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, stats]: [string, any]) => ({
        '날짜': date,
        '댓글수': stats.count,
        '좋아요수': stats.likes
      }))

    // 워크북 생성
    const workbook = XLSX.utils.book_new()

    // 1. 전체 댓글 목록 시트
    const commentsWorksheet = XLSX.utils.json_to_sheet(comments)
    commentsWorksheet['!cols'] = [
      { wch: 10 }, // 작성자
      { wch: 15 }, // 전화번호
      { wch: 8 },  // 성별
      { wch: 12 }, // 생년월일
      { wch: 50 }, // 댓글내용
      { wch: 10 }, // 좋아요수
      { wch: 20 }  // 작성일시
    ]
    XLSX.utils.book_append_sheet(workbook, commentsWorksheet, '전체댓글목록')

    // 2. 참여자별 요약 시트
    const summaryWorksheet = XLSX.utils.json_to_sheet(participantSummary)
    summaryWorksheet['!cols'] = [
      { wch: 10 }, // 작성자
      { wch: 15 }, // 전화번호
      { wch: 8 },  // 성별
      { wch: 12 }, // 생년월일
      { wch: 10 }, // 총댓글수
      { wch: 12 }, // 총좋아요수
      { wch: 20 }, // 최초작성일시
      { wch: 20 }, // 최근작성일시
      { wch: 80 }  // 댓글요약
    ]
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, '참여자별요약')

    // 3. 통계 시트
    const statsWorksheet = XLSX.utils.json_to_sheet(statsData)
    statsWorksheet['!cols'] = [{ wch: 25 }, { wch: 15 }]
    XLSX.utils.book_append_sheet(workbook, statsWorksheet, '전체통계')

    // 4. 일별 통계 시트
    const dailyStatsWorksheet = XLSX.utils.json_to_sheet(dailyStatsData)
    dailyStatsWorksheet['!cols'] = [{ wch: 12 }, { wch: 10 }, { wch: 12 }]
    XLSX.utils.book_append_sheet(workbook, dailyStatsWorksheet, '일별통계')

    // 엑셀 파일 생성
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx',
      compression: true
    })

    // 파일명 생성
    const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '')
    const filename = `응원댓글목록_${timestamp}.xlsx`

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
    console.error('Export support comments error:', error)
    return NextResponse.json(
      { success: false, error: '엑셀 다운로드 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}