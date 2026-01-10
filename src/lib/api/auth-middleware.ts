import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { errorResponse } from './response-builder'

export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    return {
      user: null,
      response: errorResponse('로그인이 필요합니다.', 401)
    }
  }

  return { user, response: null }
}

export async function requireAdmin() {
  const { user, response } = await requireAuth()

  if (response) return { user: null, response }

  if (user?.role !== 'admin') {
    return {
      user: null,
      response: errorResponse('관리자 권한이 필요합니다.', 403)
    }
  }

  return { user, response: null }
}

export async function requireEditor() {
  const { user, response } = await requireAuth()

  if (response) return { user: null, response }

  if (user?.role !== 'editor' && user?.role !== 'admin') {
    return {
      user: null,
      response: errorResponse('편집자 권한이 필요합니다.', 403)
    }
  }

  return { user, response: null }
}
