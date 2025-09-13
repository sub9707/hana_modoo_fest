'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createHash, randomBytes } from 'crypto'
import { query, queryOne } from '@/lib/mysql/connection'

// 로그인 스키마
const loginSchema = z.object({
    username: z.string().min(1, '사용자명을 입력해주세요'),
    password: z.string().min(1, '비밀번호를 입력해주세요'),
})

// 비밀번호 해시화
const hashPassword = (password: string, salt: string): string => {
    return createHash('sha256').update(password + salt).digest('hex')
}

// 세션 토큰 생성
const generateSessionToken = (): string => {
    return randomBytes(32).toString('hex')
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

        // 세션 토큰 생성 및 저장
        const sessionToken = generateSessionToken()
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 7)

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

        // NextJS 15: cookies()는 더 이상 async가 아님
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
            }
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
                `UPDATE users SET 
                 session_token = NULL, 
                 session_expires_at = NULL
                 WHERE session_token = ?`,
                [sessionToken]
            )
        }

        // 쿠키 삭제
        cookieStore.delete('session-token')

    } catch (error) {
        console.error('Logout error:', error)
    }

    redirect('/login')
}

// 사용자 정보 업데이트 (마지막 활동 시간)
export async function updateUserActivity() {
    try {
        const cookieStore = await cookies()
        const sessionToken = cookieStore.get('session-token')?.value

        if (!sessionToken) return

        await query(
            `UPDATE users SET last_activity_at = ? WHERE session_token = ?`,
            [
                new Date().toISOString().slice(0, 19).replace('T', ' '),
                sessionToken
            ]
        )

    } catch (error) {
        console.error('Update activity error:', error)
    }
}

// 세션 연장
export async function extendSession() {
    try {
        const cookieStore = await cookies()
        const sessionToken = cookieStore.get('session-token')?.value

        if (!sessionToken) return false

        const newExpiresAt = new Date()
        newExpiresAt.setDate(newExpiresAt.getDate() + 7)

        const result = await query(
            `UPDATE users SET session_expires_at = ? WHERE session_token = ?`,
            [
                newExpiresAt.toISOString().slice(0, 19).replace('T', ' '),
                sessionToken
            ]
        )

        if (!result || result.affectedRows === 0) return false

        // 쿠키 갱신
        cookieStore.set('session-token', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: newExpiresAt,
            path: '/'
        })

        return true

    } catch (error) {
        console.error('Extend session error:', error)
        return false
    }
}

export async function loginWithRedirect(formData: FormData, redirectTo: string = '/dashboard') {
    const result = await loginAction(formData)

    if (result.success) {
        redirect(redirectTo)
    }

    return result
}