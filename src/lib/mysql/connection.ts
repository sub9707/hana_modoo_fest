import mysql from 'mysql2/promise'

const config = {
  host: process.env.NEXT_PUBLIC_MYSQL_HOST || 'localhost',
  port: process.env.NEXT_PUBLIC_MYSQL_PORT ? parseInt(process.env.NEXT_PUBLIC_MYSQL_PORT, 10) : 3306,
  user: process.env.NEXT_PUBLIC_MYSQL_USER || 'root',
  password: process.env.NEXT_PUBLIC_MYSQL_PASSWORD || '',
  database: process.env.NEXT_PUBLIC_MYSQL_DATABASE || 'modohana_festival',
  charset: 'utf8mb4',
  timezone: '+09:00',
  dateStrings: true,
  multipleStatements: false,

  // 🚀 기본 연결 풀 설정만 사용 (경고 제거)
  connectionLimit: 30,
  queueLimit: 0,
  waitForConnections: true,
  
  // 🚀 기본 성능 설정
  supportBigNumbers: true,
  bigNumberStrings: true,
}

// 연결 풀 생성 및 관리
declare global {
  var __mysql_pool: mysql.Pool | undefined
}

// 글로벌 풀 재사용
const pool: mysql.Pool = global.__mysql_pool || mysql.createPool(config)

if (process.env.NODE_ENV !== 'production') {
  global.__mysql_pool = pool
}

export function getPool(): mysql.Pool {
  return pool
}

// 🚀 성능 모니터링이 추가된 쿼리 함수
export async function query(
  sql: string,
  params?: any[]
): Promise<any> {
  const startTime = Date.now()
  const connection = getPool()

  try {
    const [rows] = await connection.execute(sql, params || [])

    // 개발 환경에서 느린 쿼리 로깅
    if (process.env.NODE_ENV === 'development') {
      const duration = Date.now() - startTime
      if (duration > 100) { // 100ms 이상 걸린 쿼리
        console.warn(`🐌 Slow query (${duration}ms):`, sql.substring(0, 100) + '...')
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

// 🚀 성능 모니터링이 추가된 단일 결과 조회 함수
export async function queryOne(
  sql: string,
  params?: any[]
): Promise<any> {
  const rows = await query(sql, params)
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null
}

// 🚀 트랜잭션 함수 개선 (타임아웃 추가)
export async function transaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const startTime = Date.now()
  const connection = await getPool().getConnection()

  try {
    await connection.beginTransaction()

    // 트랜잭션 타임아웃 설정 (10초)
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Transaction timeout')), 10000)
    })

    const result = await Promise.race([
      callback(connection),
      timeoutPromise
    ])

    await connection.commit()

    // 개발 환경에서 긴 트랜잭션 로깅
    if (process.env.NODE_ENV === 'development') {
      const duration = Date.now() - startTime
      if (duration > 200) { // 200ms 이상 걸린 트랜잭션
        console.warn(`🐌 Long transaction (${duration}ms)`)
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

// 연결 풀 상태 모니터링 함수
export function getPoolStatus() {
  try {
    const poolConfig = (pool as any).config
    const poolConnections = (pool as any)._allConnections
    const freeConnections = (pool as any)._freeConnections

    // poolConfig가 undefined인 경우 기본값 반환
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

// 개발 환경에서 연결 풀 상태 주기적 로깅
if (process.env.NODE_ENV === 'development') {
  const intervalId = setInterval(() => {
    try {
      const status = getPoolStatus()
      if (status.status === 'ok' && typeof status.activeConnections === 'number' && status.activeConnections > 5) {
        console.log('📊 MySQL Pool Status:', status)
      }
    } catch (error) {
      console.warn('Pool status monitoring stopped due to error:', error)
      clearInterval(intervalId) // ✅ 올바른 방법
    }
  }, 30000) // 30초마다
}

// 헬스체크 함수 개선
export async function healthCheck(): Promise<boolean> {
  const startTime = Date.now()
  try {
    await query('SELECT 1 as health')
    const duration = Date.now() - startTime

    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ DB Health Check: ${duration}ms`)
    }

    return true
  } catch (error) {
    console.error('❌ Database health check failed:', error)
    return false
  }
}

// 연결 풀 정리 함수
export async function closePool(): Promise<void> {
  if (!pool) return
  try {
    // pool이 이미 종료된 상태인지 체크
    if ((pool as any)._closed) return
    await pool.end()
    console.log('🔌 Database connection pool closed')
  } catch (error) {
    console.error('Error closing database pool:', error)
  }
}

// 프로세스 종료 시 정리
if (process.env.NODE_ENV === 'development' && typeof process !== 'undefined') {
  process.on('SIGTERM', closePool)
  process.on('SIGINT', closePool)
}