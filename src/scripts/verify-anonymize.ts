/**
 * 익명화 결과 독립 검증 (읽기 전용).
 *   npx tsx src/scripts/verify-anonymize.ts
 */
import { readFileSync } from 'fs'
import { resolve } from 'path'
import mysql from 'mysql2/promise'

function loadEnv() {
  try {
    const raw = readFileSync(resolve(process.cwd(), '.env.local'), 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  } catch { /* noop */ }
}

const log = (...a: unknown[]) => console.log(...a)
const hr = (t: string) => log(`\n${'─'.repeat(70)}\n${t}\n${'─'.repeat(70)}`)

let failures = 0
function check(label: string, pass: boolean, detail = '') {
  if (!pass) failures++
  log(`  ${pass ? '✔' : '✘'} ${label.padEnd(44)} ${detail}`)
}

async function main() {
  loadEnv()
  const conn = await mysql.createConnection({
    host: (process.env.MYSQL_HOST ?? process.env.NEXT_PUBLIC_MYSQL_HOST),
    port: parseInt((process.env.MYSQL_PORT ?? process.env.NEXT_PUBLIC_MYSQL_PORT) || '3306', 10),
    user: (process.env.MYSQL_USER ?? process.env.NEXT_PUBLIC_MYSQL_USER),
    password: (process.env.MYSQL_PASSWORD ?? process.env.NEXT_PUBLIC_MYSQL_PASSWORD),
    database: (process.env.MYSQL_DATABASE ?? process.env.NEXT_PUBLIC_MYSQL_DATABASE),
    dateStrings: true
  })
  const one = async (sql: string, p: any[] = []) => {
    const [r] = await conn.query<any[]>(sql, p)
    return r[0]
  }

  try {
    hr('1. 개인정보 파기 확인')
    const pii = await one(
      `SELECT
         COUNT(*) AS total,
         SUM(email IS NOT NULL)          AS email,
         SUM(company IS NOT NULL)        AS company,
         SUM(address IS NOT NULL)        AS address,
         SUM(address_detail IS NOT NULL) AS address_detail,
         SUM(zip_code IS NOT NULL)       AS zip_code,
         SUM(profile_image IS NOT NULL)  AS profile_image,
         SUM(session_token IS NOT NULL)  AS session_token,
         SUM(last_login_ip IS NOT NULL)  AS last_login_ip,
         SUM(phone NOT LIKE 'DEL%')      AS real_phone,
         SUM(username NOT LIKE 'deleted\\_%') AS real_username,
         SUM(DATE_FORMAT(birth_date, '%m-%d') <> '01-01') AS birth_mmdd
       FROM users WHERE deleted_at IS NOT NULL`
    )
    log(`  익명화된 계정: ${pii.total}명`)
    for (const k of ['email', 'company', 'address', 'address_detail', 'zip_code', 'profile_image', 'session_token', 'last_login_ip', 'real_phone', 'real_username', 'birth_mmdd']) {
      check(`${k} 잔존`, Number(pii[k]) === 0, `${pii[k]}건`)
    }

    hr('2. 로그인 가능성 차단 확인')
    const sess = await one(`SELECT COUNT(*) AS c FROM users WHERE deleted_at IS NOT NULL AND session_token IS NOT NULL`)
    check('살아있는 세션', Number(sess.c) === 0, `${sess.c}건`)
    const soc = await one(`SELECT COUNT(*) AS c FROM social_accounts sa JOIN users u ON sa.user_id = u.id WHERE u.deleted_at IS NOT NULL`)
    check('SNS 연결 잔존', Number(soc.c) === 0, `${soc.c}건`)
    const socAll = await one(`SELECT COUNT(*) AS c FROM social_accounts`)
    log(`    (social_accounts 전체 잔여: ${socAll.c}행)`)
    // 익명화 대상만 검사한다. 제외된 운영자 계정들은 익명화 이전부터
    // 자리표시자 '010-0000-0000' 을 공유하고 있어 이번 작업과 무관하다.
    const dupPhone = await one(
      `SELECT COUNT(*) AS c FROM (
         SELECT phone FROM users WHERE deleted_at IS NOT NULL GROUP BY phone HAVING COUNT(*) > 1
       ) t`
    )
    check('더미 전화번호 중복', Number(dupPhone.c) === 0, `${dupPhone.c}건`)
    const dupUser = await one(
      `SELECT COUNT(*) AS c FROM (
         SELECT username FROM users GROUP BY username HAVING COUNT(*) > 1
       ) t`
    )
    check('아이디 중복', Number(dupUser.c) === 0, `${dupUser.c}건`)

    hr('3. 이벤트 콘텐츠 보존 확인 (JOIN 이 끊기지 않았는지)')
    const orphan = await one(
      `SELECT
         (SELECT COUNT(*) FROM support_comments sc LEFT JOIN users u ON sc.user_id=u.id WHERE u.id IS NULL) AS c1,
         (SELECT COUNT(*) FROM writings w LEFT JOIN users u ON w.user_id=u.id WHERE u.id IS NULL)           AS c2,
         (SELECT COUNT(*) FROM event_winners e LEFT JOIN users u ON e.user_id=u.id WHERE u.id IS NULL)      AS c3,
         (SELECT COUNT(*) FROM registrations r LEFT JOIN users u ON r.user_id=u.id WHERE u.id IS NULL)      AS c4`
    )
    check('응원 댓글 고아 행', Number(orphan.c1) === 0, `${orphan.c1}건`)
    check('가족 글쓰기 고아 행', Number(orphan.c2) === 0, `${orphan.c2}건`)
    check('당첨 기록 고아 행', Number(orphan.c3) === 0, `${orphan.c3}건`)
    check('참가신청 고아 행', Number(orphan.c4) === 0, `${orphan.c4}건`)

    const counts = await one(
      `SELECT
        (SELECT COUNT(*) FROM support_comments) AS sc,
        (SELECT COUNT(*) FROM writings) AS w,
        (SELECT COUNT(*) FROM event_winners) AS ew,
        (SELECT COUNT(*) FROM event_participations) AS ep,
        (SELECT COUNT(*) FROM quiz_event_participants) AS q,
        (SELECT COUNT(*) FROM registrations) AS r`
    )
    log(`\n  댓글 ${counts.sc} / 글 ${counts.w} / 당첨 ${counts.ew} / 참여 ${counts.ep} / 퀴즈 ${counts.q} / 참가신청 ${counts.r}`)

    hr('4. 실제 화면 쿼리 재현 (응원 댓글 · 작성자 표기)')
    const [comments] = await conn.query<any[]>(
      `SELECT sc.id, u.name AS author_name, u.phone, LEFT(sc.message, 22) AS message
       FROM support_comments sc JOIN users u ON sc.user_id = u.id
       ORDER BY sc.created_at DESC LIMIT 5`
    )
    for (const c of comments) log(`    ${String(c.author_name).padEnd(8)} | phone=${String(c.phone).padEnd(16)} | ${c.message}...`)
    check('댓글 작성자 전원 마스킹', comments.every(c => /^.ㅇ+$/.test(c.author_name)))

    hr('5. 실제 화면 쿼리 재현 (실시간 당첨 소식)')
    const [winners] = await conn.query<any[]>(
      `SELECT u.name AS user_name, p.name AS prize_name
       FROM event_winners ew JOIN users u ON ew.user_id = u.id
       JOIN prizes p ON ew.prize_id = p.id
       WHERE p.type != 'none' ORDER BY ew.won_at DESC LIMIT 5`
    )
    for (const w of winners) log(`    ${String(w.user_name).padEnd(8)} | ${w.prize_name}`)

    hr('6. 부수 개인정보 정리 확인')
    const side = await one(
      `SELECT
         (SELECT COUNT(*) FROM registrations r JOIN users u ON r.user_id=u.id
            WHERE u.deleted_at IS NOT NULL AND (r.address <> '' OR r.zip_code <> ''
              OR r.address_detail IS NOT NULL OR r.companion_details IS NOT NULL
              OR r.special_requests IS NOT NULL)) AS reg,
         (SELECT COUNT(*) FROM event_participations ep JOIN users u ON ep.user_id=u.id
            WHERE u.deleted_at IS NOT NULL AND (ep.ip_address IS NOT NULL OR ep.user_agent IS NOT NULL)) AS ep,
         (SELECT COUNT(*) FROM quiz_event_participants q JOIN users u ON q.user_id=u.id
            WHERE u.deleted_at IS NOT NULL AND (q.ip_address IS NOT NULL OR q.user_agent IS NOT NULL)) AS qz,
         (SELECT COUNT(*) FROM email_verifications) AS ev,
         (SELECT COUNT(*) FROM phone_verifications) AS pv,
         (SELECT COUNT(*) FROM email_verification_limits) AS evl`
    )
    check('참가신청 주소/요청사항 잔존', Number(side.reg) === 0, `${side.reg}건`)
    check('룰렛 참여 IP/UA 잔존', Number(side.ep) === 0, `${side.ep}건`)
    check('퀴즈 참여 IP/UA 잔존', Number(side.qz) === 0, `${side.qz}건`)
    check('이메일 인증 로그', Number(side.ev) === 0, `${side.ev}건`)
    check('전화 인증 로그', Number(side.pv) === 0, `${side.pv}건`)
    check('이메일 인증 제한 로그', Number(side.evl) === 0, `${side.evl}건`)

    hr('7. 제외 계정 / 데모 계정')
    const [kept] = await conn.query<any[]>(
      `SELECT username, name, role, deleted_at FROM users WHERE deleted_at IS NULL ORDER BY role DESC, username`
    )
    for (const k of kept) log(`    ${String(k.username).padEnd(20)} role=${String(k.role).padEnd(7)} name=${k.name}`)
    check('살아있는 계정 수', kept.length === 6, `${kept.length}명`)
    const demo = kept.find(k => k.username === 'test_admin')
    check('데모 계정 권한 강등됨', demo?.role === 'user', `role=${demo?.role}`)
    check('관리자 계정 보존', kept.filter(k => k.role === 'admin').length === 5, `${kept.filter(k => k.role === 'admin').length}명`)

    hr('8. 감사 로그')
    const auditLog = await one(`SELECT COUNT(*) AS c, COUNT(DISTINCT batch_id) AS b, SUM(had_social) AS s FROM user_anonymization_log`)
    log(`    기록 ${auditLog.c}건 / batch ${auditLog.b}개 / SNS 연결 해제 ${auditLog.s}건`)
    check('감사 로그 건수 일치', Number(auditLog.c) === Number(pii.total), `${auditLog.c} vs ${pii.total}`)

    log(`\n${'='.repeat(70)}`)
    log(failures === 0 ? '전체 검증 통과' : `검증 실패 ${failures}건 — 확인 필요`)
    log('='.repeat(70))
    if (failures > 0) process.exitCode = 1
  } finally {
    await conn.end()
  }
}

main().catch(e => { console.error('실패:', e instanceof Error ? e.message : e); process.exitCode = 1 })
