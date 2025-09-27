// src/lib/sens/client.ts
import crypto from 'crypto'

interface SensConfig {
  accessKey: string
  secretKey: string
  serviceId: string
  baseUrl: string
  fromNumber: string
}

interface SmsMessage {
  to: string
  content?: string
  subject?: string
}

interface SmsRequest {
  type: 'SMS' | 'LMS' | 'MMS'
  contentType: 'COMM' | 'AD'
  countryCode: string
  from: string
  content: string
  subject?: string
  messages: SmsMessage[]
  files?: Array<{
    name: string
    body: string
  }>
  reserveTime?: string
  reserveTimeZone?: string
  scheduleCode?: string
}

interface SmsResponse {
  requestId: string
  requestTime: string
  statusCode: string
  statusName: string
}

export class SensClient {
  private config: SensConfig

  constructor(config: SensConfig) {
    this.config = config
  }

  /**
   * SMS 발송
   */
  async sendSms(
    to: string | string[],
    content: string,
    options?: {
      subject?: string
      reserveTime?: string
    }
  ): Promise<{ success: boolean; requestId?: string; error?: string }> {
    try {
      const messages = Array.isArray(to) 
        ? to.map(phone => ({ to: phone }))
        : [{ to }]

      const requestBody: SmsRequest = {
        type: this.getSmsType(content),
        contentType: 'COMM',
        countryCode: '82',
        from: this.config.fromNumber,
        content,
        messages,
        ...(options?.subject && { subject: options.subject }),
        ...(options?.reserveTime && { reserveTime: options.reserveTime })
      }

      const timestamp = Date.now().toString()
      const signature = this.generateSignature(timestamp)

      const response = await fetch(
        `${this.config.baseUrl}/sms/v2/services/${this.config.serviceId}/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'x-ncp-apigw-timestamp': timestamp,
            'x-ncp-iam-access-key': this.config.accessKey,
            'x-ncp-apigw-signature-v2': signature
          },
          body: JSON.stringify(requestBody)
        }
      )

      if (response.ok) {
        const data: SmsResponse = await response.json()
        return {
          success: true,
          requestId: data.requestId
        }
      } else {
        const errorText = await response.text()
        console.error('SENS SMS send failed:', response.status, errorText)
        
        return {
          success: false,
          error: this.parseErrorMessage(response.status, errorText)
        }
      }
    } catch (error) {
      console.error('SENS SMS send error:', error)
      return {
        success: false,
        error: 'SMS 발송 중 오류가 발생했습니다.'
      }
    }
  }

  /**
   * 발송 결과 조회
   */
  async getMessageResult(requestId: string): Promise<any> {
    try {
      const timestamp = Date.now().toString()
      const signature = this.generateSignature(timestamp, 'GET', `/sms/v2/services/${this.config.serviceId}/messages/${requestId}`)

      const response = await fetch(
        `${this.config.baseUrl}/sms/v2/services/${this.config.serviceId}/messages/${requestId}`,
        {
          method: 'GET',
          headers: {
            'x-ncp-apigw-timestamp': timestamp,
            'x-ncp-iam-access-key': this.config.accessKey,
            'x-ncp-apigw-signature-v2': signature
          }
        }
      )

      if (response.ok) {
        return await response.json()
      } else {
        throw new Error(`Failed to get message result: ${response.status}`)
      }
    } catch (error) {
      console.error('Get message result error:', error)
      throw error
    }
  }

  /**
   * 발신번호 목록 조회
   */
  async getSenderNumbers(): Promise<any> {
    try {
      const timestamp = Date.now().toString()
      const signature = this.generateSignature(timestamp, 'GET', `/sms/v2/services/${this.config.serviceId}/senders`)

      const response = await fetch(
        `${this.config.baseUrl}/sms/v2/services/${this.config.serviceId}/senders`,
        {
          method: 'GET',
          headers: {
            'x-ncp-apigw-timestamp': timestamp,
            'x-ncp-iam-access-key': this.config.accessKey,
            'x-ncp-apigw-signature-v2': signature
          }
        }
      )

      if (response.ok) {
        return await response.json()
      } else {
        throw new Error(`Failed to get sender numbers: ${response.status}`)
      }
    } catch (error) {
      console.error('Get sender numbers error:', error)
      throw error
    }
  }

  /**
   * SENS API 서명 생성
   */
  private generateSignature(timestamp: string, method: string = 'POST', url?: string): string {
    const space = ' '
    const newLine = '\n'
    const requestUrl = url || `/sms/v2/services/${this.config.serviceId}/messages`
    
    const message = method + space + requestUrl + newLine + timestamp + newLine + this.config.accessKey

    return crypto
      .createHmac('sha256', this.config.secretKey)
      .update(message)
      .digest('base64')
  }

  /**
   * 메시지 길이에 따른 SMS 타입 결정
   */
  private getSmsType(content: string): 'SMS' | 'LMS' {
    // SMS: 90바이트(한글 45자) 이내
    // LMS: 2000바이트(한글 1000자) 이내
    const byteLength = Buffer.byteLength(content, 'utf8')
    return byteLength <= 90 ? 'SMS' : 'LMS'
  }

  /**
   * 오류 메시지 파싱
   */
  private parseErrorMessage(status: number, errorText: string): string {
    try {
      const errorData = JSON.parse(errorText)
      
      // SENS API 공통 오류 코드 매핑
      const errorMessages: { [key: string]: string } = {
        '400': '잘못된 요청입니다.',
        '401': '인증에 실패했습니다.',
        '403': '권한이 없습니다.',
        '404': '서비스를 찾을 수 없습니다.',
        '429': '요청 한도를 초과했습니다.',
        '500': '서버 내부 오류가 발생했습니다.'
      }

      return errorMessages[status.toString()] || errorData.message || '알 수 없는 오류가 발생했습니다.'
    } catch {
      return `HTTP ${status} 오류가 발생했습니다.`
    }
  }
}

/**
 * SENS 클라이언트 인스턴스 생성 함수
 */
export function createSensClient(): SensClient {
  const config: SensConfig = {
    accessKey: process.env.NCP_ACCESS_KEY!,
    secretKey: process.env.NCP_SECRET_KEY!,
    serviceId: process.env.SENS_SERVICE_ID!,
    baseUrl: 'https://sens.apigw.ntruss.com',
    fromNumber: process.env.SENS_FROM_NUMBER!
  }

  // 필수 환경변수 검증
  if (!config.accessKey || !config.secretKey || !config.serviceId || !config.fromNumber) {
    throw new Error('SENS 환경변수가 설정되지 않았습니다. NCP_ACCESS_KEY, NCP_SECRET_KEY, SENS_SERVICE_ID, SENS_FROM_NUMBER를 확인해주세요.')
  }

  return new SensClient(config)
}

/**
 * 간편한 SMS 발송 함수
 */
export async function sendVerificationSms(
  phone: string, 
  code: string
): Promise<{ success: boolean; requestId?: string; error?: string }> {
  try {
    const client = createSensClient()
    const message = `[모두하나대축제 2025] 인증번호는 ${code}입니다. 5분 내에 입력해주세요.`
    
    return await client.sendSms(phone, message)
  } catch (error) {
    console.error('Send verification SMS error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    }
  }
}