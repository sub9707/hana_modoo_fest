import { NextResponse } from 'next/server'
import { SITE } from '@/constants'

export function getCorsHeaders(): HeadersInit {
  const origin = process.env.NODE_ENV === 'development'
    ? SITE.devUrl
    : process.env.APP_URL || ''

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  }
}

export function handleCorsOptions(): NextResponse {
  const headers = getCorsHeaders()

  return new NextResponse(null, {
    status: 200,
    headers
  })
}
