// app/api/writings/cooldown/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/mysql/connection'
import { getCurrentUser } from '@/lib/mysql/server'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    // 마지막 글 작성 시간 확인
    const lastWriting = await query(`
      SELECT created_at 
      FROM writings 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 1
    `, [user.id])

    if (lastWriting.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          canWrite: true,
          remainingSeconds: 0
        }
      })
    }

    const lastWritingTime = new Date(lastWriting[0].created_at)
    const now = new Date()
    const timeDiff = now.getTime() - lastWritingTime.getTime()
    const cooldownMs = 5 * 60 * 1000 // 5분

    if (timeDiff >= cooldownMs) {
      return NextResponse.json({
        success: true,
        data: {
          canWrite: true,
          remainingSeconds: 0
        }
      })
    }

    const remainingMs = cooldownMs - timeDiff
    const remainingSeconds = Math.ceil(remainingMs / 1000)

    return NextResponse.json({
      success: true,
      data: {
        canWrite: false,
        remainingSeconds,
        lastWritingTime: lastWritingTime.toISOString()
      }
    })
  } catch (error) {
    console.error('Error checking cooldown:', error)
    return NextResponse.json(
      { success: false, error: '쿨타임 확인에 실패했습니다.' },
      { status: 500 }
    )
  }
}