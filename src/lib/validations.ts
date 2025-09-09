import { z } from 'zod'

export const registrationSchema = z.object({
  name: z.string().min(2, '이름을 2자 이상 입력해주세요'),
  phone: z.string().regex(/^010-\d{4}-\d{4}$/, '올바른 휴대폰 번호를 입력해주세요 (예: 010-1234-5678)'),
  email: z.string().email('올바른 이메일 주소를 입력해주세요'),
  type: z.enum(['citizen', 'single-parent', 'support-group', 'volunteer', 'organization']),
  accompaniedCount: z.number().min(0).max(10, '동반인원은 최대 10명까지 가능합니다'),
  interestedPrograms: z.array(z.string()).min(1, '관심 프로그램을 최소 1개 이상 선택해주세요'),
  privacyConsent: z.boolean().refine(val => val === true, '개인정보 수집·이용 동의는 필수입니다'),
  marketingConsent: z.boolean().optional(),
  emergencyContact: z.string().optional(),
  specialRequests: z.string().max(500, '특별 요청사항은 500자 이내로 입력해주세요').optional()
})

export const campaignUploadSchema = z.object({
  type: z.enum(['hashtag', 'photo', 'story']),
  content: z.string().min(10, '내용을 10자 이상 입력해주세요').max(1000, '내용은 1000자 이내로 입력해주세요'),
  hashtags: z.array(z.string()).min(1, '해시태그를 최소 1개 이상 입력해주세요').max(10, '해시태그는 최대 10개까지 가능합니다'),
  nickname: z.string().min(2, '닉네임을 2자 이상 입력해주세요').max(20, '닉네임은 20자 이내로 입력해주세요'),
  isAnonymous: z.boolean().optional(),
  privacyConsent: z.boolean().refine(val => val === true, '개인정보 수집·이용 동의는 필수입니다')
})