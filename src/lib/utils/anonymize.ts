import { randomBytes } from 'crypto'
import { maskKoreanName } from './privacy'

/**
 * 회원 익명화(탈퇴 처리) 시 users 행에 덮어쓸 값을 만든다.
 *
 * 일괄 익명화 스크립트(src/scripts/anonymize-expired-users.ts)와
 * 관리자 회원 삭제(users-service.deleteUser)가 같은 규칙을 쓰도록 여기에 모은다.
 *
 * 컬럼 제약(실제 스키마 기준)을 지켜야 한다:
 *   name          VARCHAR(50)  NOT NULL
 *   username      VARCHAR(30)  NOT NULL UNIQUE
 *   phone         VARCHAR(15)  NOT NULL        ← NULL 불가라 자리표시자 사용
 *   birth_date    DATE         NOT NULL        ← NULL 불가라 연도만 남기고 절삭
 *   gender        ENUM         NOT NULL        ← 통계용으로 원본 유지
 *   password_hash VARCHAR(128) NOT NULL
 *   password_salt VARCHAR(32)  NOT NULL
 */
export interface AnonymizedUserFields {
  name: string
  username: string
  phone: string
  birthDate: string
  passwordHash: string
  passwordSalt: string
}

export const ANONYMIZED_USERNAME_PREFIX = 'deleted_'
export const ANONYMIZED_PHONE_PREFIX = 'DEL'
export const DELETION_TYPE_RETENTION_EXPIRED = 'retention_expired'
export const DELETION_TYPE_ADMIN = 'admin_deleted'

/** 'deleted_0001' — VARCHAR(30) 안에 들어간다 */
export function buildDummyUsername(sequence: number): string {
  return `${ANONYMIZED_USERNAME_PREFIX}${String(sequence).padStart(4, '0')}`
}

/**
 * 'DEL000000000001' — 정확히 15자로 VARCHAR(15) 에 꽉 맞는다.
 * phone 이 NOT NULL 이라 NULL 을 넣을 수 없어 쓰는 자리표시자이며,
 * 실제 번호 형식(01X...)과 겹치지 않아 전화번호 조회에 절대 걸리지 않는다.
 */
export function buildDummyPhone(sequence: number): string {
  return `${ANONYMIZED_PHONE_PREFIX}${String(sequence).padStart(12, '0')}`
}

/**
 * 생년월일을 출생연도만 남기고 'YYYY-01-01' 로 절삭한다.
 * birth_date 가 NOT NULL 이라 NULL 로 비울 수 없고,
 * 월/일까지 남기면 준식별자로 재식별 위험이 있어 연도만 남긴다.
 */
export function truncateBirthDateToYear(birthDate: string | Date | null | undefined): string {
  const FALLBACK = '1900-01-01'
  if (!birthDate) return FALLBACK

  // connection.ts 가 dateStrings: true 라 보통 'YYYY-MM-DD' 문자열로 들어온다
  const raw = birthDate instanceof Date ? birthDate.toISOString().slice(0, 10) : String(birthDate)
  const year = raw.slice(0, 4)

  if (!/^\d{4}$/.test(year)) return FALLBACK
  const n = Number(year)
  if (n < 1900 || n > new Date().getFullYear()) return FALLBACK

  return `${year}-01-01`
}

/**
 * 어떤 비밀번호와도 일치할 수 없는 값을 만든다.
 * 로그인은 deleted_at 조건으로도 막지만, 쿼리 필터를 한 군데 놓치더라도
 * 비밀번호 검증 자체가 성립하지 않도록 하는 2차 방어선이다.
 */
export function buildUnusableCredentials(): { passwordHash: string; passwordSalt: string } {
  return {
    passwordHash: randomBytes(64).toString('hex'), // 128자 = VARCHAR(128)
    passwordSalt: randomBytes(16).toString('hex')  // 32자  = VARCHAR(32)
  }
}

/** 익명화된 회원인지 판별 */
export function isAnonymizedUsername(username: string | null | undefined): boolean {
  return (username ?? '').startsWith(ANONYMIZED_USERNAME_PREFIX)
}

export function buildAnonymizedUserFields(
  sequence: number,
  originalName: string | null | undefined,
  originalBirthDate: string | Date | null | undefined
): AnonymizedUserFields {
  const { passwordHash, passwordSalt } = buildUnusableCredentials()
  return {
    name: maskKoreanName(originalName).slice(0, 50),
    username: buildDummyUsername(sequence),
    phone: buildDummyPhone(sequence),
    birthDate: truncateBirthDateToYear(originalBirthDate),
    passwordHash,
    passwordSalt
  }
}
