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

interface PatternAnalysis {
    shouldBlacklist: boolean
    reason?: string
    evidence?: any
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
                COUNT(sa.id) as social_account_count
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
                    data.reason, data.reasonDetail, accountAgeDays, lastActivityDaysAgo,
                    0,
                    user.social_account_count > 0 ? 1 : 0
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
                patternWarning: patternAnalysis.shouldBlacklist ?
                    '비정상적인 가입/탈퇴 패턴이 감지되어 일시적으로 재가입이 제한될 수 있습니다' :
                    undefined
            }
        })

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

// 악의적 패턴 분석
async function analyzeUserPattern(
    connection: any,
    phoneHash: string,
    emailHash: string | null,
    ipAddress: string,
    accountAgeHours: number
): Promise<PatternAnalysis> {
    try {
        // 1. 기존 패턴 조회
        const [patternRows] = await connection.execute(
            'SELECT * FROM signup_deletion_patterns WHERE phone_hash = ?',
            [phoneHash]
        )

        const existingPattern = patternRows[0]

        // 2. 동일 IP에서의 최근 삭제 패턴 조회
        const [ipPatternRows] = await connection.execute(
            `SELECT COUNT(*) as deletion_count 
       FROM signup_deletion_patterns 
       WHERE ip_address = ? AND last_deletion_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)`,
            [ipAddress]
        )

        const ipDeletionCount = ipPatternRows[0]?.deletion_count || 0

        // 3. 패턴 분석
        let shouldBlacklist = false
        let reason = ''
        let evidence = {}

        if (existingPattern) {
            // 기존 사용자의 패턴 분석
            const totalDeletions = existingPattern.deletion_count + 1
            const shortestDuration = Math.min(existingPattern.shortest_account_duration_hours || accountAgeHours, accountAgeHours)

            evidence = {
                total_deletions: totalDeletions,
                shortest_duration_hours: shortestDuration,
                ip_deletion_count: ipDeletionCount,
                account_age_hours: accountAgeHours
            }

            // 블랙리스트 조건 확인
            if (totalDeletions >= ABUSE_THRESHOLDS.BLACKLIST_THRESHOLD) {
                shouldBlacklist = true
                reason = 'excessive_signup_deletion'
            } else if (accountAgeHours <= ABUSE_THRESHOLDS.MIN_ACCOUNT_AGE_HOURS && totalDeletions >= 3) {
                shouldBlacklist = true
                reason = 'automated_behavior'
            } else if (ipDeletionCount >= ABUSE_THRESHOLDS.SUSPICIOUS_IP_COUNT) {
                shouldBlacklist = true
                reason = 'abuse'
            }
        } else {
            // 새 사용자이지만 IP 패턴이 의심스러운 경우
            evidence = {
                ip_deletion_count: ipDeletionCount,
                account_age_hours: accountAgeHours
            }

            if (ipDeletionCount >= ABUSE_THRESHOLDS.SUSPICIOUS_IP_COUNT) {
                shouldBlacklist = true
                reason = 'abuse'
            }
        }

        return {
            shouldBlacklist,
            reason,
            evidence
        }

    } catch (error) {
        console.error('Pattern analysis error:', error)
        return { shouldBlacklist: false }
    }
}

// 블랙리스트 추가
async function addToBlacklist(
    connection: any,
    phoneHash: string,
    emailHash: string | null,
    ipAddress: string,
    reason?: string,
    evidence?: any
): Promise<void> {
    try {
        // 기존 블랙리스트 확인
        const [existing] = await connection.execute(
            'SELECT id FROM user_blacklist WHERE phone_hash = ?',
            [phoneHash]
        )

        if (existing.length === 0) {
            // 새로운 블랙리스트 항목 추가
            await connection.execute(
                `INSERT INTO user_blacklist (
          phone_hash, email_hash, ip_address, blacklist_reason, evidence_data, created_at
        ) VALUES (?, ?, ?, ?, ?, NOW())`,
                [phoneHash, emailHash, ipAddress, reason || 'excessive_signup_deletion', JSON.stringify(evidence)]
            )
        }
    } catch (error) {
        console.error('Blacklist addition error:', error)
    }
}

// 사용자 패턴 업데이트
async function updateUserPattern(
    connection: any,
    phoneHash: string,
    emailHash: string | null,
    ipAddress: string,
    accountDurationHours: number
): Promise<void> {
    try {
        // 기존 패턴 확인
        const [existing] = await connection.execute(
            'SELECT * FROM signup_deletion_patterns WHERE phone_hash = ?',
            [phoneHash]
        )

        if (existing.length > 0) {
            // 기존 패턴 업데이트
            const pattern = existing[0]
            const newShortestDuration = Math.min(
                pattern.shortest_account_duration_hours || accountDurationHours,
                accountDurationHours
            )

            await connection.execute(
                `UPDATE signup_deletion_patterns 
         SET deletion_count = deletion_count + 1,
             last_deletion_at = NOW(),
             shortest_account_duration_hours = ?,
             is_suspicious = CASE 
               WHEN deletion_count + 1 >= 3 OR ? <= 1 THEN 1 
               ELSE is_suspicious 
             END,
             updated_at = NOW()
         WHERE phone_hash = ?`,
                [newShortestDuration, accountDurationHours, phoneHash]
            )
        } else {
            // 새 패턴 생성
            await connection.execute(
                `INSERT INTO signup_deletion_patterns (
          phone_hash, email_hash, ip_address, signup_count, deletion_count,
          shortest_account_duration_hours, is_suspicious, last_deletion_at
        ) VALUES (?, ?, ?, 0, 1, ?, ?, NOW())`,
                [phoneHash, emailHash, ipAddress, accountDurationHours, accountDurationHours <= 1 ? 1 : 0]
            )
        }
    } catch (error) {
        console.error('Pattern update error:', error)
    }
}

// 비밀번호 해시화
function hashPassword(password: string, salt: string): string {
    return createHash('sha256').update(password + salt).digest('hex')
}