import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { query, queryOne, transaction } from '@/lib/mysql/connection'
import type { ApiResponse, EventSettings } from '@/types/event'

// 이벤트 설정 조회 (관리자만)
export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      )
    }

    const settings = await query(
      'SELECT setting_key, setting_value FROM event_settings'
    )

    const settingsObj = settings.reduce((acc: any, setting: any) => {
      acc[setting.setting_key] = setting.setting_value
      return acc
    }, {})

    return NextResponse.json<ApiResponse<EventSettings>>({
      success: true,
      data: {
        daily_participation_limit: parseInt(settingsObj.daily_participation_limit || '1'),
        event_active: settingsObj.event_active === 'true',
        max_concurrent_spins: parseInt(settingsObj.max_concurrent_spins || '10'),
        roulette_animation_duration: parseInt(settingsObj.roulette_animation_duration || '3000')
      }
    })
  } catch (error) {
    console.error('Get event settings error:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: '설정 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 이벤트 설정 업데이트 (관리자만)
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { setting_key, setting_value } = body

    if (!setting_key || setting_value === undefined) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: '설정 키와 값이 필요합니다.' },
        { status: 400 }
      )
    }

    // 허용된 설정 키 확인
    const allowedKeys = [
      'daily_participation_limit',
      'event_active',
      'max_concurrent_spins',
      'roulette_animation_duration'
    ]

    if (!allowedKeys.includes(setting_key)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: '허용되지 않은 설정 키입니다.' },
        { status: 400 }
      )
    }

    await query(
      `INSERT INTO event_settings (setting_key, setting_value) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
      [setting_key, String(setting_value)]
    )

    return NextResponse.json<ApiResponse>({
      success: true,
      message: '설정이 업데이트되었습니다.'
    })
  } catch (error) {
    console.error('Update event settings error:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: '설정 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
