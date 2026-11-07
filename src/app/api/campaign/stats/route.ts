import { NextResponse } from 'next/server'
import { getCampaignStats } from '@/lib/services/campaign-stats-service'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = await getCampaignStats()
    return NextResponse.json(
      { success: true, data, timestamp: new Date().toISOString() },
      { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } }
    )
  } catch (error) {
    console.error('캠페인 통계 조회 오류:', error)
    return NextResponse.json(
      { success: false, error: '통계를 불러오지 못했습니다.' },
      { status: 500 }
    )
  }
}
