// src/types/auth.ts

/**
 * 사용자 기본 정보 타입
 */
export interface User {
  id: string
  name: string
  username: string
  company?: string
  gender: 'male' | 'female' | 'none'
  birth_date: string
  phone: string
  address?: string
  address_detail?: string
  zip_code?: string
  role: 'admin' | 'editor' | 'user'
  email?: string
  profile_image?: string
  signup_method: 'phone' | 'naver' | 'kakao'
  last_login_at?: string
  last_activity_at?: string
  created_at: string
  updated_at: string
}

/**
 * 세션 정보 타입
 */
export interface UserSession {
  id: string
  name: string
  username: string
  role: 'admin' | 'editor' | 'user'
  email?: string
  phone: string
  session_token: string
  session_expires_at: string
}

/**
 * 로그인 응답 타입
 */
export interface LoginResponse {
  success: boolean
  user?: {
    id: string
    name: string
    username: string
    role: string
  }
  error?: string
}

/**
 * 비밀번호 변경 요청 타입
 */
export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

/**
 * 비밀번호 변경 응답 타입
 */
export interface ChangePasswordResponse {
  success: boolean
  message?: string
  error?: string
}

/**
 * 비밀번호 강도 결과 타입 (유틸리티에서 재사용)
 */
export interface PasswordStrengthResult {
  score: number
  feedback: string[]
  isStrong: boolean
  strength: 'very-weak' | 'weak' | 'fair' | 'good' | 'strong'
}

/**
 * 소셜 계정 정보 타입
 */
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

/**
 * 회원가입 요청 타입
 */
export interface SignupRequest {
  name: string
  username: string
  password: string
  confirmPassword: string
  phone: string
  gender: 'male' | 'female' | 'none'
  birthDate: string
  company?: string
  address?: string
  addressDetail?: string
  zipCode?: string
  privacyConsent: boolean
  marketingConsent?: boolean
}

/**
 * 비밀번호 재설정 요청 타입
 */
export interface ResetPasswordRequest {
  phone: string
  newPassword: string
  confirmPassword: string
  verificationCode: string
}

/**
 * 프로필 업데이트 요청 타입
 */
export interface UpdateProfileRequest {
  name: string
  company?: string
  address?: string
  addressDetail?: string
  zipCode?: string
}

/**
 * 인증 에러 타입
 */
export interface AuthError {
  message: string
  code?: string
  path?: string[]
}

/**
 * API 응답 기본 타입
 */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * 세션 상태 타입
 */
export type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated'

/**
 * 권한 레벨 타입
 */
export type Role = 'admin' | 'editor' | 'user'

/**
 * 로그인 이력 타입
 */
export interface LoginHistory {
  id: string
  user_id: string
  ip_address: string
  user_agent?: string
  created_at: string
}

/**
 * 보안 이벤트 타입
 */
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

/**
 * 앱 설정 타입
 */
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

/**
 * 관리자 액션 로그 타입
 */
export interface AdminAction {
  id: string
  admin_id: string
  action_type: 'user_blacklist' | 'user_unblock' | 'force_deletion' | 'pattern_review' | 'password_change'
  target_user_hash?: string
  target_phone_hash?: string
  reason?: string
  metadata?: any
  created_at: string
}

/**
 * 계정 삭제 정보 타입
 */
export interface AccountDeletion {
  id: string
  user_id_hash: string
  phone_hash: string
  email_hash?: string
  ip_address: string
  signup_method: 'phone' | 'naver' | 'kakao'
  deletion_reason?: 'privacy_concern' | 'service_dissatisfaction' | 'no_longer_needed' | 'duplicate_account' | 'other'
  deletion_reason_detail?: string
  account_age_days: number
  last_activity_days_ago?: number
  total_logins: number
  had_social_accounts: boolean
  deleted_at: string
  deleted_by_admin: boolean
  admin_id?: string
}

/**
 * 사용자 블랙리스트 타입
 */
export interface UserBlacklist {
  id: string
  phone_hash: string
  email_hash?: string
  ip_address?: string
  blacklist_reason: 'excessive_signup_deletion' | 'fraud_suspicion' | 'abuse' | 'admin_decision' | 'automated_behavior'
  evidence_data?: any
  blocked_until?: string
  created_by?: string
  created_at: string
  updated_at: string
}

/**
 * 인증 제한 타입
 */
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

/**
 * NextJS 15: Server Action 결과 타입
 */
export interface ServerActionResult<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * 비밀번호 변경 이력 조회 결과
 */
export interface PasswordChangeHistory {
  created_at: string
  reason: string
  metadata?: {
    action: string
    method: string
    username?: string
    phone_masked?: string
    timestamp: string
    user_agent?: string
  }
}

/**
 * 사용자 통계 타입
 */
export interface UserStats {
  total_users: number
  admin_count: number
  editor_count: number
  user_count: number
  male_count: number
  female_count: number
  unknown_gender_count: number
  new_users_last_30days: number
  new_users_last_7days: number
  active_users_last_30days: number
  active_users_last_7days: number
}

/**
 * 폼 검증 상태 타입
 */
export interface FormValidationState {
  isValid: boolean
  errors: Record<string, string>
  touched: Record<string, boolean>
}

/**
 * 비밀번호 정책 설정
 */
export interface PasswordPolicy {
  minLength: number
  maxLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSpecialChars: boolean
  preventRepetition: boolean
  preventCommonPasswords: boolean
  maxAge: number // days
}

/**
 * NextJS 15: 클라이언트 컴포넌트 props 타입
 */
export interface AuthProviderProps {
  children: React.ReactNode
  initialUser?: User | null
}

/**
 * 컨텍스트 상태 타입
 */
export interface AuthContextState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: { username: string; password: string }) => Promise<LoginResponse>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => void
  refreshUser: () => Promise<void>
}

/**
 * 일별 가입 데이터
 */
export interface DailySignupData {
  date: string;
  signups: number;
}

/**
 * 확장된 사용자 통계 (일별 가입 데이터 포함)
 */
export interface ExtendedUserStats extends UserStats {
  dailySignups: DailySignupData[];
}

/**
 * 이메일 인증 요청 타입
 */
export interface EmailVerificationRequest {
  email: string
}

/**
 * 이메일 인증 코드 확인 요청 타입
 */
export interface EmailVerificationCodeRequest {
  email: string
  code: string
}

/**
 * 이메일 인증 응답 타입
 */
export interface EmailVerificationResponse {
  success: boolean
  message?: string
  error?: string
  expiresIn?: number
  available?: boolean
}

/**
 * 비밀번호 재설정 (이메일 인증) 요청 타입
 */
export interface ResetPasswordWithEmailRequest {
  email: string
  emailVerificationCode: string
  newPassword: string
  confirmPassword: string
}

/**
 * 이메일 인증 기반 비밀번호 변경 요청 타입
 */
export interface EmailBasedPasswordChangeRequest {
  email: string
  verificationCode: string
  newPassword: string
  confirmPassword: string
}

/**
 * 이메일 인증 기반 비밀번호 변경 응답 타입
 */
export interface EmailBasedPasswordChangeResponse {
  success: boolean
  message?: string
  error?: string
}

/**
 * 이메일 인증 상태 타입
 */
export interface EmailVerificationStatus {
  email: string
  isVerified: boolean
  expiresAt?: string
}