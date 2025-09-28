import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { query } from '@/lib/mysql/connection'
import * as XLSX from 'xlsx'

// GET: 가족주제글짓기 엑셀 다운로드 (참여자 정보와 글 내용 포함)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      )
    }

    // 모든 가족주제글짓기 데이터 조회 (참여자 정보 포함)
    const writings = await query(`
      SELECT 
        u.name as '작성자',
        u.phone as '전화번호',
        u.gender as '성별',
        u.birth_date as '생년월일',
        CASE w.topic
          WHEN '가족에게 전하고 싶은 말' THEN '전하고 싶은 말'
          WHEN '가족과 함께해서 즐거웠던 순간' THEN '즐거웠던 순간'
          ELSE w.topic
        END as '주제',
        w.title as '제목',
        w.content as '글내용',
        w.likes_count as '좋아요수',
        CASE WHEN w.is_featured = 1 THEN '우수작품' ELSE '일반' END as '우수작품여부',
        DATE_FORMAT(w.created_at, '%Y-%m-%d %H:%i:%s') as '작성일시'
      FROM writings w
      JOIN users u ON w.user_id = u.id
      ORDER BY w.is_featured DESC, w.created_at DESC
    `)

    // 우수작품만 별도 추출
    const featuredWritings = writings.filter((w: any) => w['우수작품여부'] === '우수작품')

    // 통계 데이터
    const totalWritings = writings.length
    const featuredCount = featuredWritings.length
    const totalLikes = writings.reduce((sum: number, w: any) => sum + (w['좋아요수'] || 0), 0)
    const averageLikesPerWriting = totalWritings > 0 ? totalLikes / totalWritings : 0

    const statsData = [
      { '항목': '총 작품 수', '값': totalWritings },
      { '항목': '우수작품 수', '값': featuredCount },
      { '항목': '우수작품 비율', '값': totalWritings > 0 ? `${((featuredCount / totalWritings) * 100).toFixed(1)}%` : '0%' },
      { '항목': '총 좋아요 수', '값': totalLikes },
      { '항목': '작품당 평균 좋아요', '값': averageLikesPerWriting.toFixed(1) }
    ]

    // 주제별 통계
    const topicStats = writings.reduce((acc: any, w: any) => {
      const topic = w['주제']
      if (!acc[topic]) acc[topic] = { count: 0, likes: 0, featured: 0 }
      acc[topic].count += 1
      acc[topic].likes += w['좋아요수'] || 0
      if (w['우수작품여부'] === '우수작품') acc[topic].featured += 1
      return acc
    }, {})

    const topicStatsData = Object.entries(topicStats).map(([topic, stats]: [string, any]) => ({
      '주제': topic,
      '작품수': stats.count,
      '총좋아요수': stats.likes,
      '우수작품수': stats.featured,
      '평균좋아요': stats.count > 0 ? (stats.likes / stats.count).toFixed(1) : '0'
    }))

    // 일별 작성 통계
    const dailyStats = writings.reduce((acc: any, w: any) => {
      const date = w['작성일시'].split(' ')[0]
      if (!acc[date]) acc[date] = { count: 0, likes: 0 }
      acc[date].count += 1
      acc[date].likes += w['좋아요수'] || 0
      return acc
    }, {})

    const dailyStatsData = Object.entries(dailyStats)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, stats]: [string, any]) => ({
        '날짜': date,
        '작품수': stats.count,
        '좋아요수': stats.likes
      }))

    // 워크북 생성
    const workbook = XLSX.utils.book_new()

    // 1. 전체 작품 목록 시트
    const allWritingsWorksheet = XLSX.utils.json_to_sheet(writings)
    allWritingsWorksheet['!cols'] = [
      { wch: 10 }, // 작성자
      { wch: 15 }, // 전화번호
      { wch: 8 },  // 성별
      { wch: 12 }, // 생년월일
      { wch: 15 }, // 주제
      { wch: 30 }, // 제목
      { wch: 60 }, // 글내용
      { wch: 10 }, // 좋아요수
      { wch: 12 }, // 우수작품여부
      { wch: 20 }  // 작성일시
    ]
    XLSX.utils.book_append_sheet(workbook, allWritingsWorksheet, '전체작품목록')

    // 2. 우수작품만 별도 시트
    if (featuredWritings.length > 0) {
      const featuredWorksheet = XLSX.utils.json_to_sheet(featuredWritings)
      featuredWorksheet['!cols'] = allWritingsWorksheet['!cols']
      XLSX.utils.book_append_sheet(workbook, featuredWorksheet, '우수작품목록')
    }

    // 3. 통계 시트
    const statsWorksheet = XLSX.utils.json_to_sheet(statsData)
    statsWorksheet['!cols'] = [{ wch: 20 }, { wch: 15 }]
    XLSX.utils.book_append_sheet(workbook, statsWorksheet, '전체통계')

    // 4. 주제별 통계 시트
    const topicStatsWorksheet = XLSX.utils.json_to_sheet(topicStatsData)
    topicStatsWorksheet['!cols'] = [{ wch: 15 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 12 }]
    XLSX.utils.book_append_sheet(workbook, topicStatsWorksheet, '주제별통계')

    // 5. 일별 통계 시트
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
    const filename = `가족글짓기목록_${timestamp}.xlsx`

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
    console.error('Export writings error:', error)
    return NextResponse.json(
      { success: false, error: '엑셀 다운로드 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}