// 참가자 유형
export type ParticipantType = 'citizen' | 'single-parent' | 'self-help' | 'volunteer' | 'organization'

// 신청 상태
export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled'

// 카카오 우편번호 API 응답 타입
export interface KakaoAddress {
  address: string           // 기본 주소
  roadAddress: string       // 도로명 주소  
  jibunAddress: string      // 지번 주소
  zonecode: string          // 우편번호 (5자리)
  zip_code: string          // 우편번호 별칭
  addressType: 'R' | 'J'    // R: 도로명, J: 지번
  userSelectedType: 'R' | 'J' // 사용자가 선택한 주소 타입
  bname: string             // 법정동명
  buildingName: string      // 건물명
  apartment: 'Y' | 'N'      // 공동주택 여부
  sido: string              // 시도
  sigungu: string           // 시군구
  roadname: string          // 도로명
  buildingCode: string      // 건물관리번호
  postcode: string          // 구 우편번호 (6자리)
  postcode1: string         // 구 우편번호 앞 3자리
  postcode2: string         // 구 우편번호 뒤 3자리
  postcodeSeq: string       // 우편번호 일련번호
}

// 기본 Registration 인터페이스
export interface Registration {
  id: string
  user_id: string
  registration_number: string
  participant_type: ParticipantType
  companions: number
  companion_details: string | null
  address: string
  address_detail: string | null
  zip_code: string
  special_requests: string | null
  marketing_consent: boolean
  privacy_consent: boolean
  status: RegistrationStatus
  created_at: string
  updated_at: string
}

// 사용자 정보가 포함된 Registration (관리자 페이지용)
export interface RegistrationWithUser extends Registration {
  name: string
  phone: string
  email?: string
  gender?: string
  birth_date?: string
}

// API 응답 인터페이스
export interface RegistrationResponse {
  items: RegistrationWithUser[]
  total: number
  page: number
  totalPages: number
}

// 사전참가신청 폼 데이터
export interface RegistrationFormData {
  participant_type: ParticipantType
  companions: number
  companion_details?: string
  address: string
  address_detail?: string
  zip_code: string
  special_requests?: string
  marketing_consent: boolean
  privacy_consent: boolean
}

// 참가자 유형 옵션
export interface ParticipantTypeOption {
  id: ParticipantType
  label: string
  description: string
  icon?: string
}

// 통계 데이터
export interface RegistrationStats {
  total: number
  confirmed: number
  pending: number
  cancelled: number
  totalParticipants: number
  byType: Record<ParticipantType, number>
}

// 필터 옵션
export interface RegistrationFilters {
  status?: RegistrationStatus
  participant_type?: ParticipantType
  search?: string
  date_from?: string
  date_to?: string
  page?: number
  limit?: number
}

// 엑셀 내보내기 데이터
export interface RegistrationExportData {
  신청번호: string
  이름: string
  전화번호: string
  성별?: string
  생년월일?: string
  참여유형: string
  동반자수: number
  동반자정보?: string
  주소: string
  상세주소?: string
  우편번호: string
  특별요청사항?: string
  마케팅수신동의: string
  개인정보수집동의: string
  상태: string
  신청일시: string
}

// 주소 검색 관련 타입
export interface AddressSearchResult {
  address: string
  zip_code: string
  roadAddress?: string
  jibunAddress?: string
  extraAddress?: string
}

export interface DirectRegistrationData {
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
  agreedToTerms: boolean
  agreedToPrivacy: boolean
  agreedToMarketing?: boolean
  parentalConsent?: boolean
}

export interface DuplicationCheckResponse {
  available: boolean
  message: string
}

export interface RegistrationResponse {
  success: boolean
  message: string
  error?: string
  user?: {
    id: string
    name: string
    username: string
  }
}

export interface FormFieldState {
  value: string
  error?: string
  isChecking?: boolean
  isChecked?: boolean
  isValid?: boolean
}

export interface RegistrationFormState {
  name: FormFieldState
  username: FormFieldState
  password: FormFieldState
  confirmPassword: FormFieldState
  phone: FormFieldState
  gender: FormFieldState
  birthDate: FormFieldState
  company: FormFieldState
  address: FormFieldState
  addressDetail: FormFieldState
  zipCode: FormFieldState
  agreedToTerms: FormFieldState
  agreedToPrivacy: FormFieldState
  agreedToMarketing: FormFieldState
}