import mysql from 'mysql2/promise'

const config = {
  host: process.env.NEXT_PUBLIC_MYSQL_HOST || '192.168.219.102',
  port: process.env.NEXT_PUBLIC_MYSQL_PORT ? parseInt(process.env.NEXT_PUBLIC_MYSQL_PORT, 10) : 13306,
  user: process.env.NEXT_PUBLIC_MYSQL_USER || 'root',
  password: process.env.NEXT_PUBLIC_MYSQL_PASSWORD || '',
  database: process.env.NEXT_PUBLIC_MYSQL_DATABASE || 'modohana_festival',
  charset: 'utf8mb4',
  timezone: '+09:00',
  dateStrings: true,
  // NextJS 15: 연결 풀 설정 개선
  connectionLimit: 10,
  multipleStatements: false,
}

// NextJS 15: 글로벌 변수를 사용한 연결 풀 관리
declare global {
  var __mysql_pool: mysql.Pool | undefined
}

let pool: mysql.Pool

if (process.env.NODE_ENV === 'production') {
  pool = mysql.createPool(config)
} else {
  // NextJS 15: 개발 환경에서 HMR로 인한 재연결 방지
  if (!global.__mysql_pool) {
    global.__mysql_pool = mysql.createPool(config)
  }
  pool = global.__mysql_pool
}

export function getPool(): mysql.Pool {
  return pool
}

// NextJS 15: 쿼리 함수 개선 (에러 핸들링 강화)
export async function query(
  sql: string,
  params?: any[]
): Promise<any> {
  const connection = getPool()
  try {
    const [rows] = await connection.execute(sql, params || [])
    return rows
  } catch (error) {
    console.error('Database query error:', {
      sql,
      params,
      error: error instanceof Error ? error.message : error
    })
    throw error
  }
}

// NextJS 15: 단일 결과 조회 함수 개선
export async function queryOne(
  sql: string,
  params?: any[]
): Promise<any> {
  const rows = await query(sql, params)
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null
}

// NextJS 15: 트랜잭션 함수 개선
export async function transaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const connection = await getPool().getConnection()
  
  try {
    await connection.beginTransaction()
    const result = await callback(connection)
    await connection.commit()
    return result
  } catch (error) {
    await connection.rollback()
    console.error('Transaction error:', error)
    throw error
  } finally {
    connection.release()
  }
}

// NextJS 15: 헬스체크 함수 추가
export async function healthCheck(): Promise<boolean> {
  try {
    await query('SELECT 1 as health')
    return true
  } catch (error) {
    console.error('Database health check failed:', error)
    return false
  }
}

// NextJS 15: 연결 풀 정리 함수
export async function closePool(): Promise<void> {
  try {
    await pool.end()
    console.log('Database connection pool closed')
  } catch (error) {
    console.error('Error closing database pool:', error)
  }
}

// NextJS 15: 프로세스 종료 시 정리
if (typeof process !== 'undefined') {
  process.on('SIGTERM', closePool)
  process.on('SIGINT', closePool)
}