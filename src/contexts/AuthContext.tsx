'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@/types/auth'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (userData: User) => void
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // 쿠키에서 세션 토큰 확인하는 함수
  const hasSessionToken = useCallback(() => {
    if (typeof document === 'undefined') return false
    return document.cookie.includes('session-token=')
  }, [])

  // NextJS 15: useCallback으로 함수 메모이제이션
  const refreshUser = useCallback(async () => {
    // 🔥 세션 토큰이 없으면 API 호출하지 않음
    if (!hasSessionToken()) {
      setUser(null)
      return
    }

    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      
      if (response.ok) {
        const { user: userData } = await response.json()
        setUser(userData)
      } else if (response.status === 401) {
        // 인증 실패 시 사용자 상태 클리어
        setUser(null)
      }
    } catch (error) {
      console.error('Auth refresh error:', error)
      setUser(null)
    }
  }, [hasSessionToken])

  // NextJS 15: 로그인 처리 개선
  const login = useCallback((userData: User) => {
    setUser(userData)
    // NextJS 15: 서버 컴포넌트 리프레시
    router.refresh()
  }, [router])

  // NextJS 15: 로그아웃 처리 개선
  const logout = useCallback(() => {
    setUser(null)
    // NextJS 15: 서버 컴포넌트 리프레시
    router.refresh()
  }, [router])

  // NextJS 15: 초기 인증 상태 확인 최적화
  useEffect(() => {
    let mounted = true

    const checkAuthStatus = async () => {
      if (!mounted) return
      
      setIsLoading(true)
      await refreshUser()
      
      if (mounted) {
        setIsLoading(false)
      }
    }

    checkAuthStatus()

    // NextJS 15: 컴포넌트 언마운트 시 정리
    return () => {
      mounted = false
    }
  }, [refreshUser])

  // 🔥 수정된 부분: 세션 토큰이 있을 때만 리프레시
  useEffect(() => {
    const handleFocus = () => {
      if (!isLoading && document.visibilityState === 'visible' && hasSessionToken()) {
        refreshUser()
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && hasSessionToken()) {
        handleFocus()
      }
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isLoading, refreshUser, hasSessionToken])

  // NextJS 15: Context value 메모이제이션
  const contextValue = {
    user,
    isLoading,
    login,
    logout,
    refreshUser
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// NextJS 15: useAuth 훅 개선
export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

// NextJS 15: 추가 훅들
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