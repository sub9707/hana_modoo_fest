import mysql from 'mysql2/promise'

// 🚀 Vercel 최적화된 연결 설정
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

  // 🚀 Vercel 비용 최적화된 연결 풀 설정
  connectionLimit: 10, // ✅ 30 → 10으로 변경 (67% 비용 절감)
  queueLimit: 0,
  waitForConnections: true,
  
  // 🚀 기본 성능 설정 (MySQL2 공식 지원)
  supportBigNumbers: true,
  bigNumberStrings: true,
}

// 연결 풀 생성 및 관리 (기존 로직 유지)
declare global {
  var __mysql_pool: mysql.Pool | undefined
}

// 글로벌 풀 재사용 (기존 로직 유지)
const pool: mysql.Pool = global.__mysql_pool || mysql.createPool(config)

if (process.env.NODE_ENV !== 'production') {
  global.__mysql_pool = pool
}

export function getPool(): mysql.Pool {
  return pool
}

// 🚀 성능 모니터링이 추가된 쿼리 함수 (기존 기능 모두 유지)
export async function query(
  sql: string,
  params?: any[]
): Promise<any> {
  const startTime = Date.now()
  const connection = getPool()

  try {
    const [rows] = await connection.execute(sql, params || [])

    // 🚀 개발 환경에서 느린 쿼리 로깅 (임계값 최적화)
    if (process.env.NODE_ENV === 'development') {
      const duration = Date.now() - startTime
      if (duration > 150) { // ✅ 100ms → 150ms (덜 민감하게 조정)
        console.warn(`🐌 Slow query (${duration}ms):`, sql.substring(0, 100) + '...')
      }
    }

    return rows
  } catch (error) {
    // 🚀 에러 로깅 최적화 (기존 기능 유지)
    console.error('Database query error:', {
      sql: sql.substring(0, 100) + '...',
      params: params?.map(p => typeof p === 'string' ? p.substring(0, 50) + '...' : p),
      duration: Date.now() - startTime + 'ms',
      error: error instanceof Error ? error.message : error
    })
    throw error
  }
}

// 🚀 성능 모니터링이 추가된 단일 결과 조회 함수 (기존 기능 완전 유지)
export async function queryOne(
  sql: string,
  params?: any[]
): Promise<any> {
  const rows = await query(sql, params)
  return Array.isArray(rows) && rows.length > 0 ? rows[0] : null
}

// 🚀 트랜잭션 함수 개선 (Vercel 비용 최적화)
export async function transaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const startTime = Date.now()
  const connection = await getPool().getConnection()

  try {
    await connection.beginTransaction()

    // 🚀 트랜잭션 타임아웃 최적화 (10초 → 5초)
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Transaction timeout')), 5000) // ✅ 10초 → 5초
    })

    const result = await Promise.race([
      callback(connection),
      timeoutPromise
    ])

    await connection.commit()

    // 🚀 개발 환경에서 긴 트랜잭션 로깅 (기존 기능 유지)
    if (process.env.NODE_ENV === 'development') {
      const duration = Date.now() - startTime
      if (duration > 300) { // ✅ 200ms → 300ms (덜 민감하게 조정)
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

// 🚀 연결 풀 상태 모니터링 함수 (기존 기능 완전 유지)
export function getPoolStatus() {
  try {
    const poolConfig = (pool as any).config
    const poolConnections = (pool as any)._allConnections
    const freeConnections = (pool as any)._freeConnections

    // poolConfig가 undefined인 경우 기본값 반환 (기존 로직 유지)
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

// 🚀 개발 환경에서 연결 풀 상태 주기적 로깅 (Vercel 비용 최적화)
if (process.env.NODE_ENV === 'development') {
  let poolMonitoringInterval: NodeJS.Timeout | null = null

  const startPoolMonitoring = () => {
    // 기존 인터벌이 있으면 정리
    if (poolMonitoringInterval) {
      clearInterval(poolMonitoringInterval)
    }

    poolMonitoringInterval = setInterval(() => {
      try {
        const status = getPoolStatus()
        // 🚀 더 엄격한 조건으로 로깅 (활성 연결이 3개 이상일 때만)
        if (status.status === 'ok' && typeof status.activeConnections === 'number' && status.activeConnections > 3) {
          console.log('📊 MySQL Pool Status:', status)
        }
      } catch (error) {
        console.warn('Pool status monitoring stopped due to error:', error)
        if (poolMonitoringInterval) {
          clearInterval(poolMonitoringInterval)
          poolMonitoringInterval = null
        }
      }
    }, 300000) // ✅ 30초 → 5분 (300초)으로 변경 (90% 비용 절감)
  }

  // 개발 서버 시작 시 모니터링 시작
  startPoolMonitoring()

  // 🚀 정리 함수 추가 (메모리 누수 방지)
  const stopPoolMonitoring = () => {
    if (poolMonitoringInterval) {
      clearInterval(poolMonitoringInterval)
      poolMonitoringInterval = null
    }
  }

  // 🚀 Next.js 개발 환경에서 모듈 재로드 시 정리
  if (typeof global !== 'undefined') {
    // 전역 정리 함수 등록
    global.__cleanup_pool_monitoring = stopPoolMonitoring
  }
}

// 🚀 헬스체크 함수 개선 (기존 기능 완전 유지)
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

// 🚀 연결 풀 정리 함수 (기존 기능 완전 유지)
export async function closePool(): Promise<void> {
  if (!pool) return
  try {
    // pool이 이미 종료된 상태인지 체크 (기존 로직 유지)
    if ((pool as any)._closed) return
    await pool.end()
    console.log('🔌 Database connection pool closed')
  } catch (error) {
    console.error('Error closing database pool:', error)
  }
}

// 🚀 프로세스 종료 시 정리 (기존 기능 완전 유지)
if (process.env.NODE_ENV === 'development' && typeof process !== 'undefined') {
  process.on('SIGTERM', closePool)
  process.on('SIGINT', closePool)
  
  // 🚀 추가: 정상 종료 시에도 풀 정리
  process.on('beforeExit', closePool)
}

// 🚀 추가 유틸리티 함수들 (기존에 없던 기능 - 성능 모니터링 강화)
export function getConnectionStats() {
  const status = getPoolStatus()
  return {
    ...status,
    efficiency: status.totalConnections > 0 
      ? Math.round((status.activeConnections / status.totalConnections) * 100) 
      : 0,
    timestamp: new Date().toISOString()
  }
}

// 🚀 연결 풀 최적화를 위한 추가 함수
export async function optimizePool(): Promise<void> {
  if (process.env.NODE_ENV !== 'development') return
  
  try {
    const status = getPoolStatus()
    console.log('🔧 Pool optimization check:', status)
    
    // 유휴 연결이 너무 많으면 경고
    if (status.freeConnections > 7) {
      console.warn('⚠️ Too many idle connections. Consider reducing connectionLimit.')
    }
    
    // 활성 연결이 한계에 가까우면 경고  
    if (status.activeConnections > 8) {
      console.warn('⚠️ High connection usage. Consider increasing connectionLimit or optimizing queries.')
    }
  } catch (error) {
    console.error('Pool optimization check failed:', error)
  }
}