import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { query } from '@/lib/mysql/connection'
import * as XLSX from 'xlsx'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      )
    }

    // 우수작품 ID 목록 먼저 조회
    const featuredIdsQuery = `
      SELECT id
      FROM (
        SELECT 
          id,
          ROW_NUMBER() OVER (PARTITION BY topic ORDER BY likes_count DESC, created_at DESC) as rn
        FROM writings
        WHERE likes_count >= 1
      ) ranked
      WHERE rn <= 10
    `
    
    const featuredIdsResult = await query(featuredIdsQuery)
    const featuredIds = featuredIdsResult.map((row: any) => row.id)

    // 모든 가족주제글짓기 데이터 조회 (참여자 정보 포함)
    const allWritings = await query(`
      SELECT 
        w.id,
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
        DATE_FORMAT(w.created_at, '%Y-%m-%d %H:%i:%s') as '작성일시'
      FROM writings w
      JOIN users u ON w.user_id = u.id
      ORDER BY w.created_at DESC
    `)

    // 우수작품 여부 추가
    const writings = allWritings.map((w: any) => ({
      ...w,
      '우수작품여부': featuredIds.includes(w.id) ? '우수작품' : '일반'
    }))

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
      { '항목': '작품당 평균 좋아요', '값': averageLikesPerWriting.toFixed(1) },
      { '항목': '우수작품 선정 기준', '값': '각 주제별 좋아요 상위 10개 (좋아요 1개 이상)' }
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

    // 엑셀 워크북 생성
    const workbook = XLSX.utils.book_new()

    // 1. 통계 시트
    const statsSheet = XLSX.utils.json_to_sheet(statsData)
    XLSX.utils.book_append_sheet(workbook, statsSheet, '전체 통계')

    // 2. 주제별 통계 시트
    const topicStatsSheet = XLSX.utils.json_to_sheet(topicStatsData)
    XLSX.utils.book_append_sheet(workbook, topicStatsSheet, '주제별 통계')

    // id 필드 제거 후 엑셀 생성
    const writingsForExcel = writings.map(({ id, ...rest }: any) => rest)
    const featuredForExcel = featuredWritings.map(({ id, ...rest }: any) => rest)

    // 3. 전체 작품 목록
    const allWritingsSheet = XLSX.utils.json_to_sheet(writingsForExcel)
    XLSX.utils.book_append_sheet(workbook, allWritingsSheet, '전체 작품')

    // 4. 우수작품만
    if (featuredForExcel.length > 0) {
      const featuredSheet = XLSX.utils.json_to_sheet(featuredForExcel)
      XLSX.utils.book_append_sheet(workbook, featuredSheet, '우수 작품')
    }

    // 엑셀 파일 생성
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    // 응답 헤더 설정
    const fileName = `가족글짓기목록_${new Date().toISOString().split('T')[0]}.xlsx`
    
    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`,
      },
    })

  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { success: false, error: '엑셀 다운로드 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}