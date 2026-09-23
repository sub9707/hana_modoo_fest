import { randomUUID } from 'crypto'
import type { Connection } from 'mysql2/promise'
import {
  buildAnonymizedUserFields,
  ANONYMIZED_USERNAME_PREFIX,
  DELETION_TYPE_RETENTION_EXPIRED
} from '@/lib/utils/anonymize'

/**
 * 회원 익명화(탈퇴 처리) 공통 로직.
 *
 * users 행을 삭제하지 않고 그 자리에서 개인정보만 파기한다.
 * 이벤트 콘텐츠 테이블(support_comments, writings, event_winners,
 * event_participations, quiz_event_participants, registrations)은 전부
 * user_id 만 저장하고 이름은 JOIN users 로 실시간 조회하므로,
 * users.name 을 마스킹하면 콘텐츠를 한 줄도 건드리지 않고
 * 모든 화면의 작성자 표기가 '김ㅇㅇ' 로 바뀐다.
 *
 * 반대로 DELETE FROM users 를 하면 FK 가 CASCADE 든 고아 행이든
 * 이벤트 콘텐츠가 사라지므로 절대 쓰지 않는다.
 */

/** mysql2 의 Connection / PoolConnection 양쪽을 받기 위한 최소 인터페이스 */
type Executor = Pick<Connection, 'execute'>

export interface AnonymizeResult {
  userId: string
  sequence: number
  dummyUsername: string
  maskedName: string
  hadSocial: boolean
}

/**
 * 다음 더미 계정 번호를 구한다.
 * 기존 'deleted_NNNN' 중 최대값 + 1 이라 중단 후 재실행해도 번호가 겹치지 않는다.
 * (username 이 UNIQUE 라 충돌하면 즉시 실패하므로 정확해야 한다)
 */
export async function getNextAnonymizationSequence(executor: Executor): Promise<number> {
  const [rows] = await executor.execute(
    `SELECT COALESCE(MAX(CAST(SUBSTRING(username, ?) AS UNSIGNED)), 0) AS max_seq
     FROM users
     WHERE username LIKE ?`,
    [ANONYMIZED_USERNAME_PREFIX.length + 1, `${ANONYMIZED_USERNAME_PREFIX}%`]
  )
  const maxSeq = Number((rows as any[])[0]?.max_seq ?? 0)
  return maxSeq + 1
}

/**
 * 사용자 한 명을 익명화한다. 호출자가 트랜잭션을 관리한다.
 *
 * 유지하는 값 : id(FK 무결성), gender, role, signup_method, created_at, last_login_at
 * 파기하는 값 : name(마스킹), username, phone, email, company, 주소 3종,
 *               profile_image, 비밀번호, 세션, last_login_ip
 * 절삭하는 값 : birth_date → 출생연도만 (NOT NULL 이라 비울 수 없음)
 */
export async function anonymizeUserRow(
  executor: Executor,
  user: { id: string; name: string | null; birth_date: string | null; signup_method: string | null },
  sequence: number,
  batchId: string,
  deletionType: string = DELETION_TYPE_RETENTION_EXPIRED
): Promise<AnonymizeResult> {
  const fields = buildAnonymizedUserFields(sequence, user.name, user.birth_date)

  await executor.execute(
    `UPDATE users SET
       name               = ?,
       username           = ?,
       phone              = ?,
       birth_date         = ?,
       company            = NULL,
       email              = NULL,
       profile_image      = NULL,
       address            = NULL,
       address_detail     = NULL,
       zip_code           = NULL,
       password_hash      = ?,
       password_salt      = ?,
       session_token      = NULL,
       session_expires_at = NULL,
       last_login_ip      = NULL,
       deleted_at         = NOW(),
       deletion_type      = ?
     WHERE id = ?`,
    [
      fields.name,
      fields.username,
      fields.phone,
      fields.birthDate,
      fields.passwordHash,
      fields.passwordSalt,
      deletionType,
      user.id
    ]
  )

  // SNS 연결 해제 : provider_id / provider_email / 프로필 이미지가 모두 개인정보다.
  // 이 행이 사라지면 OAuth 콜백이 기존 사용자를 찾지 못해 소셜 로그인도 성립하지 않는다.
  const [socialResult] = await executor.execute(
    'DELETE FROM social_accounts WHERE user_id = ?',
    [user.id]
  )
  const hadSocial = ((socialResult as any)?.affectedRows ?? 0) > 0

  await executor.execute(
    `INSERT INTO user_anonymization_log
       (id, user_id, dummy_username, signup_method, had_social, batch_id, reason)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [randomUUID(), user.id, fields.username, user.signup_method, hadSocial ? 1 : 0, batchId, deletionType]
  )

  return {
    userId: user.id,
    sequence,
    dummyUsername: fields.username,
    maskedName: fields.name,
    hadSocial
  }
}
