
/**
 * 가입 방법 텍스트 반환
 */
export function getSignupMethodText(signupMethod: string): string {
  switch (signupMethod) {
    case 'phone':
      return '전화번호 가입'
    case 'naver':
      return '네이버 로그인'
    case 'kakao':
      return '카카오 로그인'
    default:
      return '일반 가입'
  }
}

/**
 * 성별 텍스트 반환
 */
export function getGenderText(gender: string): string {
  switch (gender) {
    case 'male':
      return '남성'
    case 'female':
      return '여성'
    case 'none':
      return '선택 안함'
    default:
      return '알 수 없음'
  }
}

/**
 * 역할 텍스트 반환
 */
export function getRoleText(role: string): string {
  switch (role) {
    case 'admin':
      return '관리자'
    case 'editor':
      return '편집자'
    case 'user':
      return '일반 사용자'
    default:
      return '사용자'
  }
}