// src/lib/email/email-whitelist-checker.ts
import { queryOne } from '@/lib/mysql/connection'

/**
 * 이메일 검증 결과
 */
export interface EmailValidationResult {
  isAllowed: boolean
  domain: string
  providerName?: string
  reason?: string
}

/**
 * 이메일 도메인 추출
 */
function extractDomain(email: string): string {
  const parts = email.toLowerCase().trim().split('@')
  return parts.length === 2 ? parts[1] : ''
}

/**
 * 허용된 이메일 도메인인지 확인 (화이트리스트)
 */
export async function isAllowedEmail(email: string): Promise<EmailValidationResult> {
  const domain = extractDomain(email)
  
  if (!domain) {
    return {
      isAllowed: false,
      domain: '',
      reason: 'invalid_email_format'
    }
  }

  try {
    // 화이트리스트에서 도메인 확인
    const allowedDomain = await queryOne(
      'SELECT domain, provider_name FROM allowed_email_domains WHERE domain = ? AND is_active = 1',
      [domain]
    )

    if (allowedDomain) {
      return {
        isAllowed: true,
        domain,
        providerName: allowedDomain.provider_name
      }
    }

    // 화이트리스트에 없으면 거부
    return {
      isAllowed: false,
      domain,
      reason: 'domain_not_in_whitelist'
    }

  } catch (error) {
    console.error('Email whitelist check error:', error)
    // 에러 발생 시 보수적으로 거부
    return {
      isAllowed: false,
      domain,
      reason: 'validation_error'
    }
  }
}