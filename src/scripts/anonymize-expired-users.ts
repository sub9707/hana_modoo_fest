/**
 * 하나모두 대축제 : 보관기간 만료 회원 일괄 익명화
 *
 *   npx tsx src/scripts/anonymize-expired-users.ts            # dry-run (기본값, 아무것도 쓰지 않음)
 *   npx tsx src/scripts/anonymize-expired-users.ts --execute   # 실제 반영
 *
 * 제외 대상 : role IN ('admin','editor'), username = 'test_admin'(데모 계정)
 *
 * 되돌릴 수 없다. 실행 전 반드시 mysqldump 전체 백업.
 */
import { randomUUID } from 'crypto'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import mysql from 'mysql2/promise'
import { maskKoreanName } from '../lib/utils/privacy'
import {
  buildDummyUsername,
  buildDummyPhone,
  truncateBirthDateToYear,
  buildUnusableCredentials,
  ANONYMIZED_USERNAME_PREFIX,
  DELETION_TYPE_RETENTION_EXPIRED
} from '../lib/utils/anonymize'

const EXECUTE = process.argv.includes('--execute')
const BATCH_SIZE = 200

const EXCLUDED_ROLES = ['admin', 'editor']
const EXCLUDED_USERNAMES = ['test_admin']

interface TargetUser {
  id: string
  name: string | null
  username: string
  signup_method: string | null
  birth_date: string | null
  created_at: string
}

const log = (...args: unknown[]) => console.log(...args)

/** .env.local 을 직접 읽는다 (Next.js 밖에서 실행하므로 자동 로딩이 안 된다) */
function loadEnv() {
  try {
    const raw = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i)
      if (!m) continue
      if (!process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  } catch {
    // 환경변수가 이미 주입된 환경이면 무시
  }
}

/**
 * 앱의 커넥션 풀(src/lib/mysql/connection.ts)을 쓰지 않는 이유:
 * 그 쪽 transaction() 헬퍼에는 5초 하드 타임아웃이 걸려 있어 대량 배치가 중간에 끊긴다.
 * 여기서는 커넥션을 직접 잡고 트랜잭션을 수동으로 제어한다.
 */
async function connect() {
  return mysql.createConnection({
    host: (process.env.MYSQL_HOST ?? process.env.NEXT_PUBLIC_MYSQL_HOST),
    port: parseInt((process.env.MYSQL_PORT ?? process.env.NEXT_PUBLIC_MYSQL_PORT) || '3306', 10),
    user: (process.env.MYSQL_USER ?? process.env.NEXT_PUBLIC_MYSQL_USER),
    password: (process.env.MYSQL_PASSWORD ?? process.env.NEXT_PUBLIC_MYSQL_PASSWORD),
    database: (process.env.MYSQL_DATABASE ?? process.env.NEXT_PUBLIC_MYSQL_DATABASE),
    charset: 'utf8mb4',
    timezone: '+09:00',
    dateStrings: true,
    multipleStatements: false
  })
}

const SNAPSHOT_SQL = `SELECT
  (SELECT COUNT(*) FROM users)                              AS users_total,
  (SELECT COUNT(*) FROM users WHERE deleted_at IS NOT NULL) AS users_anonymized,
  (SELECT COUNT(*) FROM social_accounts)                    AS social_accounts,
  (SELECT COUNT(*) FROM support_comments)                   AS support_comments,
  (SELECT COUNT(*) FROM writings)                           AS writings,
  (SELECT COUNT(*) FROM event_winners)                      AS event_winners,
  (SELECT COUNT(*) FROM event_participations)               AS event_participations,
  (SELECT COUNT(*) FROM quiz_event_participants)            AS quiz_participants,
  (SELECT COUNT(*) FROM registrations)                      AS registrations`

const CONTENT_KEYS = [
  'support_comments',
  'writings',
  'event_winners',
  'event_participations',
  'quiz_participants',
  'registrations'
] as const

async function main() {
  loadEnv()
  const conn = await connect()

  try {
    log('='.repeat(74))
    log(`하나모두 대축제 · 보관기간 만료 회원 익명화    [${EXECUTE ? '실행 모드' : 'DRY-RUN'}]`)
    log(`DB: ${(process.env.MYSQL_DATABASE ?? process.env.NEXT_PUBLIC_MYSQL_DATABASE)} @ ${(process.env.MYSQL_HOST ?? process.env.NEXT_PUBLIC_MYSQL_HOST)}`)
    log('='.repeat(74))

    // --- 0. 선행 조건 확인 -------------------------------------------------
    const [cols] = await conn.query<any[]>(
      `SELECT COLUMN_NAME FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users'
         AND COLUMN_NAME IN ('deleted_at','deletion_type')`
    )
    if (cols.length < 2) {
      throw new Error('users.deleted_at / deletion_type 컬럼이 없습니다.\n   먼저 src/database/migrations/2026-09-anonymize.sql 의 ALTER TABLE 을 적용하세요.')
    }
    const [logTable] = await conn.query<any[]>(
      `SELECT TABLE_NAME FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'user_anonymization_log'`
    )
    if (logTable.length === 0) {
      throw new Error('user_anonymization_log 테이블이 없습니다.\n   먼저 마이그레이션 SQL 의 CREATE TABLE 을 적용하세요.')
    }

    // --- 1. 처리 전 스냅샷 -------------------------------------------------
    const [beforeRows] = await conn.query<any[]>(SNAPSHOT_SQL)
    const before = beforeRows[0]
    log('\n[처리 전 현황]')
    for (const [k, v] of Object.entries(before)) log(`  ${k.padEnd(22)} ${v}`)

    // --- 2. 대상 조회 ------------------------------------------------------
    const rolePh = EXCLUDED_ROLES.map(() => '?').join(',')
    const namePh = EXCLUDED_USERNAMES.map(() => '?').join(',')

    const [targetRows] = await conn.query<any[]>(
      `SELECT id, name, username, signup_method, birth_date, created_at
       FROM users
       WHERE deleted_at IS NULL
         AND role NOT IN (${rolePh})
         AND username NOT IN (${namePh})
       ORDER BY created_at ASC, id ASC`,
      [...EXCLUDED_ROLES, ...EXCLUDED_USERNAMES]
    )
    const users = targetRows as TargetUser[]

    const [excluded] = await conn.query<any[]>(
      `SELECT username, role, name FROM users
       WHERE deleted_at IS NULL
         AND (role IN (${rolePh}) OR username IN (${namePh}))
       ORDER BY role DESC, username ASC`,
      [...EXCLUDED_ROLES, ...EXCLUDED_USERNAMES]
    )

    log(`\n[대상 산정] 익명화 ${users.length}명 / 제외 ${excluded.length}명`)
    log('  제외되는 계정:')
    for (const e of excluded) log(`    - ${String(e.username).padEnd(22)} role=${e.role}`)

    if (users.length === 0) {
      log('\n익명화할 대상이 없습니다. 종료합니다.')
      return
    }

    // --- 3. 더미 번호 시작점 -----------------------------------------------
    const [seqRows] = await conn.query<any[]>(
      `SELECT COALESCE(MAX(CAST(SUBSTRING(username, ?) AS UNSIGNED)), 0) AS max_seq
       FROM users WHERE username LIKE ?`,
      [ANONYMIZED_USERNAME_PREFIX.length + 1, `${ANONYMIZED_USERNAME_PREFIX}%`]
    )
    const startSeq = Number(seqRows[0]?.max_seq ?? 0) + 1
    const endSeq = startSeq + users.length - 1

    log(`\n[더미 계정 번호] ${buildDummyUsername(startSeq)} ~ ${buildDummyUsername(endSeq)}`)
    log(`[더미 전화번호]  ${buildDummyPhone(startSeq)} ~ ${buildDummyPhone(endSeq)}`)

    log('\n[변환 미리보기 · 상위 10건]')
    users.slice(0, 10).forEach((u, i) => {
      const seq = startSeq + i
      log(
        `  ${String(u.name).padEnd(10)} → ${maskKoreanName(u.name).padEnd(10)} | ` +
        `${String(u.username).padEnd(18)} → ${buildDummyUsername(seq).padEnd(15)} | ` +
        `${u.birth_date} → ${truncateBirthDateToYear(u.birth_date)}`
      )
    })

    if (!EXECUTE) {
      log('\n' + '-'.repeat(74))
      log('DRY-RUN 이므로 아무것도 변경하지 않았습니다.')
      log('실제 반영하려면 --execute 를 붙여 다시 실행하세요.')
      log('-'.repeat(74))
      return
    }

    // --- 4. 익명화 실행 ----------------------------------------------------
    const batchId = randomUUID()
    log(`\n[실행] batch_id = ${batchId}`)
    let done = 0

    for (let offset = 0; offset < users.length; offset += BATCH_SIZE) {
      const batch = users.slice(offset, offset + BATCH_SIZE)
      await conn.beginTransaction()
      try {
        for (let i = 0; i < batch.length; i++) {
          const u = batch[i]
          const seq = startSeq + offset + i
          const creds = buildUnusableCredentials()

          await conn.execute(
            `UPDATE users SET
               name = ?, username = ?, phone = ?, birth_date = ?,
               company = NULL, email = NULL, profile_image = NULL,
               address = NULL, address_detail = NULL, zip_code = NULL,
               password_hash = ?, password_salt = ?,
               session_token = NULL, session_expires_at = NULL,
               last_login_ip = NULL,
               deleted_at = NOW(), deletion_type = ?
             WHERE id = ?`,
            [
              maskKoreanName(u.name).slice(0, 50),
              buildDummyUsername(seq),
              buildDummyPhone(seq),
              truncateBirthDateToYear(u.birth_date),
              creds.passwordHash,
              creds.passwordSalt,
              DELETION_TYPE_RETENTION_EXPIRED,
              u.id
            ]
          )

          const [socialRes] = await conn.execute<any>(
            'DELETE FROM social_accounts WHERE user_id = ?',
            [u.id]
          )
          const hadSocial = (socialRes?.affectedRows ?? 0) > 0

          await conn.execute(
            `INSERT INTO user_anonymization_log
               (id, user_id, dummy_username, signup_method, had_social, batch_id, reason)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              randomUUID(),
              u.id,
              buildDummyUsername(seq),
              u.signup_method,
              hadSocial ? 1 : 0,
              batchId,
              DELETION_TYPE_RETENTION_EXPIRED
            ]
          )
        }
        await conn.commit()
        done += batch.length
        log(`  ... ${done}/${users.length} (${Math.round((done / users.length) * 100)}%)`)
      } catch (e) {
        await conn.rollback()
        throw e
      }
    }

    // --- 5. users 밖의 개인정보 정리 ---------------------------------------
    log('\n[부수 개인정보 정리]')
    await conn.beginTransaction()
    try {
      // registrations.address / zip_code 는 NOT NULL 이라 NULL 대신 빈 문자열로 비운다
      const [reg] = await conn.execute<any>(
        `UPDATE registrations r JOIN users u ON r.user_id = u.id
         SET r.address = '', r.zip_code = '',
             r.address_detail = NULL, r.companion_details = NULL, r.special_requests = NULL
         WHERE u.deleted_at IS NOT NULL`
      )
      log(`  registrations 주소/요청사항  : ${reg.affectedRows}건`)

      const [ep] = await conn.execute<any>(
        `UPDATE event_participations ep JOIN users u ON ep.user_id = u.id
         SET ep.ip_address = NULL, ep.user_agent = NULL
         WHERE u.deleted_at IS NOT NULL`
      )
      log(`  룰렛 참여 로그 IP/UA         : ${ep.affectedRows}건`)

      const [qz] = await conn.execute<any>(
        `UPDATE quiz_event_participants q JOIN users u ON q.user_id = u.id
         SET q.ip_address = NULL, q.user_agent = NULL
         WHERE u.deleted_at IS NOT NULL`
      )
      log(`  퀴즈 참여 로그 IP/UA         : ${qz.affectedRows}건`)

      // user_consents : 코드에는 참조가 없지만 DB 에 실재하며 ip_address / user_agent 를 보관한다.
      // 동의 여부(tinyint) 자체는 증빙으로 남기고 접속 정보만 지운다.
      const [ucExists] = await conn.query<any[]>(
        `SELECT TABLE_NAME FROM information_schema.TABLES
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'user_consents'`
      )
      if (ucExists.length > 0) {
        const [uc] = await conn.execute<any>(
          `UPDATE user_consents c JOIN users u ON c.user_id = u.id
           SET c.ip_address = NULL, c.user_agent = NULL
           WHERE u.deleted_at IS NOT NULL`
        )
        log(`  user_consents IP/UA          : ${uc.affectedRows}건`)
      }

      const purgeTables = [
        'phone_verifications',
        'email_verifications',
        'verification_limits',
        'email_verification_limits',
        'sms_send_logs'
      ]
      for (const t of purgeTables) {
        const [exists] = await conn.query<any[]>(
          `SELECT TABLE_NAME FROM information_schema.TABLES
           WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
          [t]
        )
        if (exists.length === 0) {
          log(`  ${t.padEnd(28)} : (테이블 없음, 건너뜀)`)
          continue
        }
        const [r] = await conn.execute<any>(`DELETE FROM \`${t}\``)
        log(`  ${t.padEnd(28)} : ${r.affectedRows}건 삭제`)
      }
      await conn.commit()
    } catch (e) {
      await conn.rollback()
      throw e
    }

    // --- 6. 검증 -----------------------------------------------------------
    log('\n[검증]')
    const [afterRows] = await conn.query<any[]>(SNAPSHOT_SQL)
    const after = afterRows[0]

    const [checkRows] = await conn.query<any[]>(
      `SELECT
         (SELECT COUNT(*) FROM users WHERE deleted_at IS NOT NULL
            AND (email IS NOT NULL OR company IS NOT NULL OR address IS NOT NULL
                 OR address_detail IS NOT NULL OR zip_code IS NOT NULL
                 OR profile_image IS NOT NULL OR session_token IS NOT NULL
                 OR last_login_ip IS NOT NULL OR phone NOT LIKE 'DEL%')) AS pii_remaining,
         (SELECT COUNT(*) FROM social_accounts sa JOIN users u ON sa.user_id = u.id
            WHERE u.deleted_at IS NOT NULL) AS social_remaining`
    )
    const check = checkRows[0]

    for (const [k, v] of Object.entries(after)) log(`  ${k.padEnd(22)} ${v}`)

    const lost = CONTENT_KEYS.filter(k => Number(after[k]) !== Number(before[k]))

    log('')
    log(`  개인정보 잔존      : ${check.pii_remaining}건 ${Number(check.pii_remaining) === 0 ? '✔ OK' : '✘ 확인 필요'}`)
    log(`  SNS 연결 잔존      : ${check.social_remaining}건 ${Number(check.social_remaining) === 0 ? '✔ OK' : '✘ 확인 필요'}`)
    log(`  이벤트 콘텐츠 보존 : ${lost.length === 0 ? '✔ 전부 보존됨' : '✘ 손실 발생 → ' + lost.join(', ')}`)

    log(`\n완료. batch_id = ${batchId}`)
  } finally {
    await conn.end()
  }
}

main().catch(err => {
  console.error('\n실패:', err instanceof Error ? err.message : err)
  process.exitCode = 1
})
