// src/app/(site)/my-page/delete-account/actions.ts
'use server'

import { cookies } from 'next/headers'
import { createHash } from 'crypto'
import { queryOne, query, transaction } from '@/lib/mysql/connection'
import { revalidateTag } from 'next/cache'

// 통합 탈퇴 데이터 인터페이스
interface DeleteAccountData {
  password?: string // SNS 가입자는 선택사항
  reason?: 'privacy_concern' | 'service_dissatisfaction' | 'no_longer_needed' | 'duplicate_account' | 'other'
  reasonDetail?: string
  confirmDelete: boolean
  agreeRestriction?: boolean
}

interface DeleteAccountResponse {
  success: boolean
  error?: string
  message?: string
  patternWarning?: string
  blocked?: boolean
  blockedUntil?: string
}

// 악의적 패턴 감지 기준
const ABUSE_THRESHOLDS = {
  MAX_DELETIONS_PER_MONTH: 3,        // 월 최대 탈퇴 횟수
  MIN_ACCOUNT_AGE_HOURS: 1,          // 최소 계정 유지 시간
  MAX_QUICK_DELETIONS: 5,            // 빠른 탈퇴 최대 횟수
  SUSPICIOUS_IP_COUNT: 10,           // 동일 IP에서 의심스러운 삭제 횟수
  BLACKLIST_THRESHOLD: 5             // 블랙리스트 등록 기준 삭제 횟수
}

export async function deleteAccount(data: DeleteAccountData): Promise<DeleteAccountResponse> {
  try {
    if (!data.confirmDelete) {
      return {
        success: false,
        error: '탈퇴 확인이 필요합니다.'
      }
    }

    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session-token')?.value

    if (!sessionToken) {
      return {
        success: false,
        error: '인증이 필요합니다.'
      }
    }

    // 클라이언트 IP는 Server Action에서 직접 가져올 수 없으므로 기본값 사용
    const clientIp = '127.0.0.1' // 실제 구현에서는 헤더에서 가져와야 함

    // 트랜잭션으로 탈퇴 처리
    const result = await transaction(async (connection) => {
      // 1. 현재 사용자 정보 조회 (SNS 계정 수 포함)
      const [rows] = await connection.execute(
        `SELECT u.*, 
                COUNT(sa.id) as social_account_count,
                COALESCE(u.login_count, 0) as total_logins
         FROM users u 
         LEFT JOIN social_accounts sa ON u.id = sa.user_id
         WHERE u.session_token = ?
         GROUP BY u.id`,
        [sessionToken]
      )

      const userRows = rows as any[]
      if (userRows.length === 0) {
        throw new Error('사용자를 찾을 수 없습니다')
      }

      const user = userRows[0]

      // 2. 비밀번호 확인 (전화번호 가입자만)
      if (user.signup_method === 'phone') {
        if (!data.password) {
          throw new Error('현재 비밀번호를 입력해주세요')
        }
        
        const hashedPassword = hashPassword(data.password, user.password_salt)
        if (hashedPassword !== user.password_hash) {
          throw new Error('현재 비밀번호가 올바르지 않습니다')
        }
      }
      // SNS 가입자는 비밀번호 검증 건너뛰기

      // 3. 계정 생존 기간 계산
      const accountCreatedAt = new Date(user.created_at)
      const now = new Date()
      const accountAgeHours = Math.floor((now.getTime() - accountCreatedAt.getTime()) / (1000 * 60 * 60))
      const accountAgeDays = Math.floor(accountAgeHours / 24)

      // 4. 마지막 활동으로부터 기간 계산
      const lastActivityAt = user.last_activity_at ? new Date(user.last_activity_at) : accountCreatedAt
      const lastActivityDaysAgo = Math.floor((now.getTime() - lastActivityAt.getTime()) / (1000 * 60 * 60 * 24))

      // 5. 해시값 생성 (개인정보 보호)
      const userIdHash = createHash('sha256').update(user.id).digest('hex')
      const phoneHash = createHash('sha256').update(user.phone).digest('hex')
      const emailHash = user.email ? createHash('sha256').update(user.email).digest('hex') : null

      // 6. 악의적 패턴 분석
      const patternAnalysis = await analyzeUserPattern(connection, phoneHash, emailHash, clientIp, accountAgeHours)
      
      // 7. 블랙리스트 체크 및 업데이트
      if (patternAnalysis.shouldBlacklist) {
        await addToBlacklist(connection, phoneHash, emailHash, clientIp, patternAnalysis.reason, patternAnalysis.evidence)
      }

      // 8. 탈퇴 기록 저장 (통계 목적)
      await connection.execute(
        `INSERT INTO account_deletions (
          user_id_hash, phone_hash, email_hash, ip_address, signup_method,
          deletion_reason, deletion_reason_detail, account_age_days, 
          last_activity_days_ago, total_logins, had_social_accounts
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userIdHash, phoneHash, emailHash, clientIp, user.signup_method,
          data.reason, data.reasonDetail, accountAgeDays, lastActivityDaysAgo,
          user.total_logins || 0, user.social_account_count > 0 ? 1 : 0
        ]
      )

      // 9. SNS 계정 연결 해제
      await connection.execute('DELETE FROM social_accounts WHERE user_id = ?', [user.id])

      // 10. 인증 관련 정보 삭제
      await connection.execute('DELETE FROM phone_verifications WHERE phone = ?', [user.phone])

      // 11. 사용자 계정 완전 삭제
      await connection.execute('DELETE FROM users WHERE id = ?', [user.id])

      return {
        success: true,
        message: '회원탈퇴가 완료되었습니다',
        patternWarning: patternAnalysis.shouldBlacklist ? 
          '비정상적인 가입/탈퇴 패턴이 감지되어 일시적으로 재가입이 제한될 수 있습니다' : 
          undefined
      }
    })

    // 세션 쿠키 삭제
    const cookieStore2 = await cookies()
    cookieStore2.delete('session-token')

    // 캐시 무효화
    revalidateTag('user-info')

    return result

  } catch (error) {
    console.error('Delete account error:', error)
    
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: false,
      error: '탈퇴 처리 중 오류가 발생했습니다.'
    }
  }
}

// 사용자 패턴 분석 함수 (테이블 없어도 안전)
async function analyzeUserPattern(
  connection: any, 
  phoneHash: string, 
  emailHash: string | null, 
  ipAddress: string,
  accountAgeHours: number
): Promise<{
  shouldBlacklist: boolean
  reason: string
  evidence: any
}> {
  try {
    // 기존 탈퇴 기록 조회 (최근 30일)
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    
    const [deletionRows] = await connection.execute(
      'SELECT COUNT(*) as count FROM account_deletions WHERE phone_hash = ? AND deleted_at > ?',
      [phoneHash, oneMonthAgo.toISOString().slice(0, 19).replace('T', ' ')]
    )

    const evidence: any = {
      accountAgeHours,
      ipAddress,
      timestamp: new Date().toISOString(),
      recentDeletions: deletionRows[0].count
    }

    let suspiciousFlags = 0
    let reasons: string[] = []

    // 월 최대 탈퇴 횟수 초과
    if (deletionRows[0].count >= ABUSE_THRESHOLDS.MAX_DELETIONS_PER_MONTH) {
      suspiciousFlags++
      reasons.push('excessive_monthly_deletions')
    }

    // 빠른 탈퇴 (1시간 이내)
    if (accountAgeHours <= ABUSE_THRESHOLDS.MIN_ACCOUNT_AGE_HOURS) {
      suspiciousFlags++
      reasons.push('quick_deletion')
    }

    // IP 기반 패턴 확인
    const [ipRows] = await connection.execute(
      'SELECT COUNT(*) as count FROM account_deletions WHERE ip_address = ? AND deleted_at > ?',
      [ipAddress, oneMonthAgo.toISOString().slice(0, 19).replace('T', ' ')]
    )
    
    if (ipRows[0].count >= ABUSE_THRESHOLDS.SUSPICIOUS_IP_COUNT) {
      suspiciousFlags++
      reasons.push('suspicious_ip_activity')
    }

    evidence.suspiciousFlags = suspiciousFlags
    evidence.reasons = reasons

    return {
      shouldBlacklist: suspiciousFlags >= 2, // 2개 이상 의심 플래그 시 블랙리스트
      reason: reasons.join(','),
      evidence
    }
  } catch (error) {
    console.warn('Pattern analysis failed, proceeding with basic check:', error)
    
    // 패턴 분석 실패 시 기본적인 체크만 수행
    return {
      shouldBlacklist: accountAgeHours <= 1, // 1시간 이내 탈퇴만 체크
      reason: 'basic_quick_deletion_check',
      evidence: { accountAgeHours, fallback: true }
    }
  }
}

// 블랙리스트 추가 (테이블 없어도 안전)
async function addToBlacklist(
  connection: any,
  phoneHash: string,
  emailHash: string | null,
  ipAddress: string,
  reason: string,
  evidence: any
) {
  try {
    // user_blacklist 테이블이 있는지 확인
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'user_blacklist'"
    )

    if (tables.length > 0) {
      // 12시간 차단
      const blockedUntil = new Date(Date.now() + 12 * 60 * 60 * 1000)

      await connection.execute(
        `INSERT INTO user_blacklist (phone_hash, email_hash, ip_address, blacklist_reason, evidence_data, blocked_until)
         VALUES (?, ?, ?, 'excessive_signup_deletion', ?, ?)
         ON DUPLICATE KEY UPDATE
         blacklist_reason = 'excessive_signup_deletion',
         evidence_data = ?,
         blocked_until = ?,
         updated_at = CURRENT_TIMESTAMP()`,
        [phoneHash, emailHash, ipAddress, JSON.stringify(evidence), blockedUntil, JSON.stringify(evidence), blockedUntil]
      )
    } else {
      // 테이블이 없으면 account_deletions에 플래그만 추가
      const blockedUntil = new Date(Date.now() + 12 * 60 * 60 * 1000)
      await connection.execute(
        `UPDATE account_deletions 
         SET deletion_reason_detail = CONCAT(COALESCE(deletion_reason_detail, ''), ' [BLOCKED_UNTIL: ${blockedUntil.toISOString()}]')
         WHERE phone_hash = ? 
         ORDER BY deleted_at DESC 
         LIMIT 1`,
        [phoneHash]
      )
    }
  } catch (error) {
    console.warn('Failed to add to blacklist, continuing:', error)
    // 블랙리스트 추가 실패해도 탈퇴는 계속 진행
  }
}

// 비밀번호 해시화
function hashPassword(password: string, salt: string): string {
  return createHash('sha256').update(password + salt).digest('hex')
}

// 12시간 재가입 제한 체크 함수 (회원가입 시 사용)
export async function checkRecentDeletion(phone: string): Promise<{
  allowed: boolean
  error?: string
  remainingHours?: number
}> {
  try {
    const phoneHash = createHash('sha256').update(phone).digest('hex')
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000)

    const recentDeletion = await queryOne(
      'SELECT deleted_at FROM account_deletions WHERE phone_hash = ? AND deleted_at > ? ORDER BY deleted_at DESC LIMIT 1',
      [phoneHash, twelveHoursAgo.toISOString().slice(0, 19).replace('T', ' ')]
    )

    if (recentDeletion) {
      const deletedAt = new Date(recentDeletion.deleted_at)
      const allowedAt = new Date(deletedAt.getTime() + 12 * 60 * 60 * 1000)
      const remainingMs = allowedAt.getTime() - Date.now()
      const remainingHours = Math.ceil(remainingMs / (1000 * 60 * 60))

      return {
        allowed: false,
        error: `탈퇴 후 12시간이 지나야 재가입이 가능합니다. ${remainingHours}시간 후 다시 시도해주세요.`,
        remainingHours
      }
    }

    return { allowed: true }

  } catch (error) {
    console.error('Check recent deletion error:', error)
    // 에러 시에는 가입 허용 (보수적 접근)
    return { allowed: true }
  }
}