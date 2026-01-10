import { NextRequest } from 'next/server'
import { getAllUsers, createUser, CreateUserData } from '@/lib/services/users-service'
import { requireAdmin, successResponse, errorResponse, createdResponse, handleApiError } from '@/lib/api'

export async function GET(request: NextRequest) {
  try {
    const { user, response } = await requireAdmin()
    if (response) return response

    const users = await getAllUsers()

    if (process.env.NODE_ENV === 'development') {
      console.log('Admin Users API - 첫 번째 사용자 샘플:', {
        name: users[0]?.name,
        username: users[0]?.username,
        signup_method: users[0]?.signup_method
      })
    }

    return successResponse(users)
  } catch (error) {
    return handleApiError(error, 'GET /api/admin/users')
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, response } = await requireAdmin()
    if (response) return response

    const body = await request.json()
    const { name, username, company, gender, birth_date, phone, role, password } = body

    if (!name || !username || !gender || !birth_date || !phone || !role || !password) {
      return errorResponse('필수 필드가 누락되었습니다.', 400)
    }

    const validRoles = ['admin', 'editor', 'user']
    if (!validRoles.includes(role)) {
      return errorResponse('유효하지 않은 역할입니다.', 400)
    }

    const validGenders = ['male', 'female', 'none']
    if (!validGenders.includes(gender)) {
      return errorResponse('유효하지 않은 성별입니다.', 400)
    }

    const userData: CreateUserData = {
      name,
      username,
      company,
      gender,
      birth_date,
      phone,
      role,
      password
    }

    const newUser = await createUser(userData)
    return createdResponse(newUser)
  } catch (error) {
    return handleApiError(error, 'POST /api/admin/users')
  }
}
