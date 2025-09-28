// src/lib/validations/auth.ts
import { z } from 'zod'

/**
 * 로그인 스키마
 */
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, '사용자명을 입력해주세요')
    .max(30, '사용자명은 30자를 초과할 수 없습니다'),
  password: z
    .string()
    .min(1, '비밀번호를 입력해주세요')
    .max(128, '비밀번호는 128자를 초과할 수 없습니다')
})

/**
 * 비밀번호 변경 스키마 - NextJS 15 최적화
 */
export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, '현재 비밀번호를 입력해주세요')
    .max(128, '비밀번호는 128자를 초과할 수 없습니다'),
  newPassword: z
    .string()
    .min(8, '새 비밀번호는 8자 이상이어야 합니다')
    .max(128, '새 비밀번호는 128자를 초과할 수 없습니다')
    .regex(/[a-z]/, '소문자를 포함해야 합니다')
    .regex(/[A-Z]/, '대문자를 포함해야 합니다')
    .regex(/\d/, '숫자를 포함해야 합니다')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, '특수문자를 포함해야 합니다')
    .refine((password) => {
      // 3회 이상 반복되는 문자가 없는지 확인
      return !/(.)\1{2,}/.test(password)
    }, '반복되는 문자를 줄여주세요'),
  confirmNewPassword: z
    .string()
    .min(1, '새 비밀번호 확인을 입력해주세요')
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: '새 비밀번호가 일치하지 않습니다',
  path: ['confirmNewPassword']
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: '현재 비밀번호와 동일한 비밀번호는 사용할 수 없습니다',
  path: ['newPassword']
})

/**
 * 회원가입 스키마
 */
export const signupSchema = z.object({
  name: z
    .string()
    .min(1, '이름을 입력해주세요')
    .max(50, '이름은 50자를 초과할 수 없습니다')
    .regex(/^[가-힣a-zA-Z\s]+$/, '이름은 한글, 영문만 입력 가능합니다'),
  username: z
    .string()
    .min(3, '사용자명은 3자 이상이어야 합니다')
    .max(30, '사용자명은 30자를 초과할 수 없습니다')
    .regex(/^[a-zA-Z0-9_]+$/, '사용자명은 영문, 숫자, 언더스코어만 사용 가능합니다'),
  password: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 합니다')
    .max(128, '비밀번호는 128자를 초과할 수 없습니다')
    .regex(/[a-z]/, '소문자를 포함해야 합니다')
    .regex(/[A-Z]/, '대문자를 포함해야 합니다')
    .regex(/\d/, '숫자를 포함해야 합니다')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, '특수문자를 포함해야 합니다'),
  confirmPassword: z
    .string()
    .min(1, '비밀번호 확인을 입력해주세요'),
  phone: z
    .string()
    .min(1, '전화번호를 입력해주세요')
    .regex(/^01[0-9]-\d{3,4}-\d{4}$/, '올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)'),
  gender: z.enum(['male', 'female', 'none'])
    .refine((val) => val !== undefined, { message: '성별을 선택해주세요' }),
  birthDate: z
    .string()
    .min(1, '생년월일을 입력해주세요')
    .regex(/^\d{4}-\d{2}-\d{2}$/, '올바른 날짜 형식이 아닙니다 (YYYY-MM-DD)')
    .refine((date) => {
      const birthDate = new Date(date)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      return age >= 14 && age <= 120
    }, '만 14세 이상이어야 합니다'),
  company: z
    .string()
    .max(100, '회사명은 100자를 초과할 수 없습니다')
    .optional(),
  address: z
    .string()
    .max(200, '주소는 200자를 초과할 수 없습니다')
    .optional(),
  addressDetail: z
    .string()
    .max(100, '상세주소는 100자를 초과할 수 없습니다')
    .optional(),
  zipCode: z
    .string()
    .regex(/^\d{5}$/, '우편번호는 5자리 숫자여야 합니다')
    .optional(),
  privacyConsent: z
    .boolean()
    .refine((val) => val === true, '개인정보 수집 및 이용에 동의해주세요'),
  marketingConsent: z.boolean().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword']
})

/**
 * 비밀번호 재설정 스키마
 */
export const resetPasswordSchema = z.object({
  phone: z
    .string()
    .min(1, '전화번호를 입력해주세요')
    .regex(/^01[0-9]-\d{3,4}-\d{4}$/, '올바른 전화번호 형식이 아닙니다'),
  newPassword: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 합니다')
    .max(128, '비밀번호는 128자를 초과할 수 없습니다')
    .regex(/[a-z]/, '소문자를 포함해야 합니다')
    .regex(/[A-Z]/, '대문자를 포함해야 합니다')
    .regex(/\d/, '숫자를 포함해야 합니다')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, '특수문자를 포함해야 합니다'),
  confirmPassword: z
    .string()
    .min(1, '비밀번호 확인을 입력해주세요'),
  verificationCode: z
    .string()
    .min(1, '인증번호를 입력해주세요')
    .length(6, '인증번호는 6자리입니다')
    .regex(/^\d{6}$/, '인증번호는 숫자 6자리여야 합니다')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword']
})

/**
 * 사용자 프로필 업데이트 스키마
 */
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, '이름을 입력해주세요')
    .max(50, '이름은 50자를 초과할 수 없습니다')
    .regex(/^[가-힣a-zA-Z\s]+$/, '이름은 한글, 영문만 입력 가능합니다'),
  company: z
    .string()
    .max(100, '회사명은 100자를 초과할 수 없습니다')
    .optional(),
  address: z
    .string()
    .max(200, '주소는 200자를 초과할 수 없습니다')
    .optional(),
  addressDetail: z
    .string()
    .max(100, '상세주소는 100자를 초과할 수 없습니다')
    .optional(),
  zipCode: z
    .string()
    .regex(/^\d{5}$/, '우편번호는 5자리 숫자여야 합니다')
    .optional()
    .or(z.literal(''))
})

/**
 * 이메일 검증 스키마
 */
export const emailSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .max(255, '이메일은 255자를 초과할 수 없습니다')
    .email('올바른 이메일 형식이 아닙니다')
})

/**
 * 전화번호 검증 스키마
 */
export const phoneSchema = z.object({
  phone: z
    .string()
    .min(1, '전화번호를 입력해주세요')
    .regex(/^01[0-9]-\d{3,4}-\d{4}$/, '올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)')
})

/**
 * 인증번호 검증 스키마
 */
export const verificationCodeSchema = z.object({
  code: z
    .string()
    .min(1, '인증번호를 입력해주세요')
    .length(6, '인증번호는 6자리입니다')
    .regex(/^\d{6}$/, '인증번호는 숫자 6자리여야 합니다')
})

// 타입 정의
export type LoginData = z.infer<typeof loginSchema>
export type ChangePasswordData = z.infer<typeof changePasswordSchema>
export type SignupData = z.infer<typeof signupSchema>
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>
export type UpdateProfileData = z.infer<typeof updateProfileSchema>
export type EmailData = z.infer<typeof emailSchema>
export type PhoneData = z.infer<typeof phoneSchema>
export type VerificationCodeData = z.infer<typeof verificationCodeSchema>

/**
 * 공통 에러 메시지
 */
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: '사용자명 또는 비밀번호가 올바르지 않습니다.',
  USER_NOT_FOUND: '사용자를 찾을 수 없습니다.',
  SESSION_EXPIRED: '세션이 만료되었습니다. 다시 로그인해주세요.',
  UNAUTHORIZED: '권한이 없습니다.',
  PASSWORD_MISMATCH: '비밀번호가 일치하지 않습니다.',
  WEAK_PASSWORD: '더 강한 비밀번호를 사용해주세요.',
  SAME_PASSWORD: '현재 비밀번호와 동일한 비밀번호는 사용할 수 없습니다.',
  PHONE_ALREADY_EXISTS: '이미 사용 중인 전화번호입니다.',
  USERNAME_ALREADY_EXISTS: '이미 사용 중인 사용자명입니다.',
  VERIFICATION_FAILED: '인증에 실패했습니다.',
  SERVER_ERROR: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
} as const

/**
 * NextJS 15: 향상된 검증 헬퍼 함수
 */
export function createValidationError(message: string, path?: string[]) {
  return {
    success: false,
    error: {
      message,
      path: path || []
    }
  }
}

/**
 * 서버 사이드 검증 래퍼
 */
export async function validateServerAction<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const result = schema.safeParse(data)
    
    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message || '유효하지 않은 입력입니다.'
      return { success: false, error: errorMessage }
    }
    
    return { success: true, data: result.data }
  } catch (error) {
    console.error('Validation error:', error)
    return { success: false, error: AUTH_ERRORS.SERVER_ERROR }
  }
}