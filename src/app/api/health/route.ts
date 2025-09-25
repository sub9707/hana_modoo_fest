// app/api/health/route.ts
import { NextResponse } from 'next/server'
import { healthCheck } from '@/lib/mysql/connection'

// 환경별 응답 시간 기준 설정
const getResponseTimeThresholds = () => {
  const env = process.env.NODE_ENV
  
  if (env === 'development' || env === 'test') {
    return {
      good: 1000,    // 1초 미만 - good
      fair: 2000,    // 2초 미만 - fair  
      poor: 3000     // 3초 이상 - poor
    }
  }
  
  // 프로덕션 환경
  return {
    good: 200,     // 200ms 미만 - good
    fair: 500,     // 500ms 미만 - fair
    poor: 1000     // 1초 이상 - poor
  }
}

export async function GET() {
  const startTime = Date.now()
  
  try {
    // 간단한 헬스체크만 수행
    const dbHealthy = await Promise.race([
      healthCheck(),
      // 타임아웃 설정 (5초)
      new Promise<boolean>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      )
    ])
    
    const responseTime = Date.now() - startTime
    const thresholds = getResponseTimeThresholds()
    
    // 서버 부하 상태 판단 (더 관대한 기준)
    let load: 'low' | 'medium' | 'high' = 'low'
    
    if (!dbHealthy) {
      load = 'high'
    } else if (responseTime > thresholds.poor) {
      load = 'high'
    } else if (responseTime > thresholds.fair) {
      load = 'medium'
    } else {
      load = 'low'
    }

    const response = {
      status: dbHealthy ? 'healthy' : 'unhealthy',
      load,
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      database: dbHealthy ? 'healthy' : 'unhealthy',
      environment: process.env.NODE_ENV,
      thresholds
    }

    return NextResponse.json(response, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'X-Response-Time': `${responseTime}ms`
      }
    })
    
  } catch (error) {
    const responseTime = Date.now() - startTime
    console.error('Health check error:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      load: 'high',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      database: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV
    }, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'X-Response-Time': `${responseTime}ms`
      }
    })
  }
}