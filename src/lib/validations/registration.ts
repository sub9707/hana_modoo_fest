import { z } from 'zod'

// 참가자 유형
export const participantTypeSchema = z.enum([
  'citizen',
  'single-parent',
  'self-help',
  'volunteer',
  'organization'
], { message: '참가자 유형을 선택해주세요.' })

// 신청 상태
export const registrationStatusSchema = z.enum([
  'pending',
  'confirmed',
  'cancelled'
], { message: '올바른 상태값이 아닙니다.' })

// 동반자 수
export const companionsSchema = z
  .number({ message: '동반자 수는 숫자여야 합니다.' })
  .int('동반자 수는 정수여야 합니다.')
  .min(0, '동반자 수는 0명 이상이어야 합니다.')
  .max(10, '동반자 수는 최대 10명까지 가능합니다.')

// 동반자 상세정보
export const companionDetailsSchema = z
  .string()
  .max(500, '동반자 정보는 500자 이내로 입력해주세요.')
  .optional()
  .nullable()

// 주소
export const addressSchema = z
  .string({ message: '주소를 입력해주세요.' })
  .min(1, '주소를 입력해주세요.')
  .max(200, '주소는 200자 이내로 입력해주세요.')

// 상세주소
export const addressDetailSchema = z
  .string()
  .max(100, '상세주소는 100자 이내로 입력해주세요.')
  .optional()
  .nullable()

// 우편번호
export const zipCodeSchema = z
  .string({ message: '우편번호를 입력해주세요.' })
  .min(1, '우편번호를 입력해주세요.')
  .regex(/^\d{5}$/, '올바른 우편번호 형식이 아닙니다. (5자리)')

// 특별 요청사항
export const specialRequestsSchema = z
  .string()
  .max(1000, '특별 요청사항은 1000자 이내로 입력해주세요.')
  .optional()
  .nullable()

// 동의 여부
export const consentSchema = z.boolean()

// 필수 동의
export const requiredConsentSchema = z
  .boolean()
  .refine(val => val === true, { message: '필수 동의 항목입니다.' })

// 등록 폼 스키마
export const registrationFormSchema = z.object({
  participant_type: participantTypeSchema,
  companions: companionsSchema,
  companion_details: companionDetailsSchema,
  address: addressSchema,
  address_detail: addressDetailSchema,
  zip_code: zipCodeSchema,
  special_requests: specialRequestsSchema,
  marketing_consent: consentSchema,
  privacy_consent: requiredConsentSchema
}).refine(data => {
  if (data.companions > 0 && !data.companion_details) {
    return false
  }
  return true
}, {
  message: '동반자가 있는 경우 동반자 정보를 입력해주세요.',
  path: ['companion_details']
})

// 등록 업데이트 스키마 (일부 필드만 수정 가능)
export const registrationUpdateSchema = z.object({
  companions: companionsSchema.optional(),
  companion_details: companionDetailsSchema,
  address: addressSchema.optional(),
  address_detail: addressDetailSchema,
  zip_code: zipCodeSchema.optional(),
  special_requests: specialRequestsSchema,
  marketing_consent: consentSchema.optional()
}).partial()

// 등록 상태 변경 스키마
export const registrationStatusUpdateSchema = z.object({
  status: registrationStatusSchema,
  reason: z.string().max(200, '사유는 200자 이내로 입력해주세요.').optional()
})

// 등록 검색 스키마
export const registrationSearchSchema = z.object({
  query: z.string().max(100, '검색어는 100자 이내로 입력해주세요.').optional(),
  participant_type: participantTypeSchema.optional(),
  status: registrationStatusSchema.optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20)
}).partial()

// 등록번호 검증 스키마 (숫자 1~5자리로 수정)
export const registrationNumberSchema = z
  .string({ message: '등록번호를 입력해주세요.' })
  .min(1, '등록번호를 입력해주세요.')
  .regex(/^\d{1,5}$/, '올바른 등록번호 형식이 아닙니다. (숫자 1~5자리)')

// 관리자용 등록 생성 스키마
export const adminRegistrationSchema = z.object({
  user_id: z.string().uuid('올바른 사용자 ID 형식이 아닙니다.'),
  participant_type: participantTypeSchema,
  companions: companionsSchema,
  companion_details: companionDetailsSchema,
  address: addressSchema,
  address_detail: addressDetailSchema,
  zip_code: zipCodeSchema,
  special_requests: specialRequestsSchema,
  privacy_consent: requiredConsentSchema,
  marketing_consent: consentSchema,
  status: registrationStatusSchema.default('confirmed')
})

// 대량 등록 스키마
export const bulkRegistrationSchema = z.object({
  registrations: z.array(adminRegistrationSchema).min(1, '최소 1개의 등록이 필요합니다.').max(100, '한 번에 최대 100개까지 등록 가능합니다.')
})

// CSV 업로드 스키마
export const csvRegistrationSchema = z.object({
  file: z.instanceof(File, { message: 'CSV 파일을 선택해주세요.' })
    .refine(file => file.type === 'text/csv' || file.name.endsWith('.csv'), {
      message: 'CSV 파일만 업로드 가능합니다.'
    })
    .refine(file => file.size <= 10 * 1024 * 1024, {
      message: '파일 크기는 10MB를 초과할 수 없습니다.'
    }),
  override: z.boolean().default(false)
})

// 스키마 타입 추출
export type RegistrationFormData = z.infer<typeof registrationFormSchema>
export type RegistrationUpdateData = z.infer<typeof registrationUpdateSchema>
export type RegistrationStatusUpdate = z.infer<typeof registrationStatusUpdateSchema>
export type RegistrationSearch = z.infer<typeof registrationSearchSchema>
export type AdminRegistrationData = z.infer<typeof adminRegistrationSchema>
export type BulkRegistrationData = z.infer<typeof bulkRegistrationSchema>
export type CsvRegistrationData = z.infer<typeof csvRegistrationSchema>

// 검증 도우미 함수들
export function validateRegistrationForm(data: unknown): RegistrationFormData {
  return registrationFormSchema.parse(data)
}

export function validateRegistrationUpdate(data: unknown): RegistrationUpdateData {
  return registrationUpdateSchema.parse(data)
}

export function validateRegistrationNumber(regNumber: unknown): string {
  return registrationNumberSchema.parse(regNumber)
}

// 안전한 검증 함수들 (에러를 throw하지 않음)
export function safeValidateRegistrationForm(data: unknown) {
  return registrationFormSchema.safeParse(data)
}

export function safeValidateRegistrationUpdate(data: unknown) {
  return registrationUpdateSchema.safeParse(data)
}

export function safeValidateRegistrationNumber(regNumber: unknown) {
  return registrationNumberSchema.safeParse(regNumber)
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

// 직접 회원가입 스키마
export const directRegistrationSchema = z.object({
  name: z.string()
    .min(2, '이름은 2자 이상이어야 합니다')
    .max(50, '이름은 50자를 초과할 수 없습니다')
    .regex(/^[가-힣a-zA-Z\s]+$/, '이름은 한글, 영문만 입력 가능합니다'),
  
  username: z.string()
    .min(4, '사용자명은 4자 이상이어야 합니다')
    .max(30, '사용자명은 30자를 초과할 수 없습니다')
    .regex(/^[a-zA-Z0-9_]+$/, '사용자명은 영문, 숫자, 언더스코어(_)만 사용 가능합니다')
    .refine(val => !/^\d+$/.test(val), '사용자명은 숫자로만 구성될 수 없습니다'),
  
  password: z.string()
    .min(8, '비밀번호는 8자 이상이어야 합니다')
    .max(128, '비밀번호는 128자를 초과할 수 없습니다')
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z\d!@#$%^&*(),.?":{}|<>]+$/, 
           '비밀번호는 영문, 숫자, 특수문자를 모두 포함해야 합니다'),
  
  confirmPassword: z.string(),
  
  phone: z.string()
    .regex(/^010\d{8}$/, '올바른 휴대폰 번호를 입력해주세요 (010-0000-0000)')
    .length(11, '휴대폰 번호는 11자리여야 합니다'),
  
  gender: z.enum(['male', 'female', 'none'], {
    message: '성별을 선택해주세요'
  }),
  
  birthDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '올바른 생년월일을 입력해주세요 (YYYY-MM-DD)')
    .refine(val => {
      const date = new Date(val)
      const now = new Date()
      const age = now.getFullYear() - date.getFullYear()
      return age >= 0 && age <= 100
    }, '올바른 생년월일을 입력해주세요'),
  
  company: z.string().max(100, '회사명은 100자를 초과할 수 없습니다').optional(),
  
  address: z.string().max(200, '주소는 200자를 초과할 수 없습니다').optional(),
  
  addressDetail: z.string().max(100, '상세주소는 100자를 초과할 수 없습니다').optional(),
  
  zipCode: z.string()
    .regex(/^\d{5}$/, '우편번호는 5자리 숫자여야 합니다')
    .optional()
    .or(z.literal('')),
  
  agreedToTerms: z.boolean()
    .refine(val => val === true, '이용약관에 동의해주세요'),
  
  agreedToPrivacy: z.boolean()
    .refine(val => val === true, '개인정보처리방침에 동의해주세요'),
  
  agreedToMarketing: z.boolean().optional(),

  parentalConsent: z.boolean().optional()
  
}).refine(data => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword']
})

export type DirectRegistrationData = z.infer<typeof directRegistrationSchema>

// 사용자명 중복 확인 스키마
export const usernameCheckSchema = z.object({
  username: z.string()
    .min(4, '사용자명은 4자 이상이어야 합니다')
    .max(30, '사용자명은 30자를 초과할 수 없습니다')
    .regex(/^[a-zA-Z0-9_]+$/, '사용자명은 영문, 숫자, 언더스코어(_)만 사용 가능합니다')
})

// 전화번호 중복 확인 스키마
export const phoneCheckSchema = z.object({
  phone: z.string()
    .regex(/^010\d{8}$/, '올바른 휴대폰 번호를 입력해주세요')
    .length(11, '휴대폰 번호는 11자리여야 합니다')
})