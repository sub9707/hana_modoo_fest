'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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

  // NextJS 15: useCallback으로 함수 메모이제이션
  const refreshUser = useCallback(async () => {
    
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
        setUser(null)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('🚨 Auth refresh error:', error)
      setUser(null)
    }
  }, [])

  const login = useCallback((userData: User) => {
    setUser(userData)
  }, [])

  // NextJS 15: 로그아웃 처리 개선
  const logout = useCallback(() => {
    setUser(null)
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

    return () => {
      mounted = false
    }
  }, [refreshUser])

  // 포커스 이벤트에서 리프레시 (쿠키 체크 제거)
  useEffect(() => {
    const handleFocus = () => {
      if (!isLoading && document.visibilityState === 'visible') {
        refreshUser()
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleFocus()
      }
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isLoading, refreshUser])

  // Context value 메모이제이션
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