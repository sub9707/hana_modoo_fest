import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { errorResponse } from './response-builder'

export function handleApiError(error: unknown, context?: string): NextResponse {
  if (context) {
    console.error(`Error in ${context}:`, error)
  } else {
    console.error('API Error:', error)
  }

  if (error instanceof ZodError) {
    return errorResponse(error.issues[0].message, 400)
  }

  if (error instanceof Error) {
    if (error.message.includes('duplicate') || error.message.includes('Duplicate')) {
      return errorResponse('이미 존재하는 데이터입니다.', 409)
    }

    if (error.message.includes('not found') || error.message.includes('Not found')) {
      return errorResponse('요청한 리소스를 찾을 수 없습니다.', 404)
    }

    return errorResponse(error.message, 500)
  }

  return errorResponse('서버 오류가 발생했습니다.', 500)
}

export function handleValidationError(error: unknown): NextResponse | null {
  if (error instanceof ZodError) {
    return errorResponse(error.issues[0].message, 400)
  }
  return null
}
