/**
 * 익명화 스크립트가 건드리는 컬럼이 실제로 존재하는지 검증한다 (읽기 전용).
 *   npx tsx src/scripts/preflight-columns.ts
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

const EXPECTED: Record<string, string[]> = {
  registrations: ['address', 'address_detail', 'zip_code', 'companion_details', 'special_requests'],
  event_participations: ['ip_address', 'user_agent'],
  quiz_event_participants: ['ip_address', 'user_agent']
}

async function main() {
  loadEnv()
  const conn = await mysql.createConnection({
    host: process.env.NEXT_PUBLIC_MYSQL_HOST,
    port: parseInt(process.env.NEXT_PUBLIC_MYSQL_PORT || '3306', 10),
    user: process.env.NEXT_PUBLIC_MYSQL_USER,
    password: process.env.NEXT_PUBLIC_MYSQL_PASSWORD,
    database: process.env.NEXT_PUBLIC_MYSQL_DATABASE,
    dateStrings: true
  })

  try {
    console.log('스크립트가 NULL 로 비울 컬럼 존재 확인\n')
    let ok = true
    for (const [table, cols] of Object.entries(EXPECTED)) {
      const [rows] = await conn.query<any[]>(
        `SELECT COLUMN_NAME, IS_NULLABLE FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`, [table]
      )
      const actual = new Map(rows.map(r => [r.COLUMN_NAME, r.IS_NULLABLE]))
      console.log(`  [${table}]`)
      for (const c of cols) {
        if (!actual.has(c)) { console.log(`    ✘ ${c.padEnd(20)} 컬럼 없음`); ok = false }
        else if (actual.get(c) === 'NO') { console.log(`    ✘ ${c.padEnd(20)} NOT NULL → NULL 로 비울 수 없음`); ok = false }
        else console.log(`    ✔ ${c.padEnd(20)} nullable`)
      }
    }

    console.log('\n계획에 없던 테이블 : user_consents')
    const [uc] = await conn.query<any[]>(
      `SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'user_consents'
       ORDER BY ORDINAL_POSITION`
    )
    if (uc.length === 0) console.log('  (테이블 없음)')
    else {
      for (const c of uc) console.log(`    ${String(c.COLUMN_NAME).padEnd(24)} ${String(c.COLUMN_TYPE).padEnd(26)} null=${c.IS_NULLABLE}`)
      const [n] = await conn.query<any[]>('SELECT COUNT(*) AS c FROM user_consents')
      console.log(`    → ${n[0].c}행`)
    }

    console.log(`\n결과: ${ok ? '스크립트가 건드리는 컬럼 전부 정상' : '❌ 스크립트 수정 필요'}`)
  } finally {
    await conn.end()
  }
}

main().catch(e => { console.error('실패:', e instanceof Error ? e.message : e); process.exitCode = 1 })
