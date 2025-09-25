// app/api/auth/oauth/route.ts
import { NextRequest, NextResponse } from 'next/server'

// OAuth 설정 타입 정의
interface OAuthConfig {
  clientId: string
  clientSecret?: string  // 선택적으로 변경
  authUrl: string
  tokenUrl: string
  userUrl: string
  scope: string
}

// OAuth 설정
const OAUTH_CONFIG: Record<'naver' | 'kakao', OAuthConfig> = {
  naver: {
    clientId: process.env.NAVER_CLIENT_ID!,
    clientSecret: process.env.NAVER_CLIENT_SECRET!,
    authUrl: 'https://nid.naver.com/oauth2.0/authorize',
    tokenUrl: 'https://nid.naver.com/oauth2.0/token',
    userUrl: 'https://openapi.naver.com/v1/nid/me',
    scope: 'profile' // 네이버는 profile 스코프에 모든 정보 포함
  },
  kakao: {
    clientId: process.env.KAKAO_CLIENT_ID!, // REST API 키
    clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    authUrl: 'https://kauth.kakao.com/oauth/authorize',
    tokenUrl: 'https://kauth.kakao.com/oauth/token',
    userUrl: 'https://kapi.kakao.com/v2/user/me',
    scope: 'profile_nickname,profile_image,account_email'
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  let provider = searchParams.get('provider') as 'naver' | 'kakao' | null
  const redirect = searchParams.get('redirect') || '/'
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  // OAuth 콜백 시에는 provider가 없으므로 state에서 추출
  if (!provider && state) {
    const stateParts = state.split(':')
    if (stateParts.length >= 2) {
      provider = stateParts[1] as 'naver' | 'kakao'
    }
  }


  if (!provider) {
    console.log('No provider specified')
    return NextResponse.redirect(new URL('/register?message=SNS%20제공자가%20지정되지%20않았습니다', request.url))
  }

  if (!['naver', 'kakao'].includes(provider)) {
    console.log('Invalid provider:', provider)
    return NextResponse.redirect(new URL(`/register?message=지원하지%20않는%20SNS%20제공자입니다:%20${provider}`, request.url))
  }

  const config = OAUTH_CONFIG[provider]

  if (!config.clientId) {
    console.log('Missing client ID for provider:', provider)
    return NextResponse.redirect(new URL('/register?message=SNS%20로그인%20설정이%20완료되지%20않았습니다', request.url))
  }

  // 네이버만 Client Secret 확인
  if (provider === 'naver' && !config.clientSecret) {
    console.log('Missing client secret for Naver')
    return NextResponse.redirect(new URL('/register?message=네이버%20로그인%20설정이%20완료되지%20않았습니다', request.url))
  }

  // OAuth 인증 시작
  if (!code) {
    return initiateOAuth(provider, config, request, redirect)
  }

  // OAuth 콜백 처리
  return handleOAuthCallback(provider, config, request, code, state, redirect)
}

// OAuth 인증 시작
function initiateOAuth(
  provider: 'naver' | 'kakao',
  config: OAuthConfig,
  request: NextRequest,
  redirect: string
) {
  const state = generateState()

  // 서버 기준으로 프로덕션 URL 사용
  const redirectUri = getRedirectUri(request)

  console.log('Initiating OAuth for provider:', provider)
  console.log('Redirect URI:', redirectUri)
  console.log('Client ID:', config.clientId?.substring(0, 8) + '...')

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    state: `${state}:${provider}:${encodeURIComponent(redirect)}`
  })

  // 카카오만 scope 추가
  if (provider === 'kakao') {
    params.append('scope', config.scope)
  }

  const authUrl = `${config.authUrl}?${params.toString()}`
  console.log('Final auth URL:', authUrl)

  return NextResponse.redirect(authUrl)
}

// OAuth 콜백 처리
async function handleOAuthCallback(
  provider: 'naver' | 'kakao',
  config: OAuthConfig,
  request: NextRequest,
  code: string,
  state: string | null,
  defaultRedirect: string
) {
  try {
    // State 파라미터 검증
    const [stateValue, stateProvider, encodedRedirect] = (state || '').split(':')
    const redirect = encodedRedirect ? decodeURIComponent(encodedRedirect) : defaultRedirect

    if (stateProvider !== provider) {
      return NextResponse.redirect(new URL('/register?message=인증%20상태가%20올바르지%20않습니다', request.url))
    }

    // 액세스 토큰 획득
    const tokenResponse = await getAccessToken(provider, config, code, request)
    if (!tokenResponse.success || !tokenResponse.accessToken) {
      return NextResponse.redirect(new URL('/register?message=SNS%20토큰%20획득에%20실패했습니다', request.url))
    }

    // 사용자 정보 획득
    const userResponse = await getUserInfo(provider, config, tokenResponse.accessToken)
    if (!userResponse.success || !userResponse.userData) {
      return NextResponse.redirect(new URL('/register?message=SNS%20사용자%20정보%20획득에%20실패했습니다', request.url))
    }

    // 디버깅: 받아온 사용자 정보 로그
    console.log(`${provider} user data:`, userResponse.userData)

    // 기존 사용자 확인
    const { queryOne } = await import('@/lib/mysql/connection')

    // 1. SNS 계정으로 이미 가입된 사용자 확인
    const existingSocialUser = await queryOne(
      'SELECT u.* FROM users u JOIN social_accounts sa ON u.id = sa.user_id WHERE sa.provider = ? AND sa.provider_id = ?',
      [provider, userResponse.userData.id]
    )

    if (existingSocialUser) {
      // 이미 가입된 사용자 - 로그인 처리
      return handleExistingUserLogin(existingSocialUser, tokenResponse.accessToken, request, redirect)
    }

    // 2. 동일한 이메일로 다른 방법으로 가입된 사용자 확인 (이메일이 있는 경우)
    if (userResponse.userData.email) {
      const existingEmailUser = await queryOne(
        'SELECT * FROM users WHERE email = ?',
        [userResponse.userData.email]
      )

      if (existingEmailUser) {
        return NextResponse.redirect(new URL(
          `/register?message=해당%20이메일로%20이미%20가입된%20계정이%20있습니다.%20기존%20방법으로%20로그인해주세요`,
          request.url
        ))
      }
    }

    // 3. 새 사용자 - 회원가입 페이지로 이동
    const userDataParam = encodeURIComponent(JSON.stringify(userResponse.userData))
    return NextResponse.redirect(new URL(
      `/register?provider=${provider}&user_data=${userDataParam}&redirect=${encodeURIComponent(redirect)}`,
      request.url
    ))

  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(new URL('/register?message=SNS%20로그인%20처리%20중%20오류가%20발생했습니다', request.url))
  }
}

// 액세스 토큰 획득
async function getAccessToken(
  provider: 'naver' | 'kakao',
  config: OAuthConfig,
  code: string,
  request: NextRequest
): Promise<{ success: boolean; accessToken?: string; refreshToken?: string }> {
  try {
    const redirectUri = getRedirectUri(request)

    console.log(`🔑 Getting ${provider} access token...`)
    console.log('Redirect URI:', redirectUri)
    console.log('Client ID:', config.clientId?.substring(0, 8) + '...')

    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: config.clientId,
      code,
      redirect_uri: redirectUri
    })

    // 네이버만 Client Secret 추가
    if (config.clientSecret) {
      tokenParams.append('client_secret', config.clientSecret)
    }

    // 카카오의 경우 Content-Type이 중요
    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    // 카카오는 Authorization 헤더 방식도 지원
    if (provider === 'kakao') {
      headers['Accept'] = 'application/json'
    }

    console.log(`📡 Sending token request to: ${config.tokenUrl}`)
    console.log('Request params:', Object.fromEntries(tokenParams.entries()))

    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers,
      body: tokenParams.toString()
    })

    console.log('Token response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Token request failed (${response.status}):`, errorText)
      throw new Error(`Token request failed: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log(`✅ ${provider} token response:`, {
      hasAccessToken: !!data.access_token,
      hasRefreshToken: !!data.refresh_token,
      tokenType: data.token_type,
      expiresIn: data.expires_in
    })

    if (!data.access_token) {
      console.error('❌ No access token in response:', data)
      throw new Error('No access token received')
    }

    return {
      success: true,
      accessToken: data.access_token,
      refreshToken: data.refresh_token
    }
  } catch (error) {
    console.error(`🚨 ${provider} get access token error:`, error)
    return { success: false }
  }
}
// 사용자 정보 획득
async function getUserInfo(
  provider: 'naver' | 'kakao',
  config: OAuthConfig,
  accessToken: string
): Promise<{ success: boolean; userData?: any }> {
  try {
    const response = await fetch(config.userUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`User info request failed: ${response.status}`)
    }

    const data = await response.json()

    // 디버깅: API 응답 전체 로그
    console.log(`${provider} API response:`, JSON.stringify(data, null, 2))

    let userData

    if (provider === 'naver') {
      const profile = data.response
      userData = {
        id: profile.id,
        email: profile.email,
        name: profile.name || profile.nickname, // 실명 우선, 없으면 별명
        profileImage: profile.profile_image,
        gender: profile.gender, // M, F, U
        birthday: profile.birthday, // MM-DD 형식
        birthyear: profile.birthyear, // YYYY 형식 - 네이버 출생연도
        mobile: profile.mobile, // 휴대폰 번호 (하이픈 포함)
        age: profile.age // 연령대 (20-29 형식)
      }
    } else if (provider === 'kakao') {
      const kakaoAccount = data.kakao_account || {}
      const profile = kakaoAccount.profile || {}

      userData = {
        id: data.id.toString(),
        email: kakaoAccount.email,
        name: profile.nickname,
        profileImage: profile.profile_image_url,
        gender: kakaoAccount.gender, // male, female
        birthday: kakaoAccount.birthday, // MMDD 형식
        birthyear: kakaoAccount.birthyear, // YYYY 형식 - 카카오 출생연도
        ageRange: kakaoAccount.age_range // 연령대 (1~9, 10~14, 15~19, 20~29, 등)
      }
    }

    // 디버깅: 매핑된 사용자 데이터 로그
    console.log(`${provider} mapped user data:`, userData)

    return {
      success: true,
      userData
    }
  } catch (error) {
    console.error('Get user info error:', error)
    return { success: false }
  }
}

// 기존 사용자 로그인 처리
async function handleExistingUserLogin(
  user: any,
  accessToken: string,
  request: NextRequest,
  redirect: string
) {
  const { query } = await import('@/lib/mysql/connection')
  const { cookies } = await import('next/headers')
  const { randomBytes } = await import('crypto')

  try {
    // 세션 토큰 생성
    const sessionToken = randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    // 사용자 정보 업데이트
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
        user.id
      ]
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

    // SNS 로그인 성공 시 특별한 플래그를 추가하여 클라이언트에서 인증 상태 새로고침
    const baseUrl = process.env.APP_URL || `http://${request.headers.get('host')}`
    const finalRedirectUrl = new URL(redirect, baseUrl)
    finalRedirectUrl.searchParams.set('auth_refresh', 'true')

    return NextResponse.redirect(finalRedirectUrl)

  } catch (error) {
    console.error('Existing user login error:', error)
    return NextResponse.redirect(new URL('/register?message=로그인%20처리%20중%20오류가%20발생했습니다', request.url))
  }
}

// State 값 생성
function generateState(): string {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
}

function getRedirectUri(request: NextRequest) {
  const baseUrl = process.env.APP_URL
  if (!baseUrl) {
    console.error('❌ NEXT_PUBLIC_APP_URL이 설정되지 않았습니다.')
    throw new Error('NEXT_PUBLIC_APP_URL 환경변수를 반드시 설정해야 합니다.')
  }
  return `${baseUrl}/api/auth/oauth`
}