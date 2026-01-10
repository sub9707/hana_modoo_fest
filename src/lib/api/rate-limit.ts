import { query } from '@/lib/db'

export interface RateLimitResult {
  allowed: boolean
  remainingSeconds?: number
}

export async function checkRateLimit(
  userId: string,
  tableName: string,
  cooldownMs: number,
  dateColumn: string = 'created_at'
): Promise<RateLimitResult> {
  const result = await query(
    `SELECT ${dateColumn} FROM ${tableName} WHERE user_id = ? ORDER BY ${dateColumn} DESC LIMIT 1`,
    [userId]
  )

  if (result.length === 0) {
    return { allowed: true }
  }

  const lastTime = new Date(result[0][dateColumn])
  const now = new Date()
  const timeDiff = now.getTime() - lastTime.getTime()

  if (timeDiff < cooldownMs) {
    const remainingMs = cooldownMs - timeDiff
    const remainingSeconds = Math.ceil(remainingMs / 1000)

    return {
      allowed: false,
      remainingSeconds
    }
  }

  return { allowed: true }
}

export async function checkIpRateLimit(
  ipAddress: string,
  tableName: string,
  maxAttempts: number,
  windowMs: number
): Promise<RateLimitResult> {
  const windowStart = new Date(Date.now() - windowMs)

  const result = await query(
    `SELECT COUNT(*) as count FROM ${tableName} WHERE ip_address = ? AND created_at > ?`,
    [ipAddress, windowStart]
  )

  const attemptCount = result[0]?.count || 0

  if (attemptCount >= maxAttempts) {
    return {
      allowed: false,
      remainingSeconds: Math.ceil(windowMs / 1000)
    }
  }

  return { allowed: true }
}
