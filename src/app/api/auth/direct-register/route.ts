import { NextRequest, NextResponse } from 'next/server'
import { createHash, randomBytes } from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import { cookies } from 'next/headers'
import { query, queryOne } from '@/lib/mysql/connection'
import { directRegistrationSchema } from '@/lib/validations/registration'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('=== Registration Data ===')
    console.log('Email:', body.email)
    console.log('All data:', body)
    
    // 입력값 검증
    const validation = directRegistrationSchema.safeParse(body)
    if (!validation.success) {
      console.error('Validation errors:', validation.error.issues)
      return NextResponse.json({
        success: false,
        error: validation.error.issues[0].message
      }, { status: 400 })
    }

    const data = validation.data

    // 블랙리스트 확인
    const phoneHash = createHash('sha256').update(data.phone).digest('hex')
    const blacklistedUser = await queryOne(
      'SELECT * FROM user_blacklist WHERE phone_hash = ? AND (blocked_until IS NULL OR blocked_until > NOW())',
      [phoneHash]
    )

    if (blacklistedUser) {
      return NextResponse.json({
        success: false,
        error: '가입이 제한된 사용자입니다'
      }, { status: 403 })
    }

    // 최종 중복 확인 (동시성 문제 방지)
    const [existingUsername, existingPhone, existingEmail] = await Promise.all([
      queryOne('SELECT id FROM users WHERE username = ?', [data.username]),
      queryOne('SELECT id FROM users WHERE phone = ?', [data.phone]),
      queryOne('SELECT id FROM users WHERE email = ?', [data.email])
    ])

    if (existingUsername) {
      return NextResponse.json({
        success: false,
        error: '이미 사용 중인 사용자명입니다'
      }, { status: 409 })
    }

    if (existingPhone) {
      return NextResponse.json({
        success: false,
        error: '이미 가입된 전화번호입니다'
      }, { status: 409 })
    }

    if (existingEmail) {
      return NextResponse.json({
        success: false,
        error: '이미 사용 중인 이메일입니다'
      }, { status: 409 })
    }

    // 이메일 인증 확인
    const emailVerification = await queryOne(
      'SELECT * FROM email_verifications WHERE email = ? AND is_verified = 1 ORDER BY verified_at DESC LIMIT 1',
      [data.email]
    )

    if (!emailVerification) {
      return NextResponse.json({
        success: false,
        error: '이메일 인증이 완료되지 않았습니다'
      }, { status: 400 })
    }

    // 이메일 인증이 최근 10분 이내에 완료되었는지 확인
    const verifiedAt = new Date(emailVerification.verified_at)
    const now = new Date()
    const diffMinutes = (now.getTime() - verifiedAt.getTime()) / 60000

    if (diffMinutes > 10) {
      return NextResponse.json({
        success: false,
        error: '이메일 인증이 만료되었습니다. 다시 인증해주세요'
      }, { status: 400 })
    }

    // 비밀번호 해싱
    const salt = randomBytes(16).toString('hex')
    const passwordHash = createHash('sha256')
      .update(data.password + salt)
      .digest('hex')

    // 세션 토큰 생성
    const sessionToken = randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    // 사용자 생성
    const userId = uuidv4()

    console.log('=== Inserting User ===')
    console.log('Email to insert:', data.email)

    // NOW() 함수를 사용하여 MySQL 서버의 현재 시간으로 설정
    await query(
      `INSERT INTO users (
        id, name, username, email, password_hash, password_salt, 
        gender, birth_date, phone, company, address, address_detail, zip_code,
        role, session_token, session_expires_at, last_login_at, last_activity_at,
        created_at, updated_at, signup_method
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY), NOW(), NOW(), NOW(), NOW(), ?)`,
      [
        userId, data.name, data.username, data.email, passwordHash, salt,
        data.gender, data.birthDate, data.phone, 
        data.company || null, data.address || null, data.addressDetail || null, data.zipCode || null,
        'user', sessionToken, 'phone'
      ]
    )

    console.log('User inserted successfully')

    // 쿠키 설정
    const cookieStore = await cookies()
    cookieStore.set('session-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/'
    })

    // 사용자 정보 조회 (응답용)
    const user = await queryOne(
      `SELECT id, name, username, phone, role, email FROM users WHERE id = ?`,
      [userId]
    )

    console.log('User retrieved:', user)

    return NextResponse.json({
      success: true,
      message: '회원가입이 완료되었습니다',
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email
      }
    })

  } catch (error) {
    console.error('Direct registration error:', error)
    return NextResponse.json({
      success: false,
      error: '회원가입 중 오류가 발생했습니다'
    }, { status: 500 })
  }
}