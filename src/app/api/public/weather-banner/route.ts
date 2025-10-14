import { NextResponse } from 'next/server'
import { queryOne } from '@/lib/mysql/connection'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const settings = await queryOne(
      'SELECT weather, temperature, air_quality, custom_message FROM weather_banner_settings WHERE id = 1'
    )

    if (!settings) {
      return NextResponse.json({
        success: true,
        data: {
          weather: 'sunny',
          temperature: 22.0,
          airQuality: 'normal',
          customMessage: '야외 행사로 편안한 복장을 권장합니다'
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        weather: settings.weather,
        temperature: parseFloat(settings.temperature),
        airQuality: settings.air_quality,
        customMessage: settings.custom_message
      }
    })
  } catch (error) {
    console.error('날씨 배너 설정 조회 실패:', error)
    return NextResponse.json(
      { 
        success: true,
        data: {
          weather: 'sunny',
          temperature: 22.0,
          airQuality: 'normal',
          customMessage: '야외 행사로 편안한 복장을 권장합니다'
        }
      }
    )
  }
}