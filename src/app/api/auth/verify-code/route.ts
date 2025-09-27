// src/app/api/auth/verify-code/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { query, queryOne } from '@/lib/mysql/connection'

// 개발/테스트 설정
const DEV_MODE = process.env.NODE_ENV === 'development' || process.env.ENABLE_SMS_BYPASS === 'true'
const DEV_VERIFICATION_CODE = '123456' // 개발용 고정 인증번호
const ADMIN_BYPASS_CODE = '000000' // 관리자용 만능 인증번호

// 요청 스키마
const verifyCodeSchema = z.object({
  phone: z.string()
    .min(11, '전화번호를 올바르게 입력해주세요')
    .regex(/^01[0-9]{9}$/, '올바른 전화번호 형식이 아닙니다'),
  code: z.string()
    .length(6, '인증번호는 6자리입니다')
    .regex(/^\d{6}$/, '숫자만 입력해주세요')
})

// 제한 설정
const VERIFICATION_LIMITS = {
  MAX_ATTEMPTS: 5, // 최대 시도 횟수
  BLOCK_DURATION_MINUTES: 30, // 차단 시간 (분)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, code } = verifyCodeSchema.parse(body)
    
    const clientIp = getClientIp(request)
    const now = new Date()

    // 1. 기존 사용자 확인
    const existingUser = await queryOne(
      'SELECT id FROM users WHERE phone = ?',
      [phone]
    )

    if (existingUser) {
      return NextResponse.json(
        { error: '이미 가입된 전화번호입니다.' },
        { status: 409 }
      )
    }

    // 🔧 개발 모드: 특정 인증번호로 바로 통과
    if (DEV_MODE && (code === DEV_VERIFICATION_CODE || code === ADMIN_BYPASS_CODE)) {
      console.log('='.repeat(50))
      console.log('✅ [인증 성공 - 개발 모드]')
      console.log(`📞 전화번호: ${phone}`)
      console.log(`🔢 인증번호: ${code}`)
      console.log(`🔧 모드: ${code === ADMIN_BYPASS_CODE ? '관리자 바이패스' : '개발 모드'}`)
      console.log('='.repeat(50))

      // 개발 모드에서는 더미 인증 데이터 생성
      const dummyVerificationId = `dev-${Date.now()}`
      
      // 개발용 더미 인증 기록 생성 (실제 DB에 저장하지 않음)
      await saveDummyVerificationRecord(phone, code, clientIp, dummyVerificationId)

      return NextResponse.json({
        success: true,
        message: '전화번호 인증이 완료되었습니다. (개발 모드)',
        phone: phone,
        verificationId: dummyVerificationId,
        devMode: true
      })
    }

    // 🚀 실제 모드: 정상적인 인증 로직
    // 2. 인증 코드 조회 (기존 테이블 구조 사용)
    const verification = await queryOne(
      `SELECT id, code, attempt_count, expires_at, verified 
       FROM phone_verifications 
       WHERE phone = ? AND verified = 0
       ORDER BY created_at DESC 
       LIMIT 1`,
      [phone]
    )

    if (!verification) {
      return NextResponse.json(
        { 
          error: DEV_MODE 
            ? `인증번호를 먼저 요청해주세요. (개발 모드: ${DEV_VERIFICATION_CODE} 또는 ${ADMIN_BYPASS_CODE} 사용 가능)`
            : '인증번호를 먼저 요청해주세요.'
        },
        { status: 400 }
      )
    }

    // 3. 만료 시간 확인
    const expiresAt = new Date(verification.expires_at)
    if (now > expiresAt) {
      return NextResponse.json(
        { error: '인증번호가 만료되었습니다. 새로 요청해주세요.' },
        { status: 400 }
      )
    }

    // 4. 시도 횟수 확인 (개발 모드에서는 더 관대하게)
    const maxAttempts = DEV_MODE ? 10 : VERIFICATION_LIMITS.MAX_ATTEMPTS
    
    if (verification.attempt_count >= maxAttempts) {
      // 차단 시간 확인
      const blockUntil = new Date(
        new Date(verification.updated_at).getTime() + 
        VERIFICATION_LIMITS.BLOCK_DURATION_MINUTES * 60 * 1000
      )

      if (now < blockUntil) {
        const remainingMinutes = Math.ceil((blockUntil.getTime() - now.getTime()) / (1000 * 60))
        return NextResponse.json(
          { 
            error: `너무 많은 시도로 인해 차단되었습니다. ${remainingMinutes}분 후 다시 시도해주세요.`,
            blockedUntil: blockUntil.toISOString(),
            remainingMinutes
          },
          { status: 429 }
        )
      } else {
        // 차단 시간이 지났으면 시도 횟수 초기화
        await query(
          'UPDATE phone_verifications SET attempt_count = 0 WHERE id = ?',
          [verification.id]
        )
        verification.attempt_count = 0
      }
    }

    // 5. 인증 코드 확인
    if (verification.code !== code) {
      // 시도 횟수 증가
      const newAttemptCount = verification.attempt_count + 1
      await query(
        'UPDATE phone_verifications SET attempt_count = ? WHERE id = ?',
        [newAttemptCount, verification.id]
      )

      const remainingAttempts = maxAttempts - newAttemptCount

      if (remainingAttempts <= 0) {
        return NextResponse.json(
          { 
            error: `인증번호가 올바르지 않습니다. 너무 많은 시도로 인해 ${VERIFICATION_LIMITS.BLOCK_DURATION_MINUTES}분간 차단됩니다.`,
            blocked: true,
            blockDurationMinutes: VERIFICATION_LIMITS.BLOCK_DURATION_MINUTES
          },
          { status: 429 }
        )
      }

      return NextResponse.json(
        { 
          error: DEV_MODE 
            ? `인증번호가 올바르지 않습니다. (${remainingAttempts}회 남음) - 개발 모드: ${DEV_VERIFICATION_CODE} 사용 가능`
            : `인증번호가 올바르지 않습니다. (${remainingAttempts}회 남음)`,
          remainingAttempts
        },
        { status: 400 }
      )
    }

    // 6. 인증 성공 - 상태 업데이트
    await query(
      'UPDATE phone_verifications SET verified = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [verification.id]
    )

    // 7. SMS 로그 업데이트 (SMS 로그 테이블이 있는 경우만)
    if (!DEV_MODE) {
      await logSmsDelivery(phone, 'delivered')
    }

    // 8. 만료된 인증 코드들 정리 (선택사항)
    if (!DEV_MODE) {
      await cleanupExpiredVerifications()
    }

    console.log('='.repeat(50))
    console.log('✅ [인증 성공]')
    console.log(`📞 전화번호: ${phone}`)
    console.log(`🔢 인증번호: ${code}`)
    console.log(`🆔 인증 ID: ${verification.id}`)
    console.log('='.repeat(50))

    return NextResponse.json({
      success: true,
      message: '전화번호 인증이 완료되었습니다.',
      phone: phone,
      verificationId: verification.id
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Verify code error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
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

// 개발용 더미 인증 기록 생성
async function saveDummyVerificationRecord(
  phone: string, 
  code: string, 
  clientIp: string, 
  verificationId: string
): Promise<void> {
  try {
    // 실제로는 DB에 저장하지 않고 로그만 출력
    console.log(`💾 [더미 인증 기록 생성]`)
    console.log(`- Phone: ${phone}`)
    console.log(`- Code: ${code}`)
    console.log(`- IP: ${clientIp}`)
    console.log(`- ID: ${verificationId}`)
    
    // 선택사항: 개발 모드에서도 실제 DB에 기록하고 싶다면 아래 주석 해제

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5분 후
    
    await query(
      `INSERT INTO phone_verifications (phone, code, ip_address, user_agent, expires_at, verified)
       VALUES (?, ?, ?, 'DEV_MODE', ?, 1)`,
      [
        phone,
        code,
        clientIp,
        expiresAt.toISOString().slice(0, 19).replace('T', ' ')
      ]
    )

  } catch (error) {
    console.warn('더미 인증 기록 생성 실패:', error)
  }
}

// SMS 발송 결과 로그 (SMS 로그 테이블이 있는 경우만)
async function logSmsDelivery(
  phone: string, 
  status: 'delivered' | 'failed'
): Promise<void> {
  try {
    // sms_send_logs 테이블이 있는지 먼저 확인
    const tableExists = await checkTableExists('sms_send_logs')
    if (!tableExists) {
      console.log('📝 sms_send_logs 테이블이 없습니다. 로그 업데이트를 건너뜁니다.')
      return
    }

    // sms_send_logs 테이블이 있는 경우 업데이트
    await query(
      `UPDATE sms_send_logs 
       SET status = ?, delivered_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE phone = ? AND status = 'sent'
       ORDER BY created_at DESC LIMIT 1`,
      [status, phone]
    )
  } catch (error) {
    // 로그 테이블이 없거나 오류가 발생해도 인증 처리에는 영향 없음
    console.warn('SMS delivery log update failed:', error)
  }
}

// 테이블 존재 여부 확인
async function checkTableExists(tableName: string): Promise<boolean> {
  try {
    const result = await queryOne(
      `SELECT COUNT(*) as count 
       FROM information_schema.tables 
       WHERE table_schema = DATABASE() AND table_name = ?`,
      [tableName]
    )
    return result && result.count > 0
  } catch (error) {
    console.warn(`테이블 ${tableName} 존재 여부 확인 실패:`, error)
    return false
  }
}

// 만료된 인증 코드 정리
async function cleanupExpiredVerifications(): Promise<void> {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    await query(
      'DELETE FROM phone_verifications WHERE expires_at < ?',
      [oneDayAgo.toISOString().slice(0, 19).replace('T', ' ')]
    )

    // verification_limits 테이블이 있는 경우에만 정리
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

    // sms_send_logs 테이블이 있는 경우에만 정리
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
    // 정리 실패는 치명적이지 않으므로 무시
  }
}

// OPTIONS 메서드 지원 (CORS)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : process.env.APP_URL || '',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    },
  })
}