import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { query } from '@/lib/mysql/connection'
import * as XLSX from 'xlsx'

// GET: 랜덤이벤트 당첨자 엑셀 다운로드
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      )
    }

    // 모든 당첨자 데이터 조회
    const winners = await query(`
      SELECT 
        u.name as '당첨자',
        u.phone as '전화번호',
        u.gender as '성별',
        u.birth_date as '생년월일',
        p.name as '상품명',
        p.value as '상품가치',
        CASE WHEN ew.is_claimed = 1 THEN '수령완료' ELSE '수령대기' END as '수령상태',
        DATE_FORMAT(ew.won_at, '%Y-%m-%d %H:%i:%s') as '당첨일시',
        CASE 
          WHEN ew.claimed_at IS NOT NULL THEN DATE_FORMAT(ew.claimed_at, '%Y-%m-%d %H:%i:%s')
          ELSE ''
        END as '수령일시',
        COALESCE(ew.notes, '') as '관리자메모'
      FROM event_winners ew
      JOIN users u ON ew.user_id = u.id
      JOIN prizes p ON ew.prize_id = p.id
      ORDER BY ew.won_at DESC
    `)

    // 수령 완료자만 별도 추출
    const claimedWinners = winners.filter((w: any) => w['수령상태'] === '수령완료')

    // 통계 데이터
    const totalWinners = winners.length
    const claimedCount = claimedWinners.length
    const unclaimedCount = totalWinners - claimedCount
    const totalValue = winners.reduce((sum: number, w: any) => sum + (w['상품가치'] || 0), 0)

    const statsData = [
      { '항목': '총 당첨자 수', '값': totalWinners },
      { '항목': '수령 완료', '값': claimedCount },
      { '항목': '수령 대기', '값': unclaimedCount },
      { '항목': '수령 완료율', '값': totalWinners > 0 ? `${((claimedCount / totalWinners) * 100).toFixed(1)}%` : '0%' },
      { '항목': '총 상품 가치', '값': `${totalValue.toLocaleString()}원` }
    ]

    // 상품별 당첨 통계
    const prizeStats = winners.reduce((acc: any, w: any) => {
      const prizeName = w['상품명']
      if (!acc[prizeName]) {
        acc[prizeName] = { 
          total: 0, 
          claimed: 0, 
          value: w['상품가치'] || 0,
          totalValue: 0 
        }
      }
      acc[prizeName].total += 1
      acc[prizeName].totalValue += w['상품가치'] || 0
      if (w['수령상태'] === '수령완료') {
        acc[prizeName].claimed += 1
      }
      return acc
    }, {})

    const prizeStatsData = Object.entries(prizeStats).map(([prize, stats]: [string, any]) => ({
      '상품명': prize,
      '총당첨수': stats.total,
      '수령완료수': stats.claimed,
      '수령대기수': stats.total - stats.claimed,
      '수령완료율': stats.total > 0 ? `${((stats.claimed / stats.total) * 100).toFixed(1)}%` : '0%',
      '단위가치': `${stats.value.toLocaleString()}원`,
      '총가치': `${stats.totalValue.toLocaleString()}원`
    }))

    // 일별 당첨 통계
    const dailyStats = winners.reduce((acc: any, w: any) => {
      const date = w['당첨일시'].split(' ')[0]
      if (!acc[date]) acc[date] = { total: 0, claimed: 0 }
      acc[date].total += 1
      if (w['수령상태'] === '수령완료') acc[date].claimed += 1
      return acc
    }, {})

    const dailyStatsData = Object.entries(dailyStats)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, stats]: [string, any]) => ({
        '날짜': date,
        '당첨자수': stats.total,
        '수령완료수': stats.claimed,
        '수령대기수': stats.total - stats.claimed
      }))

    // 워크북 생성
    const workbook = XLSX.utils.book_new()

    // 1. 전체 당첨자 목록 시트
    const allWinnersWorksheet = XLSX.utils.json_to_sheet(winners)
    allWinnersWorksheet['!cols'] = [
      { wch: 10 }, // 당첨자
      { wch: 15 }, // 전화번호
      { wch: 8 },  // 성별
      { wch: 12 }, // 생년월일
      { wch: 20 }, // 상품명
      { wch: 12 }, // 상품가치
      { wch: 10 }, // 수령상태
      { wch: 20 }, // 당첨일시
      { wch: 20 }, // 수령일시
      { wch: 30 }  // 관리자메모
    ]
    XLSX.utils.book_append_sheet(workbook, allWinnersWorksheet, '전체당첨자목록')

    // 2. 수령 완료자만 별도 시트
    if (claimedWinners.length > 0) {
      const claimedWorksheet = XLSX.utils.json_to_sheet(claimedWinners)
      claimedWorksheet['!cols'] = allWinnersWorksheet['!cols']
      XLSX.utils.book_append_sheet(workbook, claimedWorksheet, '수령완료자목록')
    }

    // 3. 통계 시트
    const statsWorksheet = XLSX.utils.json_to_sheet(statsData)
    statsWorksheet['!cols'] = [{ wch: 20 }, { wch: 15 }]
    XLSX.utils.book_append_sheet(workbook, statsWorksheet, '전체통계')

    // 4. 상품별 통계 시트
    const prizeStatsWorksheet = XLSX.utils.json_to_sheet(prizeStatsData)
    prizeStatsWorksheet['!cols'] = [
      { wch: 20 }, // 상품명
      { wch: 10 }, // 총당첨수
      { wch: 12 }, // 수령완료수
      { wch: 12 }, // 수령대기수
      { wch: 12 }, // 수령완료율
      { wch: 12 }, // 단위가치
      { wch: 15 }  // 총가치
    ]
    XLSX.utils.book_append_sheet(workbook, prizeStatsWorksheet, '상품별통계')

    // 5. 일별 통계 시트
    const dailyStatsWorksheet = XLSX.utils.json_to_sheet(dailyStatsData)
    dailyStatsWorksheet['!cols'] = [{ wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 12 }]
    XLSX.utils.book_append_sheet(workbook, dailyStatsWorksheet, '일별통계')

    // 엑셀 파일 생성
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx',
      compression: true
    })

    // 파일명 생성
    const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '')
    const filename = `랜덤이벤트당첨자목록_${timestamp}.xlsx`

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
    console.error('Export winners error:', error)
    return NextResponse.json(
      { success: false, error: '엑셀 다운로드 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}