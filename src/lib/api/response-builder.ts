import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types/common'

export function successResponse<T>(data: T, message?: string, status: number = 200): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    data,
    ...(message && { message })
  }

  return NextResponse.json(response, { status })
}

export function errorResponse(error: string, status: number = 400): NextResponse {
  const response: ApiResponse = {
    success: false,
    error
  }

  return NextResponse.json(response, { status })
}

export function createdResponse<T>(data: T, message?: string): NextResponse {
  return successResponse(data, message, 201)
}

export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 })
}
