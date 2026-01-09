// 사전 접수 마감 시간 유틸리티

/**
 * 사전 접수 마감 시간
 * 2026년 10월 17일 토요일 17:00:00 (KST) - 테스트 앱: 1년 연장
 */
export const REGISTRATION_DEADLINE = new Date('2026-10-17T17:00:00+09:00')

/**
 * 사전 접수가 마감되었는지 확인
 * @returns {boolean} 마감 여부
 */
export function isRegistrationClosed(): boolean {
  const now = new Date()
  return now >= REGISTRATION_DEADLINE
}

/**
 * 남은 시간 계산
 * @returns {Object} 남은 일, 시간, 분
 */
export function getTimeUntilDeadline(): {
  days: number
  hours: number
  minutes: number
  isExpired: boolean
} {
  const now = new Date()
  const diff = REGISTRATION_DEADLINE.getTime() - now.getTime()

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      isExpired: true
    }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  return {
    days,
    hours,
    minutes,
    isExpired: false
  }
}

/**
 * 마감 시간 포맷팅
 * @returns {string} 포맷된 마감 시간 문자열
 */
export function getFormattedDeadline(): string {
  return REGISTRATION_DEADLINE.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Seoul'
  })
}