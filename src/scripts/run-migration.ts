/**
 * 마이그레이션 SQL 파일을 실행한다.
 *   npx tsx src/scripts/run-migration.ts src/database/migrations/2026-09-anonymize.sql
 *   npx tsx src/scripts/run-migration.ts <파일> --dry    # 실행할 문장만 출력
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

/** 주석을 걷어내고 세미콜론 단위로 문장을 분리한다 */
function splitStatements(sql: string): string[] {
  return sql
    .split(/\r?\n/)
    .filter(l => !/^\s*--/.test(l))
    .join('\n')
    .split(';')
    .map(s => s.trim())
    .filter(Boolean)
}

async function main() {
  loadEnv()
  const file = process.argv[2]
  const dry = process.argv.includes('--dry')
  if (!file) throw new Error('마이그레이션 파일 경로를 인자로 주세요.')

  const statements = splitStatements(readFileSync(resolve(process.cwd(), file), 'utf8'))
  console.log(`파일: ${file}`)
  console.log(`문장: ${statements.length}개  [${dry ? 'DRY' : '실행'}]\n`)

  if (dry) {
    statements.forEach((s, i) => console.log(`--- ${i + 1} ---\n${s}\n`))
    return
  }

  const conn = await mysql.createConnection({
    host: process.env.NEXT_PUBLIC_MYSQL_HOST,
    port: parseInt(process.env.NEXT_PUBLIC_MYSQL_PORT || '3306', 10),
    user: process.env.NEXT_PUBLIC_MYSQL_USER,
    password: process.env.NEXT_PUBLIC_MYSQL_PASSWORD,
    database: process.env.NEXT_PUBLIC_MYSQL_DATABASE,
    multipleStatements: false
  })

  try {
    for (let i = 0; i < statements.length; i++) {
      const s = statements[i]
      const head = s.replace(/\s+/g, ' ').slice(0, 78)
      try {
        const [res] = await conn.query<any>(s)
        const affected = res?.affectedRows
        console.log(`  [${i + 1}/${statements.length}] OK   ${head}${affected !== undefined ? `  (${affected}행)` : ''}`)
      } catch (e: any) {
        // 이미 적용된 마이그레이션을 다시 돌려도 안전하도록 중복 오류는 건너뛴다
        if (['ER_DUP_FIELDNAME', 'ER_DUP_KEYNAME', 'ER_TABLE_EXISTS_ERROR'].includes(e.code)) {
          console.log(`  [${i + 1}/${statements.length}] SKIP ${head}  (이미 적용됨: ${e.code})`)
          continue
        }
        console.error(`  [${i + 1}/${statements.length}] FAIL ${head}`)
        throw e
      }
    }
    console.log('\n마이그레이션 완료.')
  } finally {
    await conn.end()
  }
}

main().catch(e => { console.error('\n실패:', e instanceof Error ? e.message : e); process.exitCode = 1 })
