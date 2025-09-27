// src/lib/utils/user.ts

// 가입 방법별 표시 텍스트 생성
export function getSignupMethodText(signupMethod: string): string {
  const methodMap: Record<string, string> = {
    phone: '전화번호',
    naver: '네이버',
    kakao: '카카오'
  }
  return methodMap[signupMethod] || '알 수 없음'
}

// 성별 표시 텍스트 생성
export function getGenderText(gender: string): string {
  const genderMap: Record<string, string> = {
    male: '남성',
    female: '여성',
    none: '선택 안함'
  }
  return genderMap[gender] || '알 수 없음'
}

// 역할 표시 텍스트 생성
export function getRoleText(role: string): string {
  const roleMap: Record<string, string> = {
    admin: '관리자',
    editor: '에디터',
    user: '일반 사용자'
  }
  return roleMap[role] || '알 수 없음'
}