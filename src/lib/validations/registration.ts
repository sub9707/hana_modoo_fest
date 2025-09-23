import { z } from 'zod'

// 기본 유효성 검증 함수들
const koreanPhoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/
const zipCodeRegex = /^\d{5}$/

// 참가자 유형 스키마
export const participantTypeSchema = z.enum([
  'citizen',
  'single-parent', 
  'self-help',
  'volunteer',
  'organization'
], {
  message: '올바른 참가 유형을 선택해주세요.'
})

// 등록 상태 스키마
export const registrationStatusSchema = z.enum([
  'pending',
  'confirmed',
  'cancelled'
], {
  message: '올바른 등록 상태를 선택해주세요.'
})

// 이메일 스키마
export const emailSchema = z
  .string({ message: '이메일을 입력해주세요.' })
  .min(1, '이메일을 입력해주세요.')
  .email('올바른 이메일 형식이 아닙니다.')
  .max(100, '이메일은 100자 이내로 입력해주세요.')

// 전화번호 스키마
export const phoneSchema = z
  .string({ message: '전화번호를 입력해주세요.' })
  .min(1, '전화번호를 입력해주세요.')
  .regex(koreanPhoneRegex, '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)')

// 우편번호 스키마
export const zipCodeSchema = z
  .string({ message: '우편번호를 입력해주세요.' })
  .min(1, '우편번호를 입력해주세요.')
  .regex(zipCodeRegex, '올바른 우편번호 형식이 아닙니다. (5자리 숫자)')

// 주소 스키마
export const addressSchema = z
  .string({ message: '주소를 입력해주세요.' })
  .min(1, '주소를 입력해주세요.')
  .max(200, '주소는 200자 이내로 입력해주세요.')

// 상세주소 스키마 (선택사항)
export const addressDetailSchema = z
  .string()
  .max(100, '상세주소는 100자 이내로 입력해주세요.')
  .optional()

// 동반자 수 스키마
export const companionsSchema = z
  .number({ message: '올바른 숫자를 입력해주세요.' })
  .int('정수를 입력해주세요.')
  .min(0, '동반자 수는 0명 이상이어야 합니다.')
  .max(10, '동반자 수는 10명을 초과할 수 없습니다.')

// 동반자 세부정보 스키마 (선택사항)
export const companionDetailsSchema = z
  .string()
  .max(500, '동반자 정보는 500자 이내로 입력해주세요.')
  .optional()

// 특별 요청사항 스키마 (선택사항)
export const specialRequestsSchema = z
  .string()
  .max(1000, '특별 요청사항은 1000자 이내로 입력해주세요.')
  .optional()

// 동의 스키마
export const consentSchema = z
  .boolean({ message: '동의 여부를 선택해주세요.' })

// 필수 동의 스키마
export const requiredConsentSchema = z
  .boolean({ message: '필수 동의가 필요합니다.' })
  .refine(val => val === true, {
    message: '필수 동의 항목에 동의해주세요.'
  })

// 등록 폼 데이터 스키마
export const registrationFormSchema = z.object({
  participant_type: participantTypeSchema,
  companions: companionsSchema,
  companion_details: companionDetailsSchema,
  address: addressSchema,
  address_detail: addressDetailSchema,
  zip_code: zipCodeSchema,
  special_requests: specialRequestsSchema,
  privacy_consent: requiredConsentSchema,
  marketing_consent: consentSchema
}).refine((data) => {
  // 동반자가 있으면 동반자 정보가 있는 것이 좋음 (경고용)
  if (data.companions > 0 && !data.companion_details?.trim()) {
    return true // 필수는 아니므로 true 반환
  }
  return true
}, {
  message: '동반자가 있는 경우 동반자 정보를 입력하는 것을 권장합니다.',
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

// 등록번호 검증 스키마
export const registrationNumberSchema = z
  .string({ message: '등록번호를 입력해주세요.' })
  .min(1, '등록번호를 입력해주세요.')
  .regex(/^MH\d{4}-[A-Z0-9]{8,12}$/, '올바른 등록번호 형식이 아닙니다.')

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
  file: z.instanceof(File, { message: 'CSV 파일을 선택해주세요.' }),
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