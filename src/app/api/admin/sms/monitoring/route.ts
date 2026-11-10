import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/mysql/connection'
import { createSensClient } from '@/lib/sens/client'

// 관리자 권한 확인
async function checkAdminAuth(request: NextRequest): Promise<{ authorized: boolean; user?: any }> {
  const sessionToken = request.cookies.get('session-token')?.value
  
  if (!sessionToken) {
    return { authorized: false }
  }

  const user = await queryOne(
    `SELECT id, role FROM users 
     WHERE session_token = ? AND session_expires_at > NOW()`,
    [sessionToken]
  )

  if (!user || user.role !== 'admin') {
    return { authorized: false }
  }

  return { authorized: true, user }
}

// SMS 발송 통계 조회
export async function GET(request: NextRequest) {
  try {
    const authCheck = await checkAdminAuth(request)
    if (!authCheck.authorized) {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '7d' // 7d, 30d, 90d
    const type = searchParams.get('type') || 'summary' // summary, detailed, failed

    let dateCondition = ''
    switch (period) {
      case '1d':
        dateCondition = 'DATE(created_at) = CURDATE()'
        break
      case '7d':
        dateCondition = 'created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
        break
      case '30d':
        dateCondition = 'created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)'
        break
      case '90d':
        dateCondition = 'created_at >= DATE_SUB(NOW(), INTERVAL 90 DAY)'
        break
      default:
        dateCondition = 'created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
    }

    let result: any = {}

    if (type === 'summary') {
      // 요약 통계
      result = await getSummaryStats(dateCondition)
    } else if (type === 'detailed') {
      // 상세 통계
      result = await getDetailedStats(dateCondition)
    } else if (type === 'failed') {
      // 실패한 발송 목록
      result = await getFailedSms(dateCondition)
    }

    return NextResponse.json({
      success: true,
      period,
      type,
      data: result
    })

  } catch (error) {
    console.error('SMS monitoring error:', error)
    return NextResponse.json(
      { error: '모니터링 데이터 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// SMS 재발송 API
export async function POST(request: NextRequest) {
  try {
    const authCheck = await checkAdminAuth(request)
    if (!authCheck.authorized) {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { phone, message, type = 'notification' } = body

    if (!phone || !message) {
      return NextResponse.json(
        { error: '전화번호와 메시지는 필수입니다.' },
        { status: 400 }
      )
    }

    // SENS로 SMS 발송
    const sensClient = createSensClient()
    const result = await sensClient.sendSms(phone, message)

    if (result.success) {
      // 발송 로그 기록
      await query(
        `INSERT INTO sms_send_logs 
         (phone, message_type, content, provider, provider_request_id, status, ip_address, user_agent)
         VALUES (?, ?, ?, 'sens', ?, 'sent', ?, ?)`,
        [
          phone,
          type,
          message,
          result.requestId,
          getClientIp(request),
          request.headers.get('user-agent') || 'Admin Panel'
        ]
      )

      return NextResponse.json({
        success: true,
        message: 'SMS가 발송되었습니다.',
        requestId: result.requestId
      })
    } else {
      return NextResponse.json(
        { error: result.error || 'SMS 발송에 실패했습니다.' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('SMS resend error:', error)
    return NextResponse.json(
      { error: 'SMS 재발송 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 요약 통계
async function getSummaryStats(dateCondition: string) {
  const stats = await queryOne(
    `SELECT 
       COUNT(*) as total_sent,
       COUNT(CASE WHEN status = 'sent' THEN 1 END) as sent_count,
       COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_count,
       COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_count,
       COUNT(CASE WHEN status = 'undelivered' THEN 1 END) as undelivered_count,
       ROUND(COUNT(CASE WHEN status = 'delivered' THEN 1 END) * 100.0 / COUNT(*), 2) as delivery_rate,
       SUM(cost_krw) as total_cost
     FROM sms_send_logs 
     WHERE ${dateCondition}`
  )

  // 시간별 발송량 (최근 24시간)
  const hourlyStats = await query(
    `SELECT 
       HOUR(created_at) as hour,
       COUNT(*) as count,
       COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered
     FROM sms_send_logs 
     WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
     GROUP BY HOUR(created_at)
     ORDER BY hour`
  )

  // 최근 인증번호 발송 현황
  const recentVerifications = await queryOne(
    `SELECT 
       COUNT(*) as total_verifications,
       COUNT(CASE WHEN verified = 1 THEN 1 END) as successful_verifications,
       ROUND(COUNT(CASE WHEN verified = 1 THEN 1 END) * 100.0 / COUNT(*), 2) as verification_rate
     FROM phone_verifications 
     WHERE ${dateCondition.replace('created_at', 'created_at')}`
  )

  return {
    summary: stats,
    hourly: hourlyStats,
    verifications: recentVerifications
  }
}

// 상세 통계
async function getDetailedStats(dateCondition: string) {
  // 일별 통계
  const dailyStats = await query(
    `SELECT 
       DATE(created_at) as date,
       COUNT(*) as total,
       COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered,
       COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed,
       SUM(cost_krw) as cost
     FROM sms_send_logs 
     WHERE ${dateCondition}
     GROUP BY DATE(created_at)
     ORDER BY date DESC`
  )

  // 메시지 유형별 통계
  const typeStats = await query(
    `SELECT 
       message_type,
       COUNT(*) as count,
       COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered,
       ROUND(COUNT(CASE WHEN status = 'delivered' THEN 1 END) * 100.0 / COUNT(*), 2) as delivery_rate
     FROM sms_send_logs 
     WHERE ${dateCondition}
     GROUP BY message_type`
  )

  // 오류 유형별 통계
  const errorStats = await query(
    `SELECT 
       error_message,
       COUNT(*) as count
     FROM sms_send_logs 
     WHERE ${dateCondition} AND status = 'failed' AND error_message IS NOT NULL
     GROUP BY error_message
     ORDER BY count DESC
     LIMIT 10`
  )

  return {
    daily: dailyStats,
    byType: typeStats,
    errors: errorStats
  }
}

// 실패한 SMS 목록
async function getFailedSms(dateCondition: string) {
  const failedList = await query(
    `SELECT 
       id, phone, message_type, content, provider_request_id,
       error_message, created_at, updated_at
     FROM sms_send_logs 
     WHERE ${dateCondition} AND status = 'failed'
     ORDER BY created_at DESC
     LIMIT 100`
  )

  return { failed: failedList }
}

// 클라이언트 IP 추출
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIp) {
    return realIp.trim()
  }
  
  return '127.0.0.1'
}