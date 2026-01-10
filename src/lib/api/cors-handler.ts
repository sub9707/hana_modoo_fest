import { NextResponse } from 'next/server'

export function getCorsHeaders(): HeadersInit {
  const origin = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : process.env.APP_URL || ''

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  }
}

export function handleCorsOptions(allowedMethods?: string): NextResponse {
  const headers = getCorsHeaders()

  if (allowedMethods) {
    headers['Access-Control-Allow-Methods'] = allowedMethods
  }

  return new NextResponse(null, {
    status: 200,
    headers
  })
}
