import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/mysql/connection'
import { getCurrentUser } from '@/lib/mysql/server'

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== 'admin') {
            return NextResponse.json(
                { success: false, error: '관리자 권한이 필요합니다.' },
                { status: 403 }
            )
        }

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
            { error: '서버 오류가 발생했습니다.' },
            { status: 500 }
        )
    }
}

export async function PUT(request: NextRequest) {
    try {
        const user = await getCurrentUser()
        if (!user || user.role !== 'admin') {
            return NextResponse.json(
                { success: false, error: '관리자 권한이 필요합니다.' },
                { status: 403 }
            )
        }

        const body = await request.json()
        const { weather, temperature, airQuality, customMessage } = body

        if (!weather || temperature === undefined || !airQuality || !customMessage) {
            return NextResponse.json(
                { error: '필수 값이 누락되었습니다.' },
                { status: 400 }
            )
        }

        await query(
            `UPDATE weather_banner_settings 
       SET weather = ?, temperature = ?, air_quality = ?, custom_message = ?
       WHERE id = 1`,
            [weather, temperature, airQuality, customMessage]
        )

        return NextResponse.json({
            success: true,
            message: '날씨 배너 설정이 저장되었습니다.'
        })
    } catch (error) {
        console.error('날씨 배너 설정 저장 실패:', error)
        return NextResponse.json(
            { error: '서버 오류가 발생했습니다.' },
            { status: 500 }
        )
    }
}