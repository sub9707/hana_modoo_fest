// src/lib/actions/auth.ts
'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createHash, randomBytes } from 'crypto'
import { query, queryOne } from '@/lib/mysql/connection'
import { loginSchema } from '@/lib/validations/auth'

// 비밀번호 해시화
const hashPassword = (password: string, salt: string): string => {
    return createHash('sha256').update(password + salt).digest('hex')
}

// 세션 토큰 생성
const generateSessionToken = (): string => {
    return randomBytes(32).toString('hex')
}

// Server Action에서 IP 추출
const getClientIpFromHeaders = async (): Promise<string> => {
    const headersList = await headers()

    // x-forwarded-for 헤더 확인
    const forwarded = headersList.get('x-forwarded-for')
    if (forwarded) {
        return forwarded.split(',')[0].trim()
    }

    // x-real-ip 헤더 확인
    const realIp = headersList.get('x-real-ip')
    if (realIp) {
        return realIp.trim()
    }

    // x-client-ip 헤더 확인
    const clientIp = headersList.get('x-client-ip')
    if (clientIp) {
        return clientIp.trim()
    }

    // CF-Connecting-IP (Cloudflare)
    const cfIp = headersList.get('cf-connecting-ip')
    if (cfIp) {
        return cfIp.trim()
    }

    return '127.0.0.1'
}

// 로그인 액션
export async function loginAction(formData: FormData) {
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    // 입력값 검증
    const result = loginSchema.safeParse({ username, password })

    if (!result.success) {
        return {
            error: result.error.issues[0].message
        }
    }

    try {

        // 클라이언트 IP 추출
        const clientIp = await getClientIpFromHeaders()

        // 사용자 조회
        const user = await queryOne(
            'SELECT * FROM users WHERE username = ?',
            [username]
        )

        if (!user) {
            return {
                error: '사용자명 또는 비밀번호가 올바르지 않습니다.'
            }
        }

        // 비밀번호 확인
        const hashedPassword = hashPassword(password, user.password_salt)

        if (hashedPassword !== user.password_hash) {
            return {
                error: '사용자명 또는 비밀번호가 올바르지 않습니다.'
            }
        }

        // 기존 세션 확인 (다른 기기 로그인 감지)
        const existingSession = await queryOne(
            'SELECT session_token, last_login_at FROM users WHERE id = ? AND session_token IS NOT NULL',
            [user.id]
        )

        // 세션 토큰 생성 및 저장 (IP 추가)
        const sessionToken = generateSessionToken()
        await query(
            `UPDATE users SET 
             session_token = ?, 
             session_expires_at = DATE_ADD(NOW(), INTERVAL 7 DAY), 
             last_login_at = NOW(),
             last_login_ip = ?
             WHERE id = ?`,
            [
                sessionToken,
                clientIp,
                user.id
            ]
        )

        // 세션 쿠키 저장
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 7)

        const cookieStore = await cookies()
        cookieStore.set('session-token', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: expiresAt,
            path: '/'
        })

        return {
            success: true,
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                role: user.role
            },
            warning: existingSession ?
                '다른 기기에서 로그인한 세션이 자동으로 로그아웃됩니다.' :
                null
        }

    } catch (error) {
        console.error('Login error:', error)
        return {
            error: '로그인 처리 중 오류가 발생했습니다.'
        }
    }
}

// 로그아웃 액션
export async function logoutAction() {
    try {
        const cookieStore = await cookies()
        const sessionToken = cookieStore.get('session-token')?.value

        if (sessionToken) {
            // 데이터베이스에서 세션 토큰 제거
            await query(
                'UPDATE users SET session_token = NULL, session_expires_at = NULL WHERE session_token = ?',
                [sessionToken]
            )
        }

        // 쿠키 삭제
        cookieStore.set('session-token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: new Date(0),
            maxAge: 0,
            path: '/'
        })

        return { success: true }

    } catch (error) {
        console.error('Logout error:', error)
        return {
            error: '로그아웃 처리 중 오류가 발생했습니다.'
        }
    }
}

// 현재 사용자 정보 조회
export async function getCurrentUserAction() {
    try {
        const cookieStore = await cookies()
        const sessionToken = cookieStore.get('session-token')?.value

        if (!sessionToken) {
            return { error: '로그인이 필요합니다.' }
        }

        const user = await queryOne(
            `SELECT id, name, username, company, gender, birth_date, phone, 
                    email, profile_image, role, signup_method,
                    created_at, last_login_at, last_activity_at, updated_at, session_expires_at
             FROM users 
             WHERE session_token = ?`,
            [sessionToken]
        )

        if (!user) {
            console.warn(' Invalid session token - clearing cookie')
            return { error: '세션이 무효화되었습니다. 다시 로그인해주세요.' }
        }

        // 세션 만료 확인
        if (user.session_expires_at && new Date(user.session_expires_at) < new Date()) {
            // 만료된 세션 정리
            await query(
                'UPDATE users SET session_token = NULL, session_expires_at = NULL WHERE id = ?',
                [user.id]
            )

            return { error: '세션이 만료되었습니다. 다시 로그인해주세요.' }
        }

        // 민감한 정보 제거하고 완전한 사용자 정보 반환
        const { session_expires_at, ...safeUser } = user

        return {
            success: true,
            user: {
                ...safeUser,
                company: user.company || undefined,
                email: user.email || undefined,
                profile_image: user.profile_image || undefined,
                signup_method: user.signup_method || 'phone', // 기본값 설정
                last_login_at: user.last_login_at || undefined,
                last_activity_at: user.last_activity_at || undefined
            }
        }

    } catch (error) {
        console.error('Get current user error:', error)
        return {
            error: '사용자 정보를 불러오는 중 오류가 발생했습니다.'
        }
    }
}