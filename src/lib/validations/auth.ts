// src/lib/validations/auth.ts
import { z } from 'zod'

// 기본 검증 패턴들
const koreanPhoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/
const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/
const strongPasswordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/

// 로그인 스키마
export const loginSchema = z.object({
  username: z.string()
    .min(1, '사용자명을 입력해주세요')
    .trim(),
  password: z.string()
    .min(1, '비밀번호를 입력해주세요')
})

// 회원가입 기본 스키마
export const baseRegistrationSchema = z.object({
  name: z.string()
    .min(2, '이름은 2글자 이상 입력해주세요')
    .max(50, '이름은 50글자 이하로 입력해주세요')
    .trim(),
  username: z.string()
    .min(3, '사용자명은 3글자 이상 입력해주세요')
    .max(30, '사용자명은 30글자 이하로 입력해주세요')
    .regex(usernameRegex, '사용자명은 영문, 숫자, 언더스코어만 사용 가능합니다')
    .trim(),
  password: z.string()
    .min(8, '비밀번호는 8글자 이상 입력해주세요')
    .max(128, '비밀번호는 128글자 이하로 입력해주세요')
    .regex(strongPasswordRegex, '영문, 숫자, 특수문자를 모두 포함해야 합니다'),
  confirmPassword: z.string()
    .min(1, '비밀번호 확인을 입력해주세요'),
  phone: z.string()
    .min(1, '전화번호를 입력해주세요')
    .regex(koreanPhoneRegex, '올바른 전화번호 형식이 아닙니다')
    .transform(val => val.replace(/-/g, '')),
  gender: z.enum(['male', 'female', 'none'], {
    message: '성별을 선택해주세요'
  }),
  birthDate: z.string()
    .min(1, '생년월일을 입력해주세요')
    .regex(/^\d{4}-\d{2}-\d{2}$/, '올바른 날짜 형식이 아닙니다 (YYYY-MM-DD)'),
  company: z.string()
    .max(100, '회사명은 100글자 이하로 입력해주세요')
    .optional()
}).refine(data => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword']
})

// 전화번호 회원가입 스키마
export const phoneRegistrationSchema = baseRegistrationSchema.safeExtend({
  signupMethod: z.literal('phone')
})

// SNS 회원가입 스키마
export const socialRegistrationSchema = baseRegistrationSchema.safeExtend({
  signupMethod: z.enum(['naver', 'kakao']),
  email: z.string()
    .email('올바른 이메일 형식이 아닙니다')
    .optional(),
  profileImage: z.string().url().optional(),
  socialId: z.string().min(1, 'SNS ID가 필요합니다'),
  autoGenerate: z.boolean().default(false)
})

// 전화번호 인증 스키마
export const phoneVerificationSchema = z.object({
  phone: z.string()
    .min(1, '전화번호를 입력해주세요')
    .regex(koreanPhoneRegex, '올바른 전화번호 형식이 아닙니다')
    .transform(val => val.replace(/-/g, ''))
})

// 인증번호 확인 스키마
export const verificationCodeSchema = z.object({
  phone: z.string()
    .min(1, '전화번호를 입력해주세요')
    .regex(/^01[0-9]{9}$/, '올바른 전화번호 형식이 아닙니다'),
  code: z.string()
    .length(6, '인증번호는 6자리입니다')
    .regex(/^\d{6}$/, '숫자만 입력해주세요')
})

// 비밀번호 찾기 스키마
export const forgotPasswordSchema = z.object({
  phone: z.string()
    .min(1, '전화번호를 입력해주세요')
    .regex(koreanPhoneRegex, '올바른 전화번호 형식이 아닙니다')
    .transform(val => val.replace(/-/g, ''))
})

// 비밀번호 재설정 스키마
export const resetPasswordSchema = z.object({
  token: z.string().min(1, '재설정 토큰이 필요합니다'),
  phone: z.string()
    .min(1, '전화번호를 입력해주세요')
    .regex(/^01[0-9]{9}$/, '올바른 전화번호 형식이 아닙니다'),
  password: z.string()
    .min(8, '비밀번호는 8글자 이상 입력해주세요')
    .max(128, '비밀번호는 128글자 이하로 입력해주세요')
    .regex(strongPasswordRegex, '영문, 숫자, 특수문자를 모두 포함해야 합니다'),
  confirmPassword: z.string()
    .min(1, '비밀번호 확인을 입력해주세요')
}).refine(data => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword']
})

// 비밀번호 변경 스키마
export const changePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, '현재 비밀번호를 입력해주세요'),
  newPassword: z.string()
    .min(8, '새 비밀번호는 8글자 이상 입력해주세요')
    .max(128, '새 비밀번호는 128글자 이하로 입력해주세요')
    .regex(strongPasswordRegex, '영문, 숫자, 특수문자를 모두 포함해야 합니다'),
  confirmNewPassword: z.string()
    .min(1, '새 비밀번호 확인을 입력해주세요')
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: '새 비밀번호가 일치하지 않습니다',
  path: ['confirmNewPassword']
}).refine(data => data.currentPassword !== data.newPassword, {
  message: '현재 비밀번호와 동일한 비밀번호는 사용할 수 없습니다',
  path: ['newPassword']
})

// 회원 탈퇴 스키마
export const deleteAccountSchema = z.object({
  password: z.string()
    .min(1, '현재 비밀번호를 입력해주세요'),
  reason: z.enum([
    'privacy_concern',
    'service_dissatisfaction', 
    'no_longer_needed',
    'duplicate_account',
    'other'
  ]).optional(),
  reasonDetail: z.string()
    .max(500, '상세 사유는 500자 이내로 입력해주세요')
    .optional(),
  confirmDelete: z.boolean()
    .refine(val => val === true, '탈퇴 확인이 필요합니다'),
  agreeRestriction: z.boolean()
    .refine(val => val === true, '재가입 제한 안내에 동의해주세요')
})

// 프로필 업데이트 스키마
export const profileUpdateSchema = z.object({
  name: z.string()
    .min(2, '이름은 2글자 이상 입력해주세요')
    .max(50, '이름은 50글자 이하로 입력해주세요')
    .trim()
    .optional(),
  company: z.string()
    .max(100, '회사명은 100글자 이하로 입력해주세요')
    .optional(),
  phone: z.string()
    .regex(koreanPhoneRegex, '올바른 전화번호 형식이 아닙니다')
    .transform(val => val?.replace(/-/g, ''))
    .optional(),
  gender: z.enum(['male', 'female', 'none'])
    .optional(),
  birthDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '올바른 날짜 형식이 아닙니다 (YYYY-MM-DD)')
    .optional()
})

// OAuth 제공자 스키마
export const oauthProviderSchema = z.enum(['naver', 'kakao'], {
  message: '지원하는 OAuth 제공자가 아닙니다'
})

// OAuth 콜백 스키마
export const oauthCallbackSchema = z.object({
  code: z.string().min(1, '인증 코드가 필요합니다'),
  state: z.string().min(1, 'state 파라미터가 필요합니다'),
  provider: oauthProviderSchema
})

// 사용자 검색 스키마
export const userSearchSchema = z.object({
  query: z.string().max(100, '검색어는 100글자 이하로 입력해주세요').optional(),
  role: z.enum(['admin', 'editor', 'user']).optional(),
  signupMethod: z.enum(['phone', 'naver', 'kakao']).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20)
})

// 타입 추출
export type LoginFormData = z.infer<typeof loginSchema>
export type BaseRegistrationData = z.infer<typeof baseRegistrationSchema>
export type PhoneRegistrationData = z.infer<typeof phoneRegistrationSchema>
export type SocialRegistrationData = z.infer<typeof socialRegistrationSchema>
export type PhoneVerificationData = z.infer<typeof phoneVerificationSchema>
export type VerificationCodeData = z.infer<typeof verificationCodeSchema>
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>
export type ChangePasswordData = z.infer<typeof changePasswordSchema>
export type DeleteAccountData = z.infer<typeof deleteAccountSchema>
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>
export type OAuthProviderData = z.infer<typeof oauthProviderSchema>
export type OAuthCallbackData = z.infer<typeof oauthCallbackSchema>
export type UserSearchData = z.infer<typeof userSearchSchema>

// 검증 도우미 함수들
export function validateLogin(data: unknown): LoginFormData {
  return loginSchema.parse(data)
}

export function validatePhoneRegistration(data: unknown): PhoneRegistrationData {
  return phoneRegistrationSchema.parse(data)
}

export function validateSocialRegistration(data: unknown): SocialRegistrationData {
  return socialRegistrationSchema.parse(data)
}

export function validatePhoneVerification(data: unknown): PhoneVerificationData {
  return phoneVerificationSchema.parse(data)
}

export function validateVerificationCode(data: unknown): VerificationCodeData {
  return verificationCodeSchema.parse(data)
}

export function validateChangePassword(data: unknown): ChangePasswordData {
  return changePasswordSchema.parse(data)
}

export function validateDeleteAccount(data: unknown): DeleteAccountData {
  return deleteAccountSchema.parse(data)
}

// 안전한 검증 함수들 (에러를 throw하지 않음)
export function safeValidateLogin(data: unknown) {
  return loginSchema.safeParse(data)
}

export function safeValidatePhoneRegistration(data: unknown) {
  return phoneRegistrationSchema.safeParse(data)
}

export function safeValidateChangePassword(data: unknown) {
  return changePasswordSchema.safeParse(data)
}

export function safeValidateDeleteAccount(data: unknown) {
  return deleteAccountSchema.safeParse(data)
}

// 에러 메시지 변환 함수
export function formatValidationErrors(error: z.ZodError): Record<string, string> {
  const formattedErrors: Record<string, string> = {}
  
  error.issues.forEach((issue) => {
    const path = issue.path.join('.')
    formattedErrors[path] = issue.message
  })
  
  return formattedErrors
}

// 필드별 에러 메시지 추출
export function getFieldError(error: z.ZodError, fieldName: string): string | undefined {
  const fieldError = error.issues.find(issue => 
    issue.path.length > 0 && issue.path[0] === fieldName
  )
  return fieldError?.message
}