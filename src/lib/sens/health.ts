import { createSensClient } from './client'

export interface SensHealthCheck {
  isHealthy: boolean
  status: 'healthy' | 'unhealthy' | 'degraded'
  message: string
  details: {
    credentials: boolean
    apiConnection: boolean
    senderNumbers?: string[]
    lastChecked: string
    responseTime?: number
  }
}

/**
 * SENS 서비스 상태 확인
 */
export async function checkSensHealth(): Promise<SensHealthCheck> {
  const startTime = Date.now()
  const result: SensHealthCheck = {
    isHealthy: false,
    status: 'unhealthy',
    message: '',
    details: {
      credentials: false,
      apiConnection: false,
      lastChecked: new Date().toISOString()
    }
  }

  try {
    // 1. 환경변수 검증
    const credentialsCheck = checkCredentials()
    result.details.credentials = credentialsCheck.valid

    if (!credentialsCheck.valid) {
      result.message = credentialsCheck.message
      return result
    }

    // 2. SENS API 연결 테스트
    const sensClient = createSensClient()
    
    try {
      const senderNumbers = await sensClient.getSenderNumbers()
      result.details.apiConnection = true
      result.details.senderNumbers = senderNumbers.senders?.map((s: any) => s.phoneNumber) || []
      
      result.isHealthy = true
      result.status = 'healthy'
      result.message = 'SENS 서비스가 정상적으로 작동 중입니다.'
      
    } catch (apiError) {
      result.details.apiConnection = false
      result.status = 'degraded'
      result.message = `SENS API 연결 실패: ${apiError instanceof Error ? apiError.message : '알 수 없는 오류'}`
    }

  } catch (error) {
    result.message = `SENS 헬스체크 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
  }

  result.details.responseTime = Date.now() - startTime
  return result
}

/**
 * SENS 환경변수 검증
 */
export function checkCredentials(): { valid: boolean; message: string; missing: string[] } {
  const requiredEnvVars = [
    'NCP_ACCESS_KEY',
    'NCP_SECRET_KEY', 
    'SENS_SERVICE_ID',
    'SENS_FROM_NUMBER'
  ]

  const missing: string[] = []
  const envValues: { [key: string]: string | undefined } = {
    NCP_ACCESS_KEY: process.env.NCP_ACCESS_KEY,
    NCP_SECRET_KEY: process.env.NCP_SECRET_KEY,
    SENS_SERVICE_ID: process.env.SENS_SERVICE_ID,
    SENS_FROM_NUMBER: process.env.SENS_FROM_NUMBER
  }

  // 필수 환경변수 존재 여부 확인
  for (const envVar of requiredEnvVars) {
    if (!envValues[envVar] || envValues[envVar]?.trim() === '') {
      missing.push(envVar)
    }
  }

  if (missing.length > 0) {
    return {
      valid: false,
      message: `다음 환경변수가 설정되지 않았습니다: ${missing.join(', ')}`,
      missing
    }
  }

  // 환경변수 형식 검증
  const validationErrors: string[] = []

  // Access Key 형식 검증 (일반적으로 20자 이상)
  if (envValues.NCP_ACCESS_KEY && envValues.NCP_ACCESS_KEY.length < 10) {
    validationErrors.push('NCP_ACCESS_KEY가 너무 짧습니다.')
  }

  // Secret Key 형식 검증 (일반적으로 40자 이상)
  if (envValues.NCP_SECRET_KEY && envValues.NCP_SECRET_KEY.length < 20) {
    validationErrors.push('NCP_SECRET_KEY가 너무 짧습니다.')
  }

  // Service ID 형식 검증 (ncp:sms:kr:로 시작)
  if (envValues.SENS_SERVICE_ID && !envValues.SENS_SERVICE_ID.startsWith('ncp:sms:kr:')) {
    validationErrors.push('SENS_SERVICE_ID 형식이 올바르지 않습니다. (ncp:sms:kr:로 시작해야 함)')
  }

  // 발신번호 형식 검증
  if (envValues.SENS_FROM_NUMBER && !/^01[0-9]{8,9}$/.test(envValues.SENS_FROM_NUMBER)) {
    validationErrors.push('SENS_FROM_NUMBER 형식이 올바르지 않습니다. (01XXXXXXXX 형식)')
  }

  if (validationErrors.length > 0) {
    return {
      valid: false,
      message: `환경변수 형식 오류: ${validationErrors.join(', ')}`,
      missing: []
    }
  }

  return {
    valid: true,
    message: '모든 SENS 환경변수가 올바르게 설정되었습니다.',
    missing: []
  }
}

/**
 * 테스트 SMS 발송 (개발 환경용)
 */
export async function sendTestSms(testPhone: string): Promise<{
  success: boolean
  message: string
  requestId?: string
}> {
  try {
    // 개발 환경에서만 테스트 발송 허용
    if (process.env.NODE_ENV === 'production') {
      return {
        success: false,
        message: '프로덕션 환경에서는 테스트 SMS를 발송할 수 없습니다.'
      }
    }

    const sensClient = createSensClient()
    const testMessage = `[SENS 테스트] 네이버 클라우드 플랫폼 SENS 연동 테스트입니다. ${new Date().toLocaleTimeString()}`
    
    const result = await sensClient.sendSms(testPhone, testMessage)
    
    if (result.success) {
      return {
        success: true,
        message: '테스트 SMS가 성공적으로 발송되었습니다.',
        requestId: result.requestId
      }
    } else {
      return {
        success: false,
        message: result.error || 'SMS 발송에 실패했습니다.'
      }
    }

  } catch (error) {
    return {
      success: false,
      message: `테스트 SMS 발송 중 오류 발생: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
    }
  }
}

/**
 * SENS 서비스 정보 조회
 */
export async function getSensServiceInfo(): Promise<{
  success: boolean
  data?: any
  error?: string
}> {
  try {
    const sensClient = createSensClient()
    
    // 발신번호 목록과 서비스 정보 조회
    const [senderNumbers] = await Promise.allSettled([
      sensClient.getSenderNumbers()
    ])

    const result: any = {
      timestamp: new Date().toISOString(),
      serviceId: process.env.SENS_SERVICE_ID,
      fromNumber: process.env.SENS_FROM_NUMBER
    }

    if (senderNumbers.status === 'fulfilled') {
      result.registeredSenders = senderNumbers.value.senders || []
    } else {
      result.senderNumbersError = senderNumbers.reason?.message || '발신번호 조회 실패'
    }

    return {
      success: true,
      data: result
    }

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '서비스 정보 조회 실패'
    }
  }
}

/**
 * 마이그레이션 상태 확인 (SOLAPI → SENS)
 */
export function checkMigrationStatus(): {
  migrationComplete: boolean
  remainingTasks: string[]
  recommendations: string[]
} {
  const remainingTasks: string[] = []
  const recommendations: string[] = []

  // SOLAPI 환경변수 확인
  if (process.env.SOLAPI_API_KEY || process.env.SOLAPI_API_SECRET) {
    remainingTasks.push('SOLAPI 환경변수 제거')
    recommendations.push('기존 SOLAPI 환경변수를 .env 파일에서 제거하세요.')
  }

  // SENS 환경변수 확인
  const { valid, missing } = checkCredentials()
  if (!valid) {
    remainingTasks.push('SENS 환경변수 설정')
    recommendations.push(`다음 환경변수를 설정하세요: ${missing.join(', ')}`)
  }

  // 데이터베이스 스키마 업데이트 확인 (간접적으로)
  recommendations.push('database_update_for_sens.sql 스크립트를 실행했는지 확인하세요.')
  recommendations.push('기존 SOLAPI 관련 코드가 모두 제거되었는지 확인하세요.')

  return {
    migrationComplete: remainingTasks.length === 0,
    remainingTasks,
    recommendations
  }
}