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
