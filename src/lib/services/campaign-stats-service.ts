import { queryOne } from '@/lib/mysql/connection'

export interface CampaignStats {
  /** 사전접수 신청 건수 (취소 포함 전체 접수) */
  preregistration_count: number
  /** 응원 댓글 수 */
  comment_count: number
  /** 가족주제 글짓기 작품 수 */
  writing_count: number
  /** 확정 신청자 + 동반 인원 */
  total_participants: number
  active_campaigns: number
}

const toInt = (value: unknown): number => {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0
}

/**
 * 캠페인 통계를 DB에서 직접 집계한다.
 * 홈(서버 컴포넌트)과 /api/campaign/stats 가 같은 함수를 쓰도록 해서
 * 숫자가 화면마다 달라지지 않게 한다.
 */
export async function getCampaignStats(): Promise<CampaignStats> {
  const row = await queryOne(`
    SELECT
      (SELECT COUNT(*) FROM registrations) AS preregistration_count,
      (SELECT COUNT(*) FROM registrations WHERE status = 'confirmed') AS confirmed_count,
      (SELECT COALESCE(SUM(companions), 0) FROM registrations WHERE status = 'confirmed') AS confirmed_companions,
      (SELECT COUNT(*) FROM support_comments) AS comment_count,
      (SELECT COUNT(*) FROM writings) AS writing_count
  `)

  return {
    preregistration_count: toInt(row?.preregistration_count),
    comment_count: toInt(row?.comment_count),
    writing_count: toInt(row?.writing_count),
    total_participants: toInt(row?.confirmed_count) + toInt(row?.confirmed_companions),
    active_campaigns: 3,
  }
}
