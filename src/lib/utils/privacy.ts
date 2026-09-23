/**
 * 개인정보 마스킹 공용 유틸
 *
 * 그동안 마스킹 로직이 라우트마다 인라인으로 복제돼 있었다.
 * (winners/recent 의 지역 maskName, reset-password / change-password 의 전화번호 인라인)
 * 표기 규칙을 한 곳에서 관리하기 위해 여기로 모은다.
 */

/**
 * 이름을 첫 글자만 남기고 마스킹한다. '김철수' → '김ㅇㅇ'
 *
 * 길이를 보존하므로 **멱등**이다. maskKoreanName('김ㅇㅇ') === '김ㅇㅇ'
 * 익명화된 회원은 users.name 에 이미 마스킹된 값이 저장되어 있는데,
 * 조회 시점에 한 번 더 마스킹을 타더라도 표기가 깨지지 않는다.
 */
export function maskKoreanName(name: string | null | undefined): string {
  const trimmed = (name ?? '').trim()
  if (!trimmed) return '익명'
  // 1글자 이름도 'ㅇ' 하나를 붙여 표기 형태를 통일한다
  return trimmed[0] + 'ㅇ'.repeat(Math.max(trimmed.length - 1, 1))
}

/**
 * 휴대폰 번호를 마스킹한다. '01012345678' → '010****5678'
 * 익명화된 계정의 자리표시자(DEL...) 처럼 형식에 맞지 않는 값은 '-' 를 반환한다.
 */
export function maskPhone(phone: string | null | undefined): string {
  const digits = (phone ?? '').replace(/-/g, '').trim()
  if (!/^\d{10,11}$/.test(digits)) return '-'
  return `${digits.substring(0, 3)}****${digits.substring(digits.length - 4)}`
}

/**
 * 이메일을 마스킹한다. 'hong@example.com' → 'ho***@example.com'
 */
export function maskEmail(email: string | null | undefined): string {
  const trimmed = (email ?? '').trim()
  const at = trimmed.lastIndexOf('@')
  if (at < 1) return '-'
  const local = trimmed.slice(0, at)
  const domain = trimmed.slice(at)
  const keep = local.slice(0, Math.min(2, local.length))
  return `${keep}${'*'.repeat(Math.max(local.length - keep.length, 1))}${domain}`
}
