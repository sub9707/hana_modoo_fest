import mysql from 'mysql2/promise'

const env = (key: string) => process.env[`MYSQL_${key}`] ?? process.env[`NEXT_PUBLIC_MYSQL_${key}`]

const config = {
  host: env('HOST') || 'localhost',
  port: parseInt(env('PORT') || '3306', 10),
  user: env('USER') || 'root',
  password: env('PASSWORD') || '',
  database: env('DATABASE') || 'modohana_festival',
  charset: 'utf8mb4',
  timezone: '+09:00',
  dateStrings: true,
  multipleStatements: false,

  connectionLimit: 10,
  queueLimit: 0,
  waitForConnections: true,

  supportBigNumbers: true,
  bigNumberStrings: true,
}

declare global {
  var __mysql_pool: mysql.Pool | undefined
}

// 개발 환경의 HMR 로 모듈이 다시 로드돼도 풀을 새로 만들지 않도록 전역에 보관한다.
const pool: mysql.Pool = global.__mysql_pool || mysql.createPool(config)

if (process.env.NODE_ENV !== 'production') {
  global.__mysql_pool = pool
}

const SLOW_QUERY_MS = 150
const SLOW_TRANSACTION_MS = 300
const TRANSACTION_TIMEOUT_MS = 5000

export function getPool(): mysql.Pool {
  return pool
}

export async function query(
  sql: string,
  params?: any[]
): Promise<any> {
  const startTime = Date.now()
  const connection = getPool()

  try {
    const [rows] = await connection.execute(sql, params || [])

    if (process.env.NODE_ENV === 'development') {
      const duration = Date.now() - startTime
      if (duration > SLOW_QUERY_MS) {
        console.warn(`Slow query (${duration}ms):`, sql.substring(0, 100) + '...')
      }
    }

    return rows
  } catch (error) {
    console.error('Database query error:', {
      sql: sql.substring(0, 100) + '...',
      params: params?.map(p => typeof p === 'string' ? p.substring(0, 50) + '...' : p),
      duration: Date.now() - startTime + 'ms',
      error: error instanceof Error ? error.message : error
    })
    throw error
  }
}

export async function queryOne(
  sql: string,
  params?: any[]
): Promise<any> {
  const rows = await query(sql, params)
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null
}

export async function transaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const startTime = Date.now()
  const connection = await getPool().getConnection()

  try {
    await connection.beginTransaction()

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Transaction timeout')), TRANSACTION_TIMEOUT_MS)
    })

    const result = await Promise.race([
      callback(connection),
      timeoutPromise
    ])

    await connection.commit()

    if (process.env.NODE_ENV === 'development') {
      const duration = Date.now() - startTime
      if (duration > SLOW_TRANSACTION_MS) {
        console.warn(`Long transaction (${duration}ms)`)
      }
    }

    return result
  } catch (error) {
    await connection.rollback()
    console.error('Transaction error:', {
      duration: Date.now() - startTime + 'ms',
      error: error instanceof Error ? error.message : error
    })
    throw error
  } finally {
    connection.release()
  }
}

// mysql2 는 풀 상태를 공개 API 로 제공하지 않아 내부 필드를 읽는다.
export function getPoolStatus() {
  try {
    const poolConfig = (pool as any).config
    const poolConnections = (pool as any)._allConnections
    const freeConnections = (pool as any)._freeConnections

    if (!poolConfig) {
      return {
        maxConnections: 'unknown',
        totalConnections: 0,
        freeConnections: 0,
        activeConnections: 0,
        status: 'config_unavailable'
      }
    }

    return {
      maxConnections: poolConfig.connectionLimit || 'unknown',
      totalConnections: poolConnections ? poolConnections.length : 0,
      freeConnections: freeConnections ? freeConnections.length : 0,
      activeConnections: poolConnections ? poolConnections.length - (freeConnections ? freeConnections.length : 0) : 0,
      status: 'ok'
    }
  } catch (error) {
    console.warn('Failed to get pool status:', error)
    return {
      maxConnections: 'error',
      totalConnections: 0,
      freeConnections: 0,
      activeConnections: 0,
      status: 'error'
    }
  }
}

// 개발 환경에서는 5분마다 풀 상태를 확인해 활성 연결이 많을 때만 로그를 남긴다.
if (process.env.NODE_ENV === 'development') {
  const monitoringInterval = setInterval(() => {
    try {
      const status = getPoolStatus()
      if (status.status === 'ok' && typeof status.activeConnections === 'number' && status.activeConnections > 3) {
        console.log('MySQL pool status:', status)
      }
    } catch (error) {
      console.warn('Pool status monitoring stopped due to error:', error)
      clearInterval(monitoringInterval)
    }
  }, 5 * 60 * 1000)
}

export async function healthCheck(): Promise<boolean> {
  try {
    await query('SELECT 1 as health')
    return true
  } catch (error) {
    console.error('Database health check failed:', error)
    return false
  }
}

export async function closePool(): Promise<void> {
  if (!pool) return
  try {
    if ((pool as any)._closed) return
    await pool.end()
  } catch (error) {
    console.error('Error closing database pool:', error)
  }
}

if (process.env.NODE_ENV === 'development' && typeof process !== 'undefined') {
  process.on('SIGTERM', closePool)
  process.on('SIGINT', closePool)
  process.on('beforeExit', closePool)
}
