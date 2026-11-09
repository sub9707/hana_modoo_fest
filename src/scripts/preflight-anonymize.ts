/**
 * 익명화 착수 전 읽기 전용 사전 조사.
 *
 *   npx tsx src/scripts/preflight-anonymize.ts
 *
 * 아무것도 변경하지 않는다. 계획 수립 시 확인이 필요했던 항목들을 한 번에 출력한다.
 */
import { readFileSync } from 'fs'
import { resolve } from 'path'
import mysql from 'mysql2/promise'

function loadEnv() {
  try {
    const raw = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i)
      if (!m) continue
      if (!process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  } catch {
    /* 이미 주입된 환경이면 무시 */
  }
}

const log = (...a: unknown[]) => console.log(...a)
const hr = (t: string) => log(`\n${'─'.repeat(72)}\n${t}\n${'─'.repeat(72)}`)

async function main() {
  loadEnv()
  const conn = await mysql.createConnection({
    host: (process.env.MYSQL_HOST ?? process.env.NEXT_PUBLIC_MYSQL_HOST),
    port: (process.env.MYSQL_PORT ?? process.env.NEXT_PUBLIC_MYSQL_PORT) ? parseInt((process.env.MYSQL_PORT ?? process.env.NEXT_PUBLIC_MYSQL_PORT), 10) : 3306,
    user: (process.env.MYSQL_USER ?? process.env.NEXT_PUBLIC_MYSQL_USER),
    password: (process.env.MYSQL_PASSWORD ?? process.env.NEXT_PUBLIC_MYSQL_PASSWORD),
    database: (process.env.MYSQL_DATABASE ?? process.env.NEXT_PUBLIC_MYSQL_DATABASE),
    dateStrings: true
  })

  try {
    const [ver] = await conn.query<any[]>('SELECT VERSION() AS v, DATABASE() AS db')
    log(`DB : ${ver[0].db} @ ${(process.env.MYSQL_HOST ?? process.env.NEXT_PUBLIC_MYSQL_HOST)}:${(process.env.MYSQL_PORT ?? process.env.NEXT_PUBLIC_MYSQL_PORT)}`)
    log(`엔진: ${ver[0].v}`)

    hr('1. users 컬럼 제약 (익명화 UPDATE 확정용)')
    const [cols] = await conn.query<any[]>(
      `SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_KEY, COLUMN_DEFAULT
       FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users'
       ORDER BY ORDINAL_POSITION`
    )
    log('  컬럼'.padEnd(22) + 'TYPE'.padEnd(34) + 'NULL'.padEnd(6) + 'KEY')
    for (const c of cols) {
      log(`  ${String(c.COLUMN_NAME).padEnd(20)}${String(c.COLUMN_TYPE).padEnd(34)}${String(c.IS_NULLABLE).padEnd(6)}${c.COLUMN_KEY || ''}`)
    }
    const names = cols.map(c => c.COLUMN_NAME)
    log(`\n  deleted_at 존재      : ${names.includes('deleted_at') ? '있음 (마이그레이션 적용됨)' : '없음 → 마이그레이션 필요'}`)
    log(`  login_count 존재     : ${names.includes('login_count') ? '있음' : '없음 (코드가 헛읽는 중)'}`)

    hr('2. users 인덱스 / UNIQUE 제약')
    const [idx] = await conn.query<any[]>(
      `SELECT INDEX_NAME, GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) AS cols, NON_UNIQUE
       FROM information_schema.STATISTICS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users'
       GROUP BY INDEX_NAME, NON_UNIQUE`
    )
    for (const i of idx) {
      log(`  ${String(i.INDEX_NAME).padEnd(28)} (${i.cols})  ${i.NON_UNIQUE === 0 ? 'UNIQUE' : ''}`)
    }

    hr('3. users 를 참조하는 FK 와 ON DELETE 동작')
    const [fks] = await conn.query<any[]>(
      `SELECT k.TABLE_NAME, k.COLUMN_NAME, k.CONSTRAINT_NAME,
              k.REFERENCED_TABLE_NAME, r.DELETE_RULE
       FROM information_schema.KEY_COLUMN_USAGE k
       JOIN information_schema.REFERENTIAL_CONSTRAINTS r
         ON r.CONSTRAINT_NAME = k.CONSTRAINT_NAME AND r.CONSTRAINT_SCHEMA = k.TABLE_SCHEMA
       WHERE k.REFERENCED_TABLE_SCHEMA = DATABASE()
       ORDER BY k.REFERENCED_TABLE_NAME, k.TABLE_NAME`
    )
    if (fks.length === 0) {
      log('  FK 제약이 하나도 없음 → 논리적 FK만 사용 중.')
      log('  (users 를 DELETE 하면 고아 행이 남고 INNER JOIN 목록에서 조용히 사라짐)')
    } else {
      for (const f of fks) {
        log(`  ${String(f.TABLE_NAME).padEnd(28)}.${String(f.COLUMN_NAME).padEnd(16)} → ${String(f.REFERENCED_TABLE_NAME).padEnd(18)} ON DELETE ${f.DELETE_RULE}`)
      }
    }

    hr('4. 익명화 대상 산정')
    const [counts] = await conn.query<any[]>(
      `SELECT role, signup_method, COUNT(*) AS cnt
       FROM users GROUP BY role, signup_method ORDER BY role, signup_method`
    )
    log('  role / signup_method 분포')
    for (const c of counts) log(`    ${String(c.role).padEnd(10)} ${String(c.signup_method).padEnd(10)} ${c.cnt}명`)

    const [tgt] = await conn.query<any[]>(
      `SELECT
         (SELECT COUNT(*) FROM users) AS total,
         (SELECT COUNT(*) FROM users WHERE role NOT IN ('admin','editor') AND username <> 'test_admin') AS target,
         (SELECT COUNT(*) FROM users WHERE role IN ('admin','editor') OR username = 'test_admin') AS excluded`
    )
    log(`\n  전체 ${tgt[0].total}명 = 익명화 대상 ${tgt[0].target}명 + 제외 ${tgt[0].excluded}명`)

    const [exc] = await conn.query<any[]>(
      `SELECT username, name, role, signup_method, last_login_at FROM users
       WHERE role IN ('admin','editor') OR username = 'test_admin'
       ORDER BY role DESC, username`
    )
    log('\n  제외 계정 목록')
    for (const e of exc) {
      log(`    ${String(e.username).padEnd(20)} role=${String(e.role).padEnd(8)} 최근로그인=${e.last_login_at ?? '없음'}`)
    }

    hr('5. 보존해야 할 이벤트 콘텐츠 현황')
    const tables = [
      'support_comments', 'support_comment_likes', 'writings', 'writing_likes',
      'event_participations', 'event_winners', 'quiz_event_participants', 'registrations',
      'social_accounts', 'phone_verifications', 'email_verifications',
      'verification_limits', 'email_verification_limits', 'sms_send_logs'
    ]
    for (const t of tables) {
      const [ex] = await conn.query<any[]>(
        `SELECT TABLE_NAME FROM information_schema.TABLES
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`, [t]
      )
      if (ex.length === 0) { log(`  ${t.padEnd(30)} (테이블 없음)`); continue }
      const [r] = await conn.query<any[]>(`SELECT COUNT(*) AS c FROM \`${t}\``)
      log(`  ${t.padEnd(30)} ${r[0].c}행`)
    }

    hr('6. 데모 계정 현황')
    const [demo] = await conn.query<any[]>(
      `SELECT id, username, name, role, signup_method FROM users WHERE username = 'test_admin'`
    )
    if (demo.length === 0) log('  test_admin 계정이 존재하지 않음')
    else log(`  username=${demo[0].username}  role=${demo[0].role}  ${demo[0].role === 'admin' ? '← 강등 필요' : '← 이미 강등됨'}`)

    log('\n읽기 전용 조사 완료. 변경된 것은 없습니다.')
  } finally {
    await conn.end()
  }
}

main().catch(e => {
  console.error('\n실패:', e instanceof Error ? e.message : e)
  process.exitCode = 1
})
