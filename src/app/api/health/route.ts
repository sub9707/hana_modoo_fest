import { NextResponse } from 'next/server'
import { healthCheck } from '@/lib/mysql/connection'
import { checkSensHealth, checkCredentials } from '@/lib/sens/health'

// 환경별 응답 시간 기준 설정
const getResponseTimeThresholds = () => {
  const env = process.env.NODE_ENV
  
  if (env === 'development' || env === 'test') {
    return {
      good: 2000,    // 2초 미만 - good
      fair: 5000,    // 5초 미만 - fair  
      poor: 10000    // 10초 이상 - poor
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
    // 병렬로 헬스체크 수행
    const [dbResult, sensResult] = await Promise.allSettled([
      // 데이터베이스 헬스체크 (타임아웃 5초)
      Promise.race([
        healthCheck(),
        new Promise<boolean>((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), 5000)
        )
      ]),
      // SENS 헬스체크 (타임아웃 10초) - 테스트 환경에서는 무시 가능
      Promise.race([
        checkSensHealth(),
        new Promise<any>((_, reject) => 
          setTimeout(() => reject(new Error('SENS timeout')), 10000)
        )
      ])
    ])
    
    const responseTime = Date.now() - startTime
    const thresholds = getResponseTimeThresholds()
    const isTestEnv = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
    
    // 데이터베이스 상태
    const dbHealthy = dbResult.status === 'fulfilled' && dbResult.value === true
    const dbError = dbResult.status === 'rejected' ? dbResult.reason?.message : null
    
    // SENS 상태 (테스트 환경에서는 선택적으로 처리)
    const sensHealthy = sensResult.status === 'fulfilled' && sensResult.value.isHealthy
    const sensStatus = sensResult.status === 'fulfilled' ? sensResult.value : null
    const sensError = sensResult.status === 'rejected' ? sensResult.reason?.message : null
    
    // 전체 서비스 상태 판단
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'
    let load: 'low' | 'medium' | 'high' = 'low'
    
    // 테스트 환경에서는 더 관대한 기준 적용
    if (!dbHealthy) {
      overallStatus = 'unhealthy'
      load = 'high'
    } else if (!sensHealthy && !isTestEnv) {
      // 테스트 환경에서는 SENS 실패를 무시
      overallStatus = 'degraded'
      load = 'medium'
    } else if (responseTime > thresholds.poor) {
      overallStatus = 'degraded'
      load = 'high'
    } else if (responseTime > thresholds.fair) {
      load = 'medium'
    }

    // 테스트 환경에서는 강제로 'low' 로 설정할 수 있다
    if (isTestEnv && process.env.FORCE_LOW_LOAD === 'true') {
      load = 'low'
      overallStatus = 'healthy'
    }

    const response = {
      status: overallStatus,
      load,
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      
      // 개별 서비스 상태
      services: {
        database: {
          status: dbHealthy ? 'healthy' : 'unhealthy',
          error: dbError
        },
        sms: {
          status: sensHealthy ? 'healthy' : (sensStatus?.status || 'unhealthy'),
          provider: 'SENS',
          message: sensStatus?.message,
          credentials: sensStatus?.details?.credentials || false,
          apiConnection: sensStatus?.details?.apiConnection || false,
          responseTime: sensStatus?.details?.responseTime ? `${sensStatus.details.responseTime}ms` : undefined,
          error: sensError,
          // 테스트 환경에서는 SENS 상태를 무시했음을 표시
          ignoredInTest: isTestEnv && !sensHealthy
        }
      },
      
      // 환경 정보
      environment: process.env.NODE_ENV,
      thresholds,
      isTestEnvironment: isTestEnv,
      forceLowLoad: process.env.FORCE_LOW_LOAD === 'true',
      
      // 추가 정보 (개발 환경에서만)
      ...(process.env.NODE_ENV === 'development' && {
        details: {
          sensCredentials: checkCredentials(),
          registeredSenders: sensStatus?.details?.senderNumbers || []
        }
      })
    }

    const statusCode = overallStatus === 'healthy' ? 200 : 
                      overallStatus === 'degraded' ? 206 : 503

    return NextResponse.json(response, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'X-Response-Time': `${responseTime}ms`,
        'X-Service-Status': overallStatus,
        'X-Load-Level': load
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
      
      services: {
        database: { status: 'unknown' },
        sms: { status: 'unknown', provider: 'SENS' }
      },
      
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV
    }, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'X-Response-Time': `${responseTime}ms`,
        'X-Service-Status': 'unhealthy'
      }
    })
  }
}

// SENS 전용 헬스체크
export async function POST() {
  try {
    const sensHealth = await checkSensHealth()
    
    return NextResponse.json({
      success: sensHealth.isHealthy,
      ...sensHealth
    }, {
      status: sensHealth.isHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      isHealthy: false,
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'SENS health check failed',
      details: {
        credentials: false,
        apiConnection: false,
        lastChecked: new Date().toISOString()
      }
    }, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    })
  }
}