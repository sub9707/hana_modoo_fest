import { NextRequest } from 'next/server'
import { z } from 'zod'
import { query, queryOne } from '@/lib/mysql/connection'
import {
  getClientIp,
  errorResponse,
  successResponse,
  handleValidationError,
  handleCorsOptions
} from '@/lib/api'
import { checkTableExists } from '@/lib/api/database-utils'

const DEV_MODE = process.env.NODE_ENV === 'development' || process.env.ENABLE_SMS_BYPASS === 'true'
const DEV_VERIFICATION_CODE = '123456'
const ADMIN_BYPASS_CODE = '000000'

const verifyCodeSchema = z.object({
  phone: z.string()
    .min(11, '전화번호를 올바르게 입력해주세요')
    .regex(/^01[0-9]{9}$/, '올바른 전화번호 형식이 아닙니다'),
  code: z.string()
    .length(6, '인증번호는 6자리입니다')
    .regex(/^\d{6}$/, '숫자만 입력해주세요')
})

const VERIFICATION_LIMITS = {
  MAX_ATTEMPTS: 5,
  BLOCK_DURATION_MINUTES: 30,
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    try {
      verifyCodeSchema.parse(body)
    } catch (error) {
      const validationError = handleValidationError(error)
      if (validationError) return validationError
    }

    const { phone, code } = body
    const clientIp = getClientIp(request)
    const now = new Date()

    const existingUser = await queryOne('SELECT id FROM users WHERE phone = ?', [phone])
    if (existingUser) {
      return errorResponse('이미 가입된 전화번호입니다.', 409)
    }

    if (DEV_MODE && (code === DEV_VERIFICATION_CODE || code === ADMIN_BYPASS_CODE)) {
      console.log(`[DEV] 인증 성공 - ${phone}, 코드: ${code}`)

      const dummyVerificationId = `dev-${Date.now()}`
      await saveDummyVerificationRecord(phone, code, clientIp, dummyVerificationId)

      return successResponse({
        phone,
        verificationId: dummyVerificationId,
        devMode: true
      }, '전화번호 인증이 완료되었습니다. (개발 모드)')
    }

    const verification = await queryOne(
      `SELECT id, code, attempt_count, expires_at, verified
       FROM phone_verifications
       WHERE phone = ? AND verified = 0
       ORDER BY created_at DESC
       LIMIT 1`,
      [phone]
    )

    if (!verification) {
      return errorResponse(
        DEV_MODE
          ? `인증번호를 먼저 요청해주세요. (개발 모드: ${DEV_VERIFICATION_CODE} 또는 ${ADMIN_BYPASS_CODE} 사용 가능)`
          : '인증번호를 먼저 요청해주세요.',
        400
      )
    }

    const expiresAt = new Date(verification.expires_at)
    if (now > expiresAt) {
      return errorResponse('인증번호가 만료되었습니다. 새로 요청해주세요.', 400)
    }

    const maxAttempts = DEV_MODE ? 10 : VERIFICATION_LIMITS.MAX_ATTEMPTS

    if (verification.attempt_count >= maxAttempts) {
      const blockUntil = new Date(
        new Date(verification.updated_at).getTime() +
        VERIFICATION_LIMITS.BLOCK_DURATION_MINUTES * 60 * 1000
      )

      if (now < blockUntil) {
        const remainingMinutes = Math.ceil((blockUntil.getTime() - now.getTime()) / (1000 * 60))
        return errorResponse(
          `너무 많은 시도로 인해 차단되었습니다. ${remainingMinutes}분 후 다시 시도해주세요.`,
          429
        )
      } else {
        await query('UPDATE phone_verifications SET attempt_count = 0 WHERE id = ?', [verification.id])
        verification.attempt_count = 0
      }
    }

    if (verification.code !== code) {
      const newAttemptCount = verification.attempt_count + 1
      await query('UPDATE phone_verifications SET attempt_count = ? WHERE id = ?', [newAttemptCount, verification.id])

      const remainingAttempts = maxAttempts - newAttemptCount

      if (remainingAttempts <= 0) {
        return errorResponse(
          `인증번호가 올바르지 않습니다. 너무 많은 시도로 인해 ${VERIFICATION_LIMITS.BLOCK_DURATION_MINUTES}분간 차단됩니다.`,
          429
        )
      }

      return errorResponse(
        DEV_MODE
          ? `인증번호가 올바르지 않습니다. (${remainingAttempts}회 남음) - 개발 모드: ${DEV_VERIFICATION_CODE} 사용 가능`
          : `인증번호가 올바르지 않습니다. (${remainingAttempts}회 남음)`,
        400
      )
    }

    await query(
      'UPDATE phone_verifications SET verified = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [verification.id]
    )

    if (!DEV_MODE) {
      await logSmsDelivery(phone, 'delivered')
      await cleanupExpiredVerifications()
    }

    return successResponse({
      phone,
      verificationId: verification.id
    }, '전화번호 인증이 완료되었습니다.')

  } catch (error) {
    const validationError = handleValidationError(error)
    if (validationError) return validationError

    console.error('Verify code error:', error)
    return errorResponse('서버 오류가 발생했습니다.', 500)
  }
}

async function saveDummyVerificationRecord(
  phone: string,
  code: string,
  clientIp: string,
  verificationId: string
): Promise<void> {
  try {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

    await query(
      `INSERT INTO phone_verifications (phone, code, ip_address, user_agent, expires_at, verified)
       VALUES (?, ?, ?, 'DEV_MODE', ?, 1)`,
      [phone, code, clientIp, expiresAt.toISOString().slice(0, 19).replace('T', ' ')]
    )
  } catch (error) {
    console.warn('더미 인증 기록 생성 실패:', error)
  }
}

async function logSmsDelivery(phone: string, status: 'delivered' | 'failed'): Promise<void> {
  try {
    const tableExists = await checkTableExists('sms_send_logs')
    if (!tableExists) return

    await query(
      `UPDATE sms_send_logs
       SET status = ?, delivered_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE phone = ? AND status = 'sent'
       ORDER BY created_at DESC LIMIT 1`,
      [status, phone]
    )
  } catch (error) {
    console.warn('SMS delivery log update failed:', error)
  }
}

async function cleanupExpiredVerifications(): Promise<void> {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    await query(
      'DELETE FROM phone_verifications WHERE expires_at < ?',
      [oneDayAgo.toISOString().slice(0, 19).replace('T', ' ')]
    )

    const limitsTableExists = await checkTableExists('verification_limits')
    if (limitsTableExists) {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

      await query(
        `DELETE FROM verification_limits
         WHERE (blocked_until IS NULL OR blocked_until < ?)
         AND last_attempt_at < ?`,
        [
          new Date().toISOString().slice(0, 19).replace('T', ' '),
          oneWeekAgo.toISOString().slice(0, 19).replace('T', ' ')
        ]
      )
    }

    const logsTableExists = await checkTableExists('sms_send_logs')
    if (logsTableExists) {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

      await query(
        `DELETE FROM sms_send_logs
         WHERE created_at < ? AND status IN ('delivered', 'undelivered', 'failed')`,
        [thirtyDaysAgo.toISOString().slice(0, 19).replace('T', ' ')]
      )
    }
  } catch (error) {
    console.error('Cleanup error:', error)
  }
}

export const OPTIONS = handleCorsOptions
