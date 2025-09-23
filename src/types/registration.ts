// types/registration.ts
export interface Registration {
  id: string
  user_id: string
  registration_number: string
  participant_type: ParticipantType
  companions: number
  companion_details?: string
  address: string
  address_detail?: string
  zip_code: string
  special_requests?: string
  marketing_consent: boolean
  privacy_consent: boolean
  status: RegistrationStatus
  created_at: string
  updated_at: string
}

export type ParticipantType = 
  | 'citizen'        // 일반 시민/가족
  | 'single-parent'  // 한부모가족
  | 'self-help'      // 자조모임
  | 'volunteer'      // 자원봉사자
  | 'organization'   // 기관 관계자

export type RegistrationStatus = 
  | 'pending'    // 대기중
  | 'confirmed'  // 확정
  | 'cancelled'  // 취소됨

export interface RegistrationFormData {
  participant_type: ParticipantType
  companions: number
  companion_details: string
  address: string
  address_detail: string
  zip_code: string
  special_requests: string
  privacy_consent: boolean
  marketing_consent: boolean
}

export interface KakaoAddress {
  address: string
  address_detail: string
  zip_code: string
}

export interface RegistrationWithUser extends Registration {
  user_name: string
  user_phone: string
}