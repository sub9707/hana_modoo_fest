import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createHash, randomBytes } from 'crypto'
import { query, queryOne } from '@/lib/mysql/connection'

// 요청 스키마
const changePasswordSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  verificationCode: z.string().length(6, '인증번호는 6자리입니다'),
  newPassword: z.string()
    .min(8, '비밀번호는 8자 이상이어야 합니다')
    .max(128, '비밀번호는 128자를 초과할 수 없습니다')
    .regex(/[a-zA-Z]/, '영문을 포함해야 합니다')
    .regex(/\d/, '숫자를 포함해야 합니다')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, '특수문자를 포함해야 합니다'),
  confirmPassword: z.string()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = changePasswordSchema.parse(body)
    
    const { email, verificationCode, newPassword, confirmPassword } = validatedData
    
    // 비밀번호 확인
    if (newPassword !== confirmPassword) {
      return NextResponse.json({
        success: false,
        error: '비밀번호가 일치하지 않습니다'
      }, { status: 400 })
    }
    
    const clientIp = getClientIp(request)
    const now = new Date()

    // 1. 이메일로 사용자 찾기
    const user = await queryOne(
      'SELECT id, name, username, phone, signup_method, email FROM users WHERE email = ?',
      [email]
    )

    if (!user) {
      return NextResponse.json({
        success: false,
        error: '해당 이메일로 가입된 계정이 없습니다'
      }, { status: 404 })
    }

    // 2. 전화번호 가입 계정인지 확인
    if (user.signup_method !== 'phone') {
      const methodNames: Record<string, string> = {
        naver: '네이버',
        kakao: '카카오'
      }
      const providerName = methodNames[user.signup_method] || 'SNS'
      
      return NextResponse.json({
        success: false,
        error: `${providerName}로 가입한 계정입니다. ${providerName} 로그인을 이용해주세요`,
        socialAccount: true,
        provider: user.signup_method
      }, { status: 400 })
    }

    // 3. 이메일 인증 확인 (is_verified = 0이고 만료되지 않은 것만)
    const verification = await queryOne(
      `SELECT id, code, is_verified, expires_at, created_at 
       FROM email_verifications 
       WHERE email = ? AND is_verified = 0 AND expires_at > NOW()
       ORDER BY created_at DESC 
       LIMIT 1`,
      [email]
    )

    if (!verification) {
      return NextResponse.json({
        success: false,
        error: '인증 정보를 찾을 수 없습니다. 인증번호를 다시 요청해주세요'
      }, { status: 404 })
    }

    // 4. 인증번호 확인
    if (verification.code !== verificationCode) {
      return NextResponse.json({
        success: false,
        error: '인증번호가 올바르지 않습니다'
      }, { status: 400 })
    }

    // 5. 인증번호 만료 확인 (5분)
    const expiresAt = new Date(verification.expires_at)
    if (now > expiresAt) {
      return NextResponse.json({
        success: false,
        error: '인증번호가 만료되었습니다. 인증번호를 다시 요청해주세요'
      }, { status: 400 })
    }

    // 6. 새 비밀번호 해시 생성
    const newSalt = randomBytes(16).toString('hex')
    const newPasswordHash = hashPassword(newPassword, newSalt)

    // 7. 사용자 비밀번호 업데이트
    const updateResult = await query(
      `UPDATE users 
       SET password_hash = ?, 
           password_salt = ?, 
           updated_at = CURRENT_TIMESTAMP,
           last_activity_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [newPasswordHash, newSalt, user.id]
    )

    if (updateResult.affectedRows === 0) {
      return NextResponse.json({
        success: false,
        error: '비밀번호 업데이트에 실패했습니다'
      }, { status: 500 })
    }

    // 8. 인증 완료 처리 (비밀번호 변경이 성공했을 때만)
    await query(
      `UPDATE email_verifications 
       SET is_verified = 1, verified_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [verification.id]
    )

    // 9. 보안 로그 기록
    await logPasswordChange(user.id, user.username, user.email, clientIp)

    return NextResponse.json({
      success: true,
      message: '비밀번호가 성공적으로 변경되었습니다',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: error.issues[0].message
      }, { status: 400 })
    }

    console.error('Change password with email error:', error)
    return NextResponse.json({
      success: false,
      error: '서버 오류가 발생했습니다'
    }, { status: 500 })
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

// 비밀번호 변경 로그 기록
async function logPasswordChange(
  userId: string,
  username: string,
  email: string,
  clientIp: string
): Promise<void> {
  try {
    const tableExists = await checkTableExists('admin_actions')
    if (!tableExists) {
      return
    }

    await query(
      `INSERT INTO admin_actions 
       (admin_id, action_type, target_user_hash, reason, metadata, created_at)
       VALUES (?, 'password_change', ?, ?, ?, NOW())`,
      [
        userId,
        createHash('sha256').update(userId).digest('hex'),
        `이메일 인증을 통한 비밀번호 변경 (이메일: ${email})`,
        JSON.stringify({
          action: 'password_change',
          method: 'email_verification',
          ip_address: clientIp,
          username: username,
          email: email,
          timestamp: new Date().toISOString()
        })
      ]
    )

  } catch (error) {
    console.warn('비밀번호 변경 로그 기록 실패:', error)
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