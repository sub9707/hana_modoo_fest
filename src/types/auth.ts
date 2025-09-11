// 사용자 타입 정의
export interface User {
  id: string
  name: string
  username: string
  gender: 'male' | 'female' | 'other'
  birth_date: string
  phone: string
  role: 'admin' | 'editor' | 'user'
  created_at: string
  last_login_at?: string
  last_activity_at?: string
}

// 데이터베이스 사용자 타입 (내부 필드 포함)
export interface DatabaseUser extends User {
  password_hash: string
  password_salt: string
  session_token?: string
  session_expires_at?: string
  updated_at: string
}

// 로그인 폼 타입
export interface LoginFormData {
  username: string
  password: string
}

// 로그인 응답 타입
export interface LoginResponse {
  success?: boolean
  error?: string
  user?: Pick<User, 'id' | 'name' | 'username' | 'role'>
}

// 세션 정보 타입
export interface SessionInfo {
  user: User
  expiresAt: string
}

// 권한 레벨 타입
export type Role = 'admin' | 'editor' | 'user'

// 권한 계층 타입
export type RoleHierarchy = Record<Role, number>