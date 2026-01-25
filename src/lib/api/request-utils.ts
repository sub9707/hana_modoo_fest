import { NextRequest } from 'next/server'
import { createHash } from 'crypto'

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const clientIp = request.headers.get('x-client-ip')

  if (forwarded) return forwarded.split(',')[0].trim()
  if (realIp) return realIp.trim()
  if (clientIp) return clientIp.trim()

  return '127.0.0.1'
}

export interface PaginationParams {
  page: number
  limit: number
  offset: number
}

export function parsePaginationParams(
  searchParams: URLSearchParams,
  defaultLimit: number = 10
): PaginationParams {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || String(defaultLimit))))
  const offset = (page - 1) * limit

  return { page, limit, offset }
}

export function parseSearchParam(searchParams: URLSearchParams, key: string): string | undefined {
  const value = searchParams.get(key)
  return value && value.trim() !== '' ? value.trim() : undefined
}

export function parseBooleanParam(searchParams: URLSearchParams, key: string): boolean | undefined {
  const value = searchParams.get(key)
  if (value === null) return undefined
  return value === 'true' || value === '1'
}

export function parseIntParam(searchParams: URLSearchParams, key: string, defaultValue?: number): number | undefined {
  const value = searchParams.get(key)
  if (value === null) return defaultValue
  const parsed = parseInt(value)
  return isNaN(parsed) ? defaultValue : parsed
}

export function hashPassword(password: string, salt: string): string {
  return createHash('sha256').update(password + salt).digest('hex')
}
