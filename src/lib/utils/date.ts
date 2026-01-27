
/**
 * 날짜를 한국어 형식으로 포맷
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

interface RelativeTimeOptions {
  /** 이 일수를 넘으면 날짜를 표시 (기본값: 무제한) */
  fallbackAfterDays?: number
}

/**
 * 상대적 시간 표시 (예: "3일 전", "2시간 전")
 * @param dateString - ISO 날짜 문자열
 * @param options - 옵션 (fallbackAfterDays: 이 일수 이후에는 날짜 표시)
 */
export function formatRelativeTime(dateString: string, options?: RelativeTimeOptions): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()

  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  // 특정 일수 이후에는 날짜를 표시
  if (options?.fallbackAfterDays && days >= options.fallbackAfterDays) {
    return formatDateOnly(dateString)
  }

  if (years > 0) {
    return `${years}년 전`
  } else if (months > 0) {
    return `${months}개월 전`
  } else if (days > 0) {
    return `${days}일 전`
  } else if (hours > 0) {
    return `${hours}시간 전`
  } else if (minutes > 0) {
    return `${minutes}분 전`
  } else {
    return '방금 전'
  }
}

/**
 * getTimeAgo의 별칭 (하위 호환성)
 */
export const getTimeAgo = formatRelativeTime

/**
 * 날짜만 표시 (시간 제외)
 */
export function formatDateOnly(dateString: string): string {
  const date = new Date(dateString)
  
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * 시간만 표시 (날짜 제외)
 */
export function formatTimeOnly(dateString: string): string {
  const date = new Date(dateString)
  
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}