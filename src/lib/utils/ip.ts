// src/lib/utils/ip.ts
import { NextRequest } from 'next/server'

/**
 * NextRequest에서 클라이언트 IP 주소 추출
 * 프록시, 로드밸런서 환경 고려
 */
export function getClientIp(request: NextRequest): string {
  // x-forwarded-for 헤더 확인 (프록시/로드밸런서)
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    // 여러 IP가 있을 경우 첫 번째가 실제 클라이언트 IP
    return forwarded.split(',')[0].trim()
  }

  // x-real-ip 헤더 확인
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }

  // x-client-ip 헤더 확인
  const clientIp = request.headers.get('x-client-ip')
  if (clientIp) {
    return clientIp.trim()
  }

  // CF-Connecting-IP (Cloudflare)
  const cfIp = request.headers.get('cf-connecting-ip')
  if (cfIp) {
    return cfIp.trim()
  }

  // True-Client-IP (Akamai, Cloudflare Enterprise)
  const trueClientIp = request.headers.get('true-client-ip')
  if (trueClientIp) {
    return trueClientIp.trim()
  }

  // 기본값 (로컬호스트)
  return '127.0.0.1'
}

/**
 * IP 주소 검증
 */
export function isValidIp(ip: string): boolean {
  // IPv4 검증
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
  if (ipv4Regex.test(ip)) {
    const parts = ip.split('.')
    return parts.every(part => {
      const num = parseInt(part, 10)
      return num >= 0 && num <= 255
    })
  }

  // IPv6 검증 (간단한 체크)
  const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/
  return ipv6Regex.test(ip)
}

/**
 * IP 주소 익명화 (개인정보 보호)
 */
export function anonymizeIp(ip: string): string {
  if (ip.includes(':')) {
    // IPv6: 마지막 두 세그먼트를 0으로
    const parts = ip.split(':')
    return parts.slice(0, -2).join(':') + ':0:0'
  } else {
    // IPv4: 마지막 옥텟을 0으로
    const parts = ip.split('.')
    return parts.slice(0, 3).join('.') + '.0'
  }
}