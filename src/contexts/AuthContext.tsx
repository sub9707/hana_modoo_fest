'use client'

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { User } from '@/types/auth'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (user: User) => void
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // 사용자 정보 가져오기
  const fetchUser = useCallback(async (): Promise<User | null> => {
    try {
      setError(null)
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
        signal: AbortSignal.timeout(10000)
      })

      if (response.ok) {
        const userData = await response.json()
        return userData.user
      } else if (response.status === 401) {
        // 무효 세션 감지 - 클라이언트 상태 즉시 초기화
        console.warn('유효하지않은 세션입니다. - 유저 상태 초기화')
        return null
      } else {
        console.error('유저 정보 fetch 에러:', response.status)
        setError('사용자 정보를 불러올 수 없습니다.')
        return null
      }

    } catch (error: any) {
      console.error('[AuthContext] Failed to fetch user:', error)

      if (error.name === 'TimeoutError') {
        setError('요청 시간이 초과되었습니다.')
      } else if (error.name === 'AbortError') {
        setError('요청이 취소되었습니다.')
      } else {
        setError('네트워크 오류가 발생했습니다.')
      }

      return null
    }
  }, [])

  // 초기 사용자 정보 로드
  useEffect(() => {
    let mounted = true
    let retryCount = 0
    const maxRetries = 2

    const loadUser = async () => {
      setIsLoading(true)
      try {
        const userData = await fetchUser()
        if (mounted) {
          setUser(userData)
        }
      } catch (error) {
        console.error('Error loading user:', error)

        // ⚠️ 재시도 로직 (최대 2회)
        if (mounted && retryCount < maxRetries) {
          retryCount++
          console.warn(`재시도중... (${retryCount}/${maxRetries})`)
          setTimeout(() => loadUser(), 1000 * retryCount)
          return
        }

        if (mounted) {
          setUser(null)
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadUser()

    return () => {
      mounted = false
    }
  }, [fetchUser])

  // 사용자 정보 새로고침
  const refreshUser = useCallback(async () => {
    try {
      const userData = await fetchUser()
      setUser(userData)
    } catch (error) {
      console.error('유저정보 새로고침 중 에러:', error)
      setUser(null)
    }
  }, [fetchUser])

  // 로그인
  const login = useCallback((userData: User) => {
    setUser(userData)
    setError(null)
  }, [])

  // 로그아웃
  const logout = useCallback(async () => {
    try {
      setUser(null)
      setError(null)
      // 서버에 로그아웃 요청
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      router.push('/')
    }
  }, [router])

  // Context value 메모이제이션
  const contextValue = useMemo(() => ({
    user,
    isLoading,
    error,
    login,
    logout,
    refreshUser
  }), [user, isLoading, error, login, logout, refreshUser])

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

export function useRequireAuth() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  return { user, isLoading }
}

export function useRequireRole(requiredRole: 'admin' | 'editor' | 'user') {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const roleHierarchy = {
    'user': 1,
    'editor': 2,
    'admin': 3
  }

  useEffect(() => {
    if (!isLoading && user) {
      if (roleHierarchy[user.role] < roleHierarchy[requiredRole]) {
        router.push('/unauthorized')
      }
    } else if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, requiredRole, router])

  return { user, isLoading, hasPermission: user ? roleHierarchy[user.role] >= roleHierarchy[requiredRole] : false }
}

// SNS 로그인 후 인증 상태 새로고침
export function useAuthRefresh() {
  const { refreshUser } = useAuth()
  const searchParams = useSearchParams()

  useEffect(() => {
    const shouldRefresh = searchParams.get('auth_refresh')

    if (shouldRefresh === 'true') {
      // 파라미터 제거
      const url = new URL(window.location.href)
      url.searchParams.delete('auth_refresh')
      window.history.replaceState({}, '', url.pathname + url.search)

      // 잠시 후 인증 상태 새로고침
      setTimeout(() => {
        refreshUser()
      }, 100)
    }
  }, [searchParams, refreshUser])
}