
/**
 * 비밀번호 강도 검사 결과 타입
 */
export interface PasswordStrengthResult {
  score: number
  feedback: string[]
  isStrong: boolean
  strength: 'very-weak' | 'weak' | 'fair' | 'good' | 'strong'
}

/**
 * 비밀번호 강도 점수 계산 (클라이언트/서버 공용 유틸리티)
 * NextJS 15: 별도 유틸리티 파일로 분리하여 Server Action 충돌 방지
 */
export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  let score = 0
  const feedback: string[] = []

  // 기본 조건들 검사
  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push('8자 이상 사용하세요')
  }

  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push('소문자를 포함하세요')
  }

  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push('대문자를 포함하세요')
  }

  if (/\d/.test(password)) {
    score += 1
  } else {
    feedback.push('숫자를 포함하세요')
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1
  } else {
    feedback.push('특수문자를 포함하세요')
  }

  // 추가 보너스 점수
  if (password.length >= 12) {
    score += 1
  }

  if (password.length >= 16) {
    score += 1
  }

  // 패턴 다양성 검사 (추가 보안)
  if (!/(.)\1{2,}/.test(password)) { // 3회 이상 반복 문자 없음
    score += 1
  } else {
    feedback.push('반복되는 문자를 줄이세요')
  }

  // 강도 레벨 결정
  let strength: PasswordStrengthResult['strength']
  if (score <= 2) {
    strength = 'very-weak'
  } else if (score <= 3) {
    strength = 'weak'
  } else if (score <= 4) {
    strength = 'fair'
  } else if (score <= 6) {
    strength = 'good'
  } else {
    strength = 'strong'
  }

  return {
    score,
    feedback,
    isStrong: score >= 5,
    strength
  }
}

/**
 * 비밀번호 강도를 색상으로 변환
 */
export function getPasswordStrengthColor(strength: PasswordStrengthResult['strength']): string {
  switch (strength) {
    case 'very-weak':
      return 'bg-red-500'
    case 'weak':
      return 'bg-red-400'
    case 'fair':
      return 'bg-yellow-500'
    case 'good':
      return 'bg-blue-500'
    case 'strong':
      return 'bg-green-500'
    default:
      return 'bg-gray-300'
  }
}

/**
 * 비밀번호 강도를 텍스트로 변환
 */
export function getPasswordStrengthText(strength: PasswordStrengthResult['strength']): string {
  switch (strength) {
    case 'very-weak':
      return '매우 약함'
    case 'weak':
      return '약함'
    case 'fair':
      return '보통'
    case 'good':
      return '좋음'
    case 'strong':
      return '매우 강함'
    default:
      return '알 수 없음'
  }
}

/**
 * 일반적인 약한 비밀번호 패턴 검사
 */
export function isCommonWeakPassword(password: string): boolean {
  const commonPatterns = [
    /^123456/,
    /^password/i,
    /^qwerty/i,
    /^admin/i,
    /^(.)\\1+$/, // 모두 같은 문자
    /^(012|123|234|345|456|567|678|789)+/, // 연속 숫자
    /^(abc|bcd|cde|def)+/i, // 연속 알파벳
  ]

  return commonPatterns.some(pattern => pattern.test(password))
}

/**
 * 비밀번호 유효성 검사 (서버 사이드용)
 */
export function validatePasswordServer(password: string): {
  isValid: boolean
  error?: string
} {
  if (!password) {
    return { isValid: false, error: '비밀번호를 입력해주세요' }
  }

  if (password.length < 8) {
    return { isValid: false, error: '비밀번호는 8자 이상이어야 합니다' }
  }

  if (password.length > 128) {
    return { isValid: false, error: '비밀번호는 128자를 초과할 수 없습니다' }
  }

  const strength = calculatePasswordStrength(password)
  
  if (!strength.isStrong) {
    return { 
      isValid: false, 
      error: `비밀번호가 너무 약합니다. ${strength.feedback.join(', ')}`
    }
  }

  if (isCommonWeakPassword(password)) {
    return { 
      isValid: false, 
      error: '일반적으로 사용되는 약한 비밀번호입니다. 다른 비밀번호를 선택해주세요'
    }
  }

  return { isValid: true }
}