// src/lib/utils/security.ts
import crypto from 'crypto'

/**
 * IP 주소 해싱 (개인정보 보호)
 */
export function hashIP(ip: string): string {
  if (ip === 'unknown') return 'unknown'
  
  return crypto
    .createHash('sha256')
    .update(ip + process.env.IP_HASH_SALT || 'default_salt')
    .digest('hex')
    .substring(0, 16) // 16자리로 축약
}

/**
 * User Agent 정리 (개인정보 제거)
 */
export function sanitizeUserAgent(userAgent: string): string {
  if (userAgent === 'unknown') return 'unknown'
  
  // 브라우저 정보만 추출 (개인정보 제거)
  const browserMatch = userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera)\/[\d.]+/)
  const osMatch = userAgent.match(/(Windows|Mac|Linux|Android|iOS)/)
  
  const browser = browserMatch ? browserMatch[0] : 'Unknown'
  const os = osMatch ? osMatch[0] : 'Unknown'
  
  return `${browser} on ${os}`
}