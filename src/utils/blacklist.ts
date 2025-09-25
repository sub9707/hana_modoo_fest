// lib/utils/blacklist.ts
import { createHash } from 'crypto'
import { queryOne, query } from '@/lib/mysql/connection'

// 블랙리스트 체크 결과 타입
interface BlacklistCheckResult {
  isBlocked: boolean
  reason?: string
  blockedUntil?: Date
  message?: string
}

// 전화번호/이메일 블랙리스트 체크
export async function checkBlacklist(
  phone: string,
  email?: string,
  ipAddress?: string
): Promise<BlacklistCheckResult> {
  const phoneHash = createHash('sha256').update(phone).digest('hex')
  const emailHash = email ? createHash('sha256').update(email).digest('hex') : null

  try {
    // 1. 전화번호 기반 블랙리스트 체크
    const phoneBlacklist = await queryOne(
      `SELECT * FROM user_blacklist 
       WHERE phone_hash = ? AND (blocked_until IS NULL OR blocked_until > NOW())`,
      [phoneHash]
    )

    if (phoneBlacklist) {
      const message = phoneBlacklist.blocked_until 
        ? `해당 전화번호는 ${new Date(phoneBlacklist.blocked_until).toLocaleDateString()}까지 가입이 제한됩니다.`
        : '해당 전화번호는 가입이 영구 제한됩니다.'

      return {
        isBlocked: true,
        reason: phoneBlacklist.blacklist_reason,
        blockedUntil: phoneBlacklist.blocked_until ? new Date(phoneBlacklist.blocked_until) : undefined,
        message
      }
    }

    // 2. 이메일 기반 블랙리스트 체크 (SNS 가입 시)
    if (emailHash) {
      const emailBlacklist = await queryOne(
        `SELECT * FROM user_blacklist 
         WHERE email_hash = ? AND (blocked_until IS NULL OR blocked_until > NOW())`,
        [emailHash]
      )

      if (emailBlacklist) {
        const message = emailBlacklist.blocked_until
          ? `해당 이메일 주소는 ${new Date(emailBlacklist.blocked_until).toLocaleDateString()}까지 가입이 제한됩니다.`
          : '해당 이메일 주소는 가입이 영구 제한됩니다.'

        return {
          isBlocked: true,
          reason: emailBlacklist.blacklist_reason,
          blockedUntil: emailBlacklist.blocked_until ? new Date(emailBlacklist.blocked_until) : undefined,
          message
        }
      }
    }

    // 3. IP 기반 의심 활동 체크 (너무 많은 가입 시도)
    if (ipAddress) {
      const recentSignups = await queryOne(
        `SELECT COUNT(*) as count FROM signup_deletion_patterns 
         WHERE ip_address = ? AND first_signup_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)`,
        [ipAddress]
      )

      // 24시간 내 10회 이상 가입 시도 시 경고
      if (recentSignups && recentSignups.count >= 10) {
        return {
          isBlocked: true,
          reason: 'excessive_signup_attempts',
          message: '해당 IP에서 너무 많은 가입 시도가 감지되었습니다. 잠시 후 다시 시도해주세요.'
        }
      }
    }

    return { isBlocked: false }

  } catch (error) {
    console.error('Blacklist check error:', error)
    // 에러 시에는 가입을 허용하되 로그 남김
    return { isBlocked: false }
  }
}

// 가입 패턴 추적 (정상 가입 시 호출)
export async function trackSignupPattern(
  phone: string,
  email?: string,
  ipAddress?: string
): Promise<void> {
  const phoneHash = createHash('sha256').update(phone).digest('hex')
  const emailHash = email ? createHash('sha256').update(email).digest('hex') : null

  try {
    await query(
      `INSERT INTO signup_deletion_patterns 
       (phone_hash, email_hash, ip_address, signup_count, last_signup_at)
       VALUES (?, ?, ?, 1, NOW())
       ON DUPLICATE KEY UPDATE
       signup_count = signup_count + 1,
       last_signup_at = NOW()`,
      [phoneHash, emailHash, ipAddress]
    )
  } catch (error) {
    console.error('Track signup pattern error:', error)
    // 에러가 나도 가입은 진행
  }
}

// 블랙리스트 해제 (관리자용)
export async function removeFromBlacklist(
  phoneOrEmail: string,
  adminId: string,
  reason: string
): Promise<boolean> {
  try {
    // 전화번호 또는 이메일 해시 생성
    const hash = createHash('sha256').update(phoneOrEmail).digest('hex')

    const result = await query(
      `UPDATE user_blacklist 
       SET blocked_until = NOW(), updated_at = NOW() 
       WHERE (phone_hash = ? OR email_hash = ?) AND (blocked_until IS NULL OR blocked_until > NOW())`,
      [hash, hash]
    )

    // 관리자 액션 로그 기록
    if (result.affectedRows > 0) {
      await query(
        `INSERT INTO admin_actions (admin_id, action_type, target_phone_hash, reason)
         VALUES (?, 'user_unblock', ?, ?)`,
        [adminId, hash, reason]
      )
    }

    return result.affectedRows > 0

  } catch (error) {
    console.error('Remove from blacklist error:', error)
    return false
  }
}

// 블랙리스트 상태 조회 (관리자용)
export async function getBlacklistStatus(phoneOrEmail: string) {
  try {
    const hash = createHash('sha256').update(phoneOrEmail).digest('hex')

    const blacklistEntry = await queryOne(
      `SELECT *, 
       CASE 
         WHEN blocked_until IS NULL THEN 'permanent'
         WHEN blocked_until > NOW() THEN 'temporary'
         ELSE 'expired'
       END as status
       FROM user_blacklist 
       WHERE phone_hash = ? OR email_hash = ?`,
      [hash, hash]
    )

    if (!blacklistEntry) {
      return null
    }

    return {
      id: blacklistEntry.id,
      reason: blacklistEntry.blacklist_reason,
      blockedUntil: blacklistEntry.blocked_until,
      status: blacklistEntry.status,
      evidence: blacklistEntry.evidence_data,
      createdAt: blacklistEntry.created_at
    }

  } catch (error) {
    console.error('Get blacklist status error:', error)
    return null
  }
}

// 의심스러운 패턴 조회 (관리자용)
export async function getSuspiciousPatterns(limit: number = 50) {
  try {
    const patterns = await query(
      `SELECT 
         phone_hash,
         signup_count,
         deletion_count,
         shortest_account_duration_hours,
         is_suspicious,
         last_signup_at,
         last_deletion_at,
         CASE 
           WHEN deletion_count >= 5 THEN 'high_risk'
           WHEN deletion_count >= 3 OR shortest_account_duration_hours <= 1 THEN 'medium_risk'
           WHEN is_suspicious = 1 THEN 'low_risk'
           ELSE 'normal'
         END as risk_level
       FROM signup_deletion_patterns 
       WHERE is_suspicious = 1 OR deletion_count >= 2
       ORDER BY 
         CASE 
           WHEN deletion_count >= 5 THEN 1
           WHEN deletion_count >= 3 THEN 2
           WHEN shortest_account_duration_hours <= 1 THEN 3
           ELSE 4
         END,
         last_deletion_at DESC
       LIMIT ?`,
      [limit]
    )

    return patterns || []

  } catch (error) {
    console.error('Get suspicious patterns error:', error)
    return []
  }
}