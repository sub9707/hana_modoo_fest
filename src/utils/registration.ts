import type { ParticipantType } from '@/types/registration'

// 참가자 유형 옵션
export const participantTypeOptions = [
  { id: 'citizen', label: '일반시민', description: '서초구 거주 일반 시민' },
  { id: 'single-parent', label: '한부모가족', description: '한부모가족 지원 대상자' },
  { id: 'self-help', label: '자활사업단', description: '자활근로사업단 참여자' },
  { id: 'volunteer', label: '자원봉사자', description: '자원봉사활동 참여자' },
  { id: 'organization', label: '복지기관', description: '복지시설 및 기관 종사자' }
] as const

// 참가자 유형 라벨 가져오기
export const getParticipantTypeLabel = (type: ParticipantType): string => {
  const option = participantTypeOptions.find(opt => opt.id === type)
  return option?.label || type
}

// 신청 상태 라벨 가져오기
export const getStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    'pending': '대기중',
    'confirmed': '확정',
    'cancelled': '취소됨'
  }
  return statusMap[status] || status
}

// 신청번호 생성 함수 (서버 사이드에서만 사용)
// 이 함수는 더 이상 사용되지 않으며, API route에서 직접 생성합니다
export const generateRegistrationNumber = (): string => {
  // Deprecated: 서버 API에서 직접 생성
  console.warn('generateRegistrationNumber is deprecated. Use API route instead.')
  return '0000'
}

// 신청번호 유효성 검사
export const isValidRegistrationNumber = (number: string): boolean => {
  // 숫자만으로 구성된 1~5자리 (0000 ~ 99999)
  const pattern = /^\d{1,5}$/
  return pattern.test(number)
}

// 날짜 포맷팅 함수
export const formatRegistrationDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 짧은 날짜 포맷팅 함수
export const formatShortDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR')
}

// 전화번호 포맷팅 함수
export const formatPhoneNumber = (phone: string): string => {
  // 숫자만 추출
  const numbers = phone.replace(/\D/g, '')
  
  // 길이에 따라 포맷팅
  if (numbers.length === 11) {
    return numbers.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
  } else if (numbers.length === 10) {
    return numbers.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
  }
  
  return phone
}

// 주소 전체 문자열 생성
export const getFullAddress = (address: string, addressDetail?: string | null, zipCode?: string): string => {
  let fullAddress = address
  
  if (addressDetail) {
    fullAddress += ` ${addressDetail}`
  }
  
  if (zipCode) {
    fullAddress = `(${zipCode}) ${fullAddress}`
  }
  
  return fullAddress
}

// 참가 인원 계산 (본인 + 동반자)
export const getTotalParticipants = (companions: number): number => {
  return companions + 1
}

// 참가자 유형별 색상 클래스
export const getParticipantTypeColor = (type: ParticipantType): string => {
  const typeColors: Record<ParticipantType, string> = {
    'citizen': 'bg-blue-100 text-blue-800',
    'single-parent': 'bg-pink-100 text-pink-800',
    'self-help': 'bg-green-100 text-green-800',
    'volunteer': 'bg-purple-100 text-purple-800',
    'organization': 'bg-orange-100 text-orange-800'
  }
  return typeColors[type] || 'bg-gray-100 text-gray-800'
}

// 동의 상태 아이콘 및 텍스트
export const getConsentDisplay = (consent: boolean): { icon: string; text: string; color: string } => {
  return consent 
    ? { icon: '✓', text: '동의', color: 'text-green-600' }
    : { icon: '✗', text: '비동의', color: 'text-red-600' }
}

// 검색 키워드 하이라이트 함수 (HTML 문자열 반환)
export const highlightSearchTerm = (text: string, searchTerm: string): string => {
  if (!searchTerm.trim()) return text
  
  const regex = new RegExp(`(${searchTerm})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>')
}

// 등록 통계 계산 함수
export const calculateRegistrationStats = (registrations: any[]) => {
  const stats = {
    total: registrations.length,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
    totalParticipants: 0,
    byType: {
      citizen: 0,
      'single-parent': 0,
      'self-help': 0,
      volunteer: 0,
      organization: 0
    } as Record<ParticipantType, number>
  }

  registrations.forEach(registration => {
    // 상태별 집계
    if (registration.status === 'confirmed') stats.confirmed++
    else if (registration.status === 'pending') stats.pending++
    else if (registration.status === 'cancelled') stats.cancelled++

    // 총 참가 인원 집계 (취소된 것 제외)
    if (registration.status !== 'cancelled') {
      stats.totalParticipants += getTotalParticipants(registration.companions)
    }

    // 참가자 유형별 집계
    if (registration.participant_type in stats.byType) {
      stats.byType[registration.participant_type as ParticipantType]++
    }
  })

  return stats
}