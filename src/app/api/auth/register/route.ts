import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { randomBytes } from 'crypto'
import { query, queryOne, transaction } from '@/lib/mysql/connection'
import { checkBlacklist, trackSignupPattern } from '@/utils/blacklist'
import { cookies } from 'next/headers'
import { checkRecentDeletion } from '@/utils/deletion-check'
import { getClientIp, hashPassword } from '@/lib/api/request-utils'
import { handleCorsOptions } from '@/lib/api/cors-handler'

// 회원가입 스키마 (전화번호 가입)
const phoneRegistrationSchema = z.object({
  name: z.string().min(2, '이름은 2글자 이상 입력해주세요'),
  username: z.string()
    .min(4, '사용자명은 4글자 이상 입력해주세요')
    .regex(/^[a-zA-Z0-9_]+$/, '영문, 숫자, 언더바만 사용 가능합니다'),
  password: z.string()
    .min(6, '비밀번호는 6글자 이상 입력해주세요')
    .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/, '영문과 숫자를 포함해야 합니다'),
  phone: z.string()
    .min(11, '전화번호를 올바르게 입력해주세요')
    .regex(/^01[0-9]{9}$/, '올바른 전화번호 형식이 아닙니다'),
  gender: z.enum(['male', 'female', 'none']),
  birthDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '올바른 날짜 형식이 아닙니다'),
  company: z.string().optional(),
  address: z.string().min(1, '주소를 입력해주세요'),
  addressDetail: z.string().optional(),
  zipCode: z.string().min(5, '우편번호를 입력해주세요'),
  signupMethod: z.literal('phone')
})

// 회원가입 스키마 (SNS 가입 - 간소화)
const socialRegistrationSchema = z.object({
  name: z.string().min(2, '이름은 2글자 이상 입력해주세요'),
  phone: z.string()
    .min(11, '전화번호를 올바르게 입력해주세요')
    .regex(/^01[0-9]{9}$/, '올바른 전화번호 형식이 아닙니다'),
  gender: z.enum(['male', 'female', 'none']),
  birthDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '올바른 날짜 형식이 아닙니다'),
  address: z.string().min(1, '주소를 입력해주세요'),
  addressDetail: z.string().optional(),
  zipCode: z.string().min(5, '우편번호를 입력해주세요'),
  company: z.string().optional(),
  signupMethod: z.enum(['naver', 'kakao']),
  socialId: z.string().min(1, 'SNS ID가 필요합니다'),
  email: z.string().email().optional(),
  profileImage: z.string().optional(),
  autoGenerate: z.boolean().optional() // 자동 생성 플래그
})

const registrationSchema = z.discriminatedUnion('signupMethod', [
  phoneRegistrationSchema,
  socialRegistrationSchema
])

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = registrationSchema.parse(body)
    const clientIp = getClientIp(request)

    const deletionCheck = await checkRecentDeletion(data.phone)
    if (!deletionCheck.allowed) {
      return NextResponse.json(
        {
          error: deletionCheck.error,
          blocked: true,
          remainingHours: deletionCheck.remainingHours,
          reason: 'recent_deletion'
        },
        { status: 403 }
      )
    }

    // 블랙리스트 체크 (가입 시도 전)
    const blacklistResult = await checkBlacklist(
      data.phone,
      'email' in data ? data.email : undefined,
      clientIp
    )

    if (blacklistResult.isBlocked) {
      return NextResponse.json(
        {
          error: blacklistResult.message || '가입이 제한된 사용자입니다.',
          blocked: true,
          blockedUntil: blacklistResult.blockedUntil?.toISOString(),
          reason: blacklistResult.reason
        },
        { status: 403 }
      )
    }

    // 트랜잭션으로 회원가입 처리
    const result = await transaction(async (connection) => {
      // 1. 중복 확인
      await checkDuplicates(data, connection)

      // 2. 전화번호 인증 확인 (전화번호 가입인 경우)
      if (data.signupMethod === 'phone') {
        await verifyPhoneVerification(data.phone, connection)
      }

      // 3. 사용자 생성
      const userId = await createUser(data, connection)

      // 4. SNS 계정 연결 (SNS 가입인 경우)
      if (data.signupMethod !== 'phone') {
        await createSocialAccount(userId, data as z.infer<typeof socialRegistrationSchema>, connection)
      }

      // 5. 인증 코드 정리 (전화번호 가입인 경우)
      if (data.signupMethod === 'phone') {
        await cleanupPhoneVerification(data.phone, connection)
      }

      return userId
    })


    // 회원가입 성공 후 SNS 가입인 경우 자동 로그인 처리
    let userData: any = null
    if (data.signupMethod !== 'phone') {
      userData = await handleAutoLogin(result, request)
    }

    const response = {
      success: true,
      message: '회원가입이 완료되었습니다.',
      userId: result,
      user: userData,
      autoLogin: data.signupMethod !== 'phone'
    }

    // 회원가입 성공 후 패턴 추적
    await trackSignupPattern(
      data.phone,
      'email' in data ? data.email : undefined,
      clientIp
    )

    return NextResponse.json(response, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      // 비즈니스 로직 에러
      if (error.message.includes('중복') ||
        error.message.includes('인증') ||
        error.message.includes('존재')||
        error.message.includes('탈퇴')) {
        return NextResponse.json(
          { error: error.message },
          { status: 409 }
        )
      }
    }

    console.error('Registration error:', error)
    return NextResponse.json(
      { error: '회원가입 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// SNS 회원가입 후 자동 로그인 처리
async function handleAutoLogin(userId: string, request: NextRequest) {
  try {
    // 세션 토큰 생성
    const sessionToken = randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    // 사용자 정보 업데이트 (세션 정보 저장)
    await query(
      `UPDATE users SET 
       session_token = ?, 
       session_expires_at = ?, 
       last_login_at = ?
       WHERE id = ?`,
      [
        sessionToken,
        expiresAt.toISOString().slice(0, 19).replace('T', ' '),
        new Date().toISOString().slice(0, 19).replace('T', ' '),
        userId
      ]
    )

    // 업데이트된 사용자 정보 조회
    const user = await queryOne(
      `SELECT 
         u.id, u.name, u.username, u.phone, u.email, u.role, u.signup_method,
         u.profile_image, u.gender, u.birth_date, u.company,
         u.address, u.address_detail, u.zip_code
       FROM users u 
       WHERE u.id = ?`,
      [userId]
    )

    // 쿠키 설정
    const cookieStore = await cookies()
    cookieStore.set('session-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/'
    })

    // 사용자 정보 반환 (민감한 정보 제외)
    return user ? {
      id: user.id,
      name: user.name,
      username: user.username,
      phone: user.phone,
      email: user.email,
      role: user.role,
      signup_method: user.signup_method,
      profile_image: user.profile_image,
      gender: user.gender,
      birth_date: user.birth_date,
      company: user.company,
      address: user.address,
      address_detail: user.address_detail,
      zip_code: user.zip_code
    } : null

  } catch (error) {
    console.error('Auto-login error:', error)
    // 자동 로그인 실패해도 회원가입은 성공이므로 에러를 던지지 않음
    return null
  }
}

// 중복 확인
async function checkDuplicates(
  data: z.infer<typeof registrationSchema>,
  connection: any
): Promise<void> {
  // 사용자명 중복 확인 (전화번호 가입 시에만)
  if ('username' in data && data.username) {
    const [existingUsername] = await connection.execute(
      'SELECT id FROM users WHERE username = ?',
      [data.username]
    )

    if (existingUsername.length > 0) {
      throw new Error('이미 사용 중인 사용자명입니다.')
    }
  }

  // 전화번호 중복 확인
  const [existingPhone] = await connection.execute(
    'SELECT id, signup_method FROM users WHERE phone = ?',
    [data.phone]
  )

  if (existingPhone.length > 0) {
    const existing = existingPhone[0]
    const methodNames = {
      phone: '전화번호',
      naver: '네이버',
      kakao: '카카오'
    }
    throw new Error(`이미 ${methodNames[existing.signup_method]}로 가입된 전화번호입니다.`)
  }

  // 이메일 중복 확인 (SNS 가입 시)
  if ('email' in data && data.email) {
    const [existingEmail] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [data.email]
    )

    if (existingEmail.length > 0) {
      throw new Error('이미 사용 중인 이메일 주소입니다.')
    }
  }

  // SNS 계정 중복 확인 (SNS 가입 시)
  if (data.signupMethod !== 'phone') {
    const socialData = data as z.infer<typeof socialRegistrationSchema>
    const [existingSocial] = await connection.execute(
      'SELECT user_id FROM social_accounts WHERE provider = ? AND provider_id = ?',
      [socialData.signupMethod, socialData.socialId]
    )

    if (existingSocial.length > 0) {
      const providerNames = { naver: '네이버', kakao: '카카오' }
      throw new Error(`이미 ${providerNames[socialData.signupMethod]}로 가입된 계정입니다.`)
    }
  }
}

// 전화번호 인증 확인
async function verifyPhoneVerification(phone: string, connection: any): Promise<void> {
  const [verifications] = await connection.execute(
    `SELECT id, verified FROM phone_verifications 
     WHERE phone = ? AND verified = 1 
     ORDER BY updated_at DESC 
     LIMIT 1`,
    [phone]
  )

  if (verifications.length === 0) {
    throw new Error('전화번호 인증이 완료되지 않았습니다.')
  }

  // 인증 시간 확인 (10분 이내)
  const [recentVerification] = await connection.execute(
    `SELECT id FROM phone_verifications 
     WHERE phone = ? AND verified = 1 AND updated_at > DATE_SUB(NOW(), INTERVAL 10 MINUTE)`,
    [phone]
  )

  if (recentVerification.length === 0) {
    throw new Error('인증이 만료되었습니다. 다시 인증을 진행해주세요.')
  }
}

// 사용자 생성
async function createUser(
  data: z.infer<typeof registrationSchema>,
  connection: any
): Promise<string> {
  const userId = randomBytes(16).toString('hex')
  const salt = randomBytes(16).toString('hex')

  let username: string
  let password: string

  // SNS 사용자의 경우 username과 password 자동 생성
  if (data.signupMethod !== 'phone') {
    const socialData = data as z.infer<typeof socialRegistrationSchema>

    // username: provider_socialId의 앞 8자리
    username = `${socialData.signupMethod}_${socialData.socialId.substring(0, 8)}`

    // password: 랜덤 생성 (SNS 로그인만 사용하므로 사용자가 알 필요 없음)
    password = randomBytes(16).toString('hex')
  } else {
    const phoneData = data as z.infer<typeof phoneRegistrationSchema>
    username = phoneData.username
    password = phoneData.password
  }

  const passwordHash = hashPassword(password, salt)

  const [result] = await connection.execute(
    `INSERT INTO users (
      id, name, username, company, password_hash, password_salt, 
      gender, birth_date, phone, email, profile_image, 
      address, address_detail, zip_code,
      signup_method, role, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'user', NOW(), NOW())`,
    [
      userId,
      data.name,
      username, // 자동 생성된 username 사용
      data.company || null,
      passwordHash,
      salt,
      data.gender,
      data.birthDate,
      data.phone,
      'email' in data ? data.email || null : null,
      'profileImage' in data ? data.profileImage || null : null,
      'address' in data ? data.address || null : null,
      'addressDetail' in data ? data.addressDetail || null : null,
      'zipCode' in data ? data.zipCode || null : null,
      data.signupMethod
    ]
  )

  if (result.affectedRows === 0) {
    throw new Error('사용자 생성에 실패했습니다.')
  }

  return userId
}

// SNS 계정 연결
async function createSocialAccount(
  userId: string,
  data: z.infer<typeof socialRegistrationSchema>,
  connection: any
): Promise<void> {
  const socialAccountId = randomBytes(16).toString('hex')

  const [result] = await connection.execute(
    `INSERT INTO social_accounts (
      id, user_id, provider, provider_id, provider_email, 
      provider_name, provider_profile_image, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      socialAccountId,
      userId,
      data.signupMethod,
      data.socialId,
      data.email || null,
      data.name,
      data.profileImage || null
    ]
  )

  if (result.affectedRows === 0) {
    throw new Error('SNS 계정 연결에 실패했습니다.')
  }
}

// 전화번호 인증 정보 정리
async function cleanupPhoneVerification(phone: string, connection: any): Promise<void> {
  await connection.execute(
    'DELETE FROM phone_verifications WHERE phone = ?',
    [phone]
  )
}

export async function OPTIONS() {
  return handleCorsOptions()
}