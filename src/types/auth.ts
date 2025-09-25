// types/auth.ts
// 기본 사용자 타입 정의
export interface User {
  id: string
  name: string
  username: string
  company?: string
  gender: 'male' | 'female' | 'none'
  birth_date: string
  phone: string
  email?: string
  profile_image?: string
  role: 'admin' | 'editor' | 'user'
  signup_method: 'phone' | 'naver' | 'kakao'
  last_login_at?: string
  last_activity_at?: string
  created_at: string
  updated_at: string
}

// 데이터베이스 사용자 타입 (내부 필드 포함)
export interface DatabaseUser extends User {
  password_hash: string
  password_salt: string
  session_token?: string
  session_expires_at?: string
}

// SNS 계정 정보 타입
export interface SocialAccount {
  id: string
  user_id: string
  provider: 'naver' | 'kakao'
  provider_id: string
  provider_email?: string
  provider_name?: string
  provider_profile_image?: string
  access_token?: string
  refresh_token?: string
  token_expires_at?: string
  created_at: string
  updated_at: string
}

// 전화번호 인증 타입
export interface PhoneVerification {
  id: string
  phone: string
  code: string
  ip_address: string
  user_agent?: string
  attempt_count: number
  verified: boolean
  expires_at: string
  created_at: string
  updated_at: string
}

// 인증 제한 타입
export interface VerificationLimit {
  id: string
  identifier: string
  type: 'ip' | 'phone'
  attempt_count: number
  last_attempt_at: string
  blocked_until?: string
  created_at: string
  updated_at: string
}

// 로그인 폼 타입
export interface LoginFormData {
  username: string
  password: string
}

// 전화번호 회원가입 폼 타입
export interface PhoneRegistrationFormData {
  name: string
  username: string
  password: string
  confirmPassword: string
  phone: string
  gender: 'male' | 'female' | 'none'
  birthDate: string
  company?: string
}

// SNS 회원가입 폼 타입
export interface SocialRegistrationFormData {
  name: string
  username: string
  password: string
  confirmPassword: string
  phone: string
  gender: 'male' | 'female' | 'none'
  birthDate: string
  company?: string
}

// 로그인 응답 타입
export interface LoginResponse {
  success?: boolean
  error?: string
  user?: Pick<User, 'id' | 'name' | 'username' | 'role'>
}

// 회원가입 응답 타입
export interface RegistrationResponse {
  success?: boolean
  error?: string
  userId?: string
}

// 인증번호 발송 응답 타입
export interface SendVerificationResponse {
  success?: boolean
  error?: string
  message?: string
  expiresIn?: number
  remainingSeconds?: number
  existingUser?: boolean
  signupMethod?: string
}

// 인증번호 확인 응답 타입
export interface VerifyCodeResponse {
  success?: boolean
  error?: string
  message?: string
  phone?: string
  remainingAttempts?: number
  blocked?: boolean
  blockDurationMinutes?: number
  blockedUntil?: string
  remainingMinutes?: number
}

// OAuth 사용자 데이터 타입
export interface OAuthUserData {
  id: string
  email?: string
  name?: string
  profileImage?: string
}

// OAuth 제공자 설정 타입
export interface OAuthProviderConfig {
  clientId: string
  clientSecret: string
  authUrl: string
  tokenUrl: string
  userUrl: string
  scope: string
}

// 세션 정보 타입
export interface SessionInfo {
  user: User
  expiresAt: string
}

// 권한 레벨 타입
export type Role = 'admin' | 'editor' | 'user'

// 가입 방법 타입
export type SignupMethod = 'phone' | 'naver' | 'kakao'

// OAuth 제공자 타입
export type OAuthProvider = 'naver' | 'kakao'

// 권한 계층 타입
export type RoleHierarchy = Record<Role, number>

// API 응답 기본 타입
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// 페이지네이션 타입
export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

// 필터 옵션 타입
export interface UserFilterOptions {
  role?: Role
  signupMethod?: SignupMethod
  search?: string
  dateFrom?: string
  dateTo?: string
}

// 사용자 목록 응답 타입
export interface UsersListResponse extends ApiResponse {
  data?: {
    users: User[]
    pagination: Pagination
  }
}

// 프로필 업데이트 타입
export interface ProfileUpdateData {
  name?: string
  company?: string
  phone?: string
  gender?: 'male' | 'female' | 'none'
  birth_date?: string
}

// 비밀번호 변경 타입
export interface PasswordChangeData {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

// 계정 연결/해제 타입
export interface AccountLinkData {
  provider: OAuthProvider
  action: 'link' | 'unlink'
}

// 관리자 사용자 관리 타입
export interface AdminUserUpdateData {
  name?: string
  username?: string
  role?: Role
  company?: string
  phone?: string
  email?: string
  gender?: 'male' | 'female' | 'none'
  birth_date?: string
}

// 통계 데이터 타입
export interface UserStats {
  totalUsers: number
  newUsersToday: number
  newUsersThisMonth: number
  usersBySignupMethod: Record<SignupMethod, number>
  usersByRole: Record<Role, number>
  activeUsersToday: number
  activeUsersThisWeek: number
}

// 활동 로그 타입
export interface ActivityLog {
  id: string
  user_id: string
  action: string
  details?: string
  ip_address: string
  user_agent?: string
  created_at: string
}

// 보안 이벤트 타입
export interface SecurityEvent {
  id: string
  user_id?: string
  event_type: 'login_attempt' | 'password_change' | 'account_lock' | 'suspicious_activity'
  success: boolean
  ip_address: string
  user_agent?: string
  details?: string
  created_at: string
}

// 설정 타입
export interface AppSettings {
  allowPhoneRegistration: boolean
  allowNaverLogin: boolean
  allowKakaoLogin: boolean
  maxLoginAttempts: number
  sessionDurationDays: number
  phoneVerificationExpiryMinutes: number
  smsRateLimitPerHour: number
  smsRateLimitPerDay: number
}

