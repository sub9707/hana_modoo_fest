import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { query } from '@/lib/mysql/connection'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { error, stack, digest, url, timestamp } = body

    const user = await getCurrentUser().catch(() => null)

    // 크리티컬 에러 별도 처리
    await query(
      `INSERT INTO error_logs (
        user_id, message, stack, component_stack, 
        timestamp, url, user_agent, metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user?.id || null,
        error?.substring(0, 500),
        stack?.substring(0, 2000) || null,
        null, // component_stack
        timestamp,
        url?.substring(0, 500),
        request.headers.get('user-agent')?.substring(0, 500) || 'unknown',
        JSON.stringify({
          digest,
          severity: 'critical',
          type: 'global-error',
          immediate_alert: true
        })
      ]
    )

    // 실제 운영환경에서는 여기서 즉시 알림 발송
    // await sendCriticalAlert({ error, stack, user: user?.id })

    return NextResponse.json({ success: true })

  } catch (logError) {
    console.error('Critical error logging failed:', logError)
    return NextResponse.json(
      { success: false, error: 'Failed to log critical error' },
      { status: 500 }
    )
  }
}