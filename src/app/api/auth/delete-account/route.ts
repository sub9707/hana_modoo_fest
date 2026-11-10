import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { createHash } from 'crypto'
import { query, queryOne, transaction } from '@/lib/mysql/connection'

// 탈퇴 요청 스키마
const deleteAccountSchema = z.object({
  password: z.string().min(1, '현재 비밀번호를 입력해주세요'),
  reason: z.enum(['privacy_concern', 'service_dissatisfaction', 'no_longer_needed', 'duplicate_account', 'other']).optional(),
  reasonDetail: z.string().max(500, '사유는 500자 이내로 입력해주세요').optional(),
  confirmDelete: z.boolean().refine(val => val === true, '탈퇴 확인이 필요합니다')
})

// 악의적 패턴 감지 기준
const ABUSE_THRESHOLDS = {
  MAX_DELETIONS_PER_MONTH: 3,        // 월 최대 탈퇴 횟수
  MIN_ACCOUNT_AGE_HOURS: 1,          // 최소 계정 유지 시간
  MAX_QUICK_DELETIONS: 5,            // 빠른 탈퇴 최대 횟수
  SUSPICIOUS_IP_COUNT: 10,           // 동일 IP에서 의심스러운 삭제 횟수
  BLACKLIST_THRESHOLD: 5             // 블랙리스트 등록 기준 삭제 횟수
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password, reason, reasonDetail, confirmDelete } = deleteAccountSchema.parse(body)

    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session-token')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { error: '인증이 필요합니다' },
        { status: 401 }
      )
    }

    const clientIp = getClientIp(request)

    // 트랜잭션으로 탈퇴 처리
    const result = await transaction(async (connection) => {
      // 1. 현재 사용자 정보 조회
      const [rows] = await connection.execute(
        `SELECT u.*, COUNT(sa.id) as social_account_count
         FROM users u 
         LEFT JOIN social_accounts sa ON u.id = sa.user_id
         WHERE u.session_token = ?
         GROUP BY u.id`,
        [sessionToken]
      )

      const userRows = rows as import('mysql2').RowDataPacket[];
      if (userRows.length === 0) {
        throw new Error('사용자를 찾을 수 없습니다')
      }

      const user = userRows[0]

      // 2. 비밀번호 확인
      const hashedPassword = hashPassword(password, user.password_salt)
      if (hashedPassword !== user.password_hash) {
        throw new Error('현재 비밀번호가 올바르지 않습니다')
      }

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

      // 8. 패턴 데이터 업데이트
      await updateUserPattern(connection, phoneHash, emailHash, clientIp, accountAgeHours)

      // 9. 탈퇴 기록 저장 (통계 목적)
      await connection.execute(
        `INSERT INTO account_deletions (
          user_id_hash, phone_hash, email_hash, ip_address, signup_method,
          deletion_reason, deletion_reason_detail, account_age_days, 
          last_activity_days_ago, total_logins, had_social_accounts
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userIdHash, phoneHash, emailHash, clientIp, user.signup_method,
          reason, reasonDetail, accountAgeDays, lastActivityDaysAgo,
          user.login_count || 0, user.social_account_count > 0 ? 1 : 0
        ]
      )

      // 10. SNS 계정 연결 해제
      await connection.execute('DELETE FROM social_accounts WHERE user_id = ?', [user.id])

      // 11. 인증 관련 정보 삭제
      await connection.execute('DELETE FROM phone_verifications WHERE phone = ?', [user.phone])

      // 12. 사용자 계정 완전 삭제
      await connection.execute('DELETE FROM users WHERE id = ?', [user.id])

      return {
        success: true,
        message: '회원탈퇴가 완료되었습니다',
        patternWarning: patternAnalysis.shouldBlacklist ? '비정상적인 가입/탈퇴 패턴이 감지되어 일시적으로 재가입이 제한될 수 있습니다' : null
      }
    })

    // 세션 쿠키 삭제
    const cookieStore2 = await cookies()
    cookieStore2.delete('session-token')
    cookieStore2.delete('last-activity')

    return NextResponse.json(result)

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    console.error('Delete account error:', error)
    return NextResponse.json(
      { error: '탈퇴 처리 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}

// 사용자 패턴 분석 함수
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
  // 기존 패턴 조회
  const [patternRows] = await connection.execute(
    'SELECT * FROM signup_deletion_patterns WHERE phone_hash = ?',
    [phoneHash]
  )

  const pattern = patternRows[0]
  const evidence: any = {
    accountAgeHours,
    ipAddress,
    timestamp: new Date().toISOString()
  }

  // 신규 사용자
  if (!pattern) {
    // 1시간 이내 탈퇴는 의심스러움
    if (accountAgeHours <= ABUSE_THRESHOLDS.MIN_ACCOUNT_AGE_HOURS) {
      evidence.quickDeletion = true
      return {
        shouldBlacklist: false, // 첫 번째는 경고만
        reason: 'quick_deletion_first_time',
        evidence
      }
    }
    return { shouldBlacklist: false, reason: 'normal', evidence }
  }

  // 기존 사용자 패턴 분석
  evidence.existingPattern = {
    signupCount: pattern.signup_count,
    deletionCount: pattern.deletion_count,
    shortestDurationHours: pattern.shortest_account_duration_hours
  }

  let suspiciousFlags = 0
  let reasons: string[] = []

  // 월 최대 탈퇴 횟수 초과
  const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  if (pattern.last_deletion_at && new Date(pattern.last_deletion_at) > oneMonthAgo) {
    const monthlyDeletions = pattern.deletion_count
    if (monthlyDeletions >= ABUSE_THRESHOLDS.MAX_DELETIONS_PER_MONTH) {
      suspiciousFlags++
      reasons.push('excessive_monthly_deletions')
    }
  }

  // 빠른 탈퇴 반복
  if (accountAgeHours <= ABUSE_THRESHOLDS.MIN_ACCOUNT_AGE_HOURS) {
    const quickDeletions = pattern.shortest_account_duration_hours <= ABUSE_THRESHOLDS.MIN_ACCOUNT_AGE_HOURS ? 1 : 0
    if (quickDeletions >= ABUSE_THRESHOLDS.MAX_QUICK_DELETIONS) {
      suspiciousFlags++
      reasons.push('repeated_quick_deletions')
    }
  }

  // 총 탈퇴 횟수 기준
  if (pattern.deletion_count >= ABUSE_THRESHOLDS.BLACKLIST_THRESHOLD) {
    suspiciousFlags++
    reasons.push('excessive_total_deletions')
  }

  // IP 기반 패턴 확인
  const [ipRows] = await connection.execute(
    'SELECT COUNT(*) as count FROM account_deletions WHERE ip_address = ? AND deleted_at > ?',
    [ipAddress, oneMonthAgo]
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
}

// 사용자 패턴 업데이트
async function updateUserPattern(
  connection: any,
  phoneHash: string,
  emailHash: string | null,
  ipAddress: string,
  accountAgeHours: number
) {
  await connection.execute(
    `INSERT INTO signup_deletion_patterns 
     (phone_hash, email_hash, ip_address, deletion_count, last_deletion_at, shortest_account_duration_hours)
     VALUES (?, ?, ?, 1, NOW(), ?)
     ON DUPLICATE KEY UPDATE
     deletion_count = deletion_count + 1,
     last_deletion_at = NOW(),
     shortest_account_duration_hours = LEAST(COALESCE(shortest_account_duration_hours, ?), ?),
     is_suspicious = CASE 
       WHEN deletion_count >= 3 OR ? <= 1 THEN 1 
       ELSE is_suspicious 
     END`,
    [phoneHash, emailHash, ipAddress, accountAgeHours, accountAgeHours, accountAgeHours, accountAgeHours]
  )
}

// 블랙리스트 추가
async function addToBlacklist(
  connection: any,
  phoneHash: string,
  emailHash: string | null,
  ipAddress: string,
  reason: string,
  evidence: any
) {
  // 임시 차단 (30일)
  const blockedUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

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
}

// 비밀번호 해시화
function hashPassword(password: string, salt: string): string {
  return createHash('sha256').update(password + salt).digest('hex')
}

// 클라이언트 IP 추출
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const clientIp = request.headers.get('x-client-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIp) {
    return realIp.trim()
  }
  if (clientIp) {
    return clientIp.trim()
  }
  
  return '127.0.0.1'
}