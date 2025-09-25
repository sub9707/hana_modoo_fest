import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { query } from '@/lib/mysql/connection'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { logs } = body

    if (!Array.isArray(logs) || logs.length === 0) {
      return NextResponse.json({ success: true })
    }

    const user = await getCurrentUser().catch(() => null)

    // 간단한 로그 저장
    const values = logs.map(log => [
      user?.id || null,
      log.level,
      log.message?.substring(0, 500),
      JSON.stringify(log.context || {}),
      log.timestamp
    ])

    if (values.length > 0) {
      const placeholders = values.map(() => '(?, ?, ?, ?, ?)').join(', ')
      await query(
        `INSERT INTO application_logs (user_id, level, message, context, timestamp) 
         VALUES ${placeholders}`,
        values.flat()
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logging error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}