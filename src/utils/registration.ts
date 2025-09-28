import type { ParticipantType, RegistrationStatus, ParticipantTypeOption } from '@/types/registration'

// 참가자 유형 라벨 맵핑
export const getParticipantTypeLabel = (type: ParticipantType): string => {
  const typeLabels: Record<ParticipantType, string> = {
    'citizen': '일반시민',
    'single-parent': '한부모가족',
    'self-help': '자조모임',
    'volunteer': '자원봉사자',
    'organization': '유관기관'
  }
  return typeLabels[type] || type
}

// 상태 라벨 맵핑
export const getStatusLabel = (status: RegistrationStatus): string => {
  const statusLabels: Record<RegistrationStatus, string> = {
    'confirmed': '확정',
    'pending': '대기',
    'cancelled': '취소'
  }
  return statusLabels[status] || status
}

// 상태별 색상 클래스 맵핑
export const getStatusColor = (status: RegistrationStatus): string => {
  const statusColors: Record<RegistrationStatus, string> = {
    'confirmed': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return statusColors[status] || 'bg-gray-100 text-gray-800'
}

// 상태별 뱃지 variant 맵핑 (shadcn/ui Badge 컴포넌트용)
export const getStatusBadgeVariant = (status: RegistrationStatus): 'default' | 'destructive' | 'outline' | 'secondary' => {
  const statusVariants: Record<RegistrationStatus, 'default' | 'destructive' | 'outline' | 'secondary'> = {
    'confirmed': 'default',
    'pending': 'secondary',
    'cancelled': 'destructive'
  }
  return statusVariants[status] || 'outline'
}

// 참가자 유형 옵션 목록
export const participantTypeOptions: ParticipantTypeOption[] = [
  {
    id: 'citizen',
    label: '일반시민',
    description: '지역 주민 및 일반 시민',
    icon: '👥'
  },
  {
    id: 'single-parent',
    label: '한부모가족',
    description: '한부모가족 지원 대상자',
    icon: '👨‍👧‍👦'
  },
  {
    id: 'self-help',
    label: '자조모임',
    description: '지역 내 자조모임 회원',
    icon: '🤝'
  },
  {
    id: 'volunteer',
    label: '자원봉사자',
    description: '축제 운영 자원봉사자',
    icon: '🙋‍♀️'
  },
  {
    id: 'organization',
    label: '유관기관',
    description: '협력 유관기관 관계자',
    icon: '🏢'
  }
]

// 신청번호 생성 함수
export const generateRegistrationNumber = (): string => {
  const year = new Date().getFullYear()
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `MH${year}-${timestamp}${random}`
}

// 신청번호 유효성 검사
export const isValidRegistrationNumber = (number: string): boolean => {
  const pattern = /^MH\d{4}-\d{9}$/
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
    ? { icon: '✅', text: '동의', color: 'text-green-600' }
    : { icon: '❌', text: '비동의', color: 'text-red-600' }
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