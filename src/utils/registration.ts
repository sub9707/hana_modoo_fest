import { ParticipantType, RegistrationStatus } from '@/types/registration'

// 신청번호 생성 함수
export function generateRegistrationNumber(): string {
  const year = new Date().getFullYear()
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `MH${year}-${timestamp}${random}`
}

// 신청번호 검증 함수
export function validateRegistrationNumber(regNumber: string): boolean {
  const pattern = /^MH\d{4}-[A-Z0-9]{8,12}$/
  return pattern.test(regNumber)
}

// 참가유형 한글 변환
export function getParticipantTypeText(type: ParticipantType): string {
  const typeMap: Record<ParticipantType, string> = {
    'citizen': '일반 시민/가족',
    'single-parent': '한부모가족',
    'self-help': '자조모임',
    'volunteer': '자원봉사자',
    'organization': '기관 관계자'
  }
  
  return typeMap[type] || type
}

// 참가상태 한글 변환
export function getRegistrationStatusText(status: RegistrationStatus): string {
  const statusMap: Record<RegistrationStatus, string> = {
    'pending': '접수 대기',
    'confirmed': '접수 완료',
    'cancelled': '접수 취소'
  }
  
  return statusMap[status] || status
}

// 참가상태 색상 클래스 반환
export function getRegistrationStatusColor(status: RegistrationStatus): string {
  const colorMap: Record<RegistrationStatus, string> = {
    'pending': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'confirmed': 'text-green-600 bg-green-50 border-green-200',
    'cancelled': 'text-red-600 bg-red-50 border-red-200'
  }
  
  return colorMap[status] || 'text-gray-600 bg-gray-50 border-gray-200'
}

// 총 참가인원 계산
export function getTotalParticipants(companions: number): number {
  return companions + 1 // 본인 포함
}

// 날짜 포맷팅 (한국어)
export function formatKoreanDate(dateString: string): string {
  return new Date(dateString).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 날짜 포맷팅 (간단)
export function formatShortDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 이메일 유효성 검사
export function validateEmail(email: string): boolean {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(email)
}

// 전화번호 포맷팅
export function formatPhoneNumber(phone: string): string {
  // 숫자만 추출
  const numbers = phone.replace(/\D/g, '')
  
  // 010-1234-5678 형태로 포맷팅
  if (numbers.length === 11 && numbers.startsWith('010')) {
    return numbers.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
  }
  
  // 02-1234-5678 형태 (서울 지역번호)
  if (numbers.length === 10 && numbers.startsWith('02')) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3')
  }
  
  // 기타 지역번호 (031, 032 등)
  if (numbers.length === 11 && !numbers.startsWith('010')) {
    return numbers.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
  }
  
  return phone // 포맷팅 실패 시 원본 반환
}

// 우편번호 유효성 검사
export function validateZipCode(zipCode: string): boolean {
  const zipPattern = /^\d{5}$/
  return zipPattern.test(zipCode)
}

// 주소 요약 (긴 주소를 짧게)
export function truncateAddress(address: string, maxLength: number = 30): string {
  if (address.length <= maxLength) {
    return address
  }
  return address.substring(0, maxLength) + '...'
}

// 참가신청 통계 계산
export interface RegistrationStats {
  total: number
  byParticipantType: Record<ParticipantType, number>
  byStatus: Record<RegistrationStatus, number>
  totalParticipants: number
  averageCompanions: number
}

export function calculateRegistrationStats(registrations: any[]): RegistrationStats {
  const stats: RegistrationStats = {
    total: registrations.length,
    byParticipantType: {
      citizen: 0,
      'single-parent': 0,
      'self-help': 0,
      volunteer: 0,
      organization: 0
    },
    byStatus: {
      pending: 0,
      confirmed: 0,
      cancelled: 0
    },
    totalParticipants: 0,
    averageCompanions: 0
  }

  registrations.forEach(reg => {
    // 참가유형별 통계
    if (reg.participant_type in stats.byParticipantType) {
      stats.byParticipantType[reg.participant_type as ParticipantType]++
    }

    // 상태별 통계
    if (reg.status in stats.byStatus) {
      stats.byStatus[reg.status as RegistrationStatus]++
    }

    // 총 참가자 수 (본인 + 동반자)
    stats.totalParticipants += (reg.companions || 0) + 1
  })

  // 평균 동반자 수
  if (registrations.length > 0) {
    const totalCompanions = registrations.reduce((sum, reg) => sum + (reg.companions || 0), 0)
    stats.averageCompanions = Math.round((totalCompanions / registrations.length) * 10) / 10
  }

  return stats
}

// 접수 마감일 체크
export function isRegistrationDeadlinePassed(deadline: string): boolean {
  return new Date() > new Date(deadline)
}

// 축제 D-Day 계산
export function getDaysUntilFestival(festivalDate: string): number {
  const today = new Date()
  const festival = new Date(festivalDate)
  const diffTime = festival.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// CSV 내보내기용 데이터 변환
export function convertToCSVData(registrations: any[]): string {
  const headers = [
    '접수번호',
    '신청자명',
    '연락처',
    '참가유형',
    '총참가인원',
    '동반자정보',
    '주소',
    '특별요청',
    '마케팅동의',
    '신청일시',
    '상태'
  ]

  const rows = registrations.map(reg => [
    reg.registration_number,
    reg.user_name,
    reg.user_phone,
    getParticipantTypeText(reg.participant_type),
    getTotalParticipants(reg.companions),
    reg.companion_details || '-',
    `${reg.address} ${reg.address_detail || ''}`.trim(),
    reg.special_requests || '-',
    reg.marketing_consent ? '동의' : '미동의',
    formatKoreanDate(reg.created_at),
    getRegistrationStatusText(reg.status)
  ])

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n')

  return csvContent
}

// 등록 가능 여부 체크
export function canRegister(
  existingRegistration: any,
  registrationDeadline: string,
  maxRegistrations?: number,
  currentRegistrations?: number
): {
  canRegister: boolean
  reason?: string
} {
  // 이미 등록된 사용자
  if (existingRegistration && existingRegistration.status !== 'cancelled') {
    return {
      canRegister: false,
      reason: '이미 참가신청을 완료하셨습니다.'
    }
  }

  // 마감일 체크
  if (isRegistrationDeadlinePassed(registrationDeadline)) {
    return {
      canRegister: false,
      reason: '참가신청 마감일이 지났습니다.'
    }
  }

  // 최대 등록 수 체크
  if (maxRegistrations && currentRegistrations && currentRegistrations >= maxRegistrations) {
    return {
      canRegister: false,
      reason: '참가신청 정원이 마감되었습니다.'
    }
  }

  return { canRegister: true }
}