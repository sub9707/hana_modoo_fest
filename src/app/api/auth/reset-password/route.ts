// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createHash, randomBytes } from 'crypto'
import { query, queryOne } from '@/lib/mysql/connection'

// 개발/테스트 설정
const DEV_MODE = process.env.NODE_ENV === 'development' || process.env.ENABLE_SMS_BYPASS === 'true'

// 요청 스키마
const resetPasswordSchema = z.object({
  phone: z.string()
    .min(11, '전화번호를 올바르게 입력해주세요')
    .regex(/^01[0-9]{9}$/, '올바른 전화번호 형식이 아닙니다'),
  password: z.string()
    .min(6, '비밀번호는 6글자 이상 입력해주세요')
    .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/, '영문과 숫자를 포함해야 합니다'),
  token: z.string().min(1, '인증 토큰이 필요합니다')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phone, password, token } = resetPasswordSchema.parse(body)
    
    const clientIp = getClientIp(request)
    const now = new Date()

    // 1. 사용자 존재 및 가입 방법 확인
    const user = await queryOne(
      'SELECT id, name, signup_method, password_salt FROM users WHERE phone = ?',
      [phone]
    )

    if (!user) {
      return NextResponse.json(
        { error: '해당 전화번호로 가입된 계정이 없습니다.' },
        { status: 404 }
      )
    }

    // 2. 전화번호 가입 계정인지 확인
    if (user.signup_method !== 'phone') {
      const methodNames = {
        naver: '네이버',
        kakao: '카카오'
      }
      const providerName = methodNames[user.signup_method] || 'SNS'
      
      return NextResponse.json(
        { 
          error: `${providerName}로 가입한 계정입니다. ${providerName} 로그인을 이용해주세요.`,
          socialAccount: true,
          provider: user.signup_method
        },
        { status: 400 }
      )
    }

    // 3. 테스트 모드에서는 토큰 검증 완화
    const isTestMode = process.env.NODE_ENV === 'development' || process.env.ENABLE_SMS_BYPASS === 'true'
    
    if (!isTestMode) {
      // 실제 운영 모드: 엄격한 인증 토큰 확인
      const verification = await queryOne(
        `SELECT id, verified, expires_at FROM phone_verifications 
         WHERE phone = ? AND verified = 1 
         ORDER BY updated_at DESC 
         LIMIT 1`,
        [phone]
      )

      if (!verification) {
        return NextResponse.json(
          { error: '인증이 완료되지 않았습니다. 다시 인증을 진행해주세요.' },
          { status: 400 }
        )
      }

      // 인증 만료 시간 확인 (10분 이내)
      const expiresAt = new Date(verification.expires_at)
      const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000)
      
      if (expiresAt < tenMinutesAgo) {
        return NextResponse.json(
          { error: '인증이 만료되었습니다. 다시 인증을 진행해주세요.' },
          { status: 400 }
        )
      }
    } else {
      console.log('🔧 [테스트 모드] 비밀번호 재설정 토큰 검증 건너뛰기')
      
      // 테스트 모드에서도 최소한의 검증 (인증 기록이 있는지만 확인)
      const hasVerification = await queryOne(
        `SELECT id FROM phone_verifications 
         WHERE phone = ? 
         ORDER BY created_at DESC 
         LIMIT 1`,
        [phone]
      )

      if (!hasVerification) {
        return NextResponse.json(
          { error: '인증 기록을 찾을 수 없습니다. 비밀번호 찾기를 다시 진행해주세요.' },
          { status: 400 }
        )
      }
    }

    // 4. 새 비밀번호 해시 생성
    const newSalt = randomBytes(16).toString('hex')
    const newPasswordHash = hashPassword(password, newSalt)

    // 5. 사용자 비밀번호 업데이트
    const updateResult = await query(
      `UPDATE users 
       SET password_hash = ?, 
           password_salt = ?, 
           updated_at = CURRENT_TIMESTAMP,
           session_token = NULL,
           session_expires_at = NULL
       WHERE id = ?`,
      [newPasswordHash, newSalt, user.id]
    )

    if (updateResult.affectedRows === 0) {
      return NextResponse.json(
        { error: '비밀번호 업데이트에 실패했습니다.' },
        { status: 500 }
      )
    }

    // 6. 인증 기록 정리 (사용된 인증번호 삭제)
    await query(
      'DELETE FROM phone_verifications WHERE phone = ?',
      [phone]
    )

    // 7. 보안 로그 기록 (선택사항)
    await logPasswordReset(user.id, user.name, phone, clientIp)

    console.log('='.repeat(50))
    console.log('✅ [비밀번호 재설정 완료]')
    console.log(`📞 전화번호: ${phone}`)
    console.log(`👤 사용자: ${user.name} (ID: ${user.id})`)
    console.log(`🔑 새 비밀번호 해시: ${newPasswordHash.substring(0, 16)}...`)
    console.log(`🧂 새 솔트: ${newSalt.substring(0, 16)}...`)
    console.log(`🖥️ IP: ${clientIp}`)
    console.log('='.repeat(50))

    return NextResponse.json({
      success: true,
      message: '비밀번호가 성공적으로 변경되었습니다.',
      user: {
        id: user.id,
        name: user.name,
        phone: phone
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    console.error('Reset password error:', error)
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

// 비밀번호 해시화
function hashPassword(password: string, salt: string): string {
  return createHash('sha256').update(password + salt).digest('hex')
}

// 비밀번호 재설정 로그 기록
async function logPasswordReset(
  userId: string,
  userName: string,
  phone: string,
  clientIp: string
): Promise<void> {
  try {
    // admin_actions 테이블이 있는지 확인
    const tableExists = await checkTableExists('admin_actions')
    if (!tableExists) {
      console.log('📝 admin_actions 테이블이 없습니다. 비밀번호 재설정 로그 기록을 건너뜁니다.')
      return
    }

    // 비밀번호 재설정 로그 기록
    await query(
      `INSERT INTO admin_actions 
       (admin_id, action_type, target_user_hash, reason, metadata, created_at)
       VALUES (?, 'password_reset', ?, ?, ?, NOW())`,
      [
        userId, // 사용자 자신이 재설정한 경우
        createHash('sha256').update(userId).digest('hex'),
        `비밀번호 찾기를 통한 재설정 (전화번호: ${phone.substring(0, 3)}****${phone.substring(phone.length - 4)})`,
        JSON.stringify({
          action: 'password_reset',
          method: 'phone_verification',
          ip_address: clientIp,
          user_name: userName,
          phone_masked: `${phone.substring(0, 3)}****${phone.substring(phone.length - 4)}`,
          timestamp: new Date().toISOString()
        })
      ]
    )

    console.log(`📝 비밀번호 재설정 로그가 기록되었습니다: ${userName} (${phone})`)
  } catch (error) {
    console.warn('비밀번호 재설정 로그 기록 실패:', error)
    // 로그 기록 실패는 치명적이지 않으므로 무시
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