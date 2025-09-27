'use client'

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { User } from '@/types/auth'
import { 
  hasSessionToken, 
  getAuthCache, 
  setAuthCache, 
  clearAuthCache, 
  tokenObserver, 
  notifyLogout 
} from '@/lib/utils/auth-client'

interface AuthContextType {
  user: User | null
  isLoading: boolean
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
  const [authCheckCooldown, setAuthCheckCooldown] = useState<number>(0)
  const router = useRouter()

  // 사용자 정보 가져오기 (auth-client 유틸리티 사용)
  const fetchUser = useCallback(async (forceRefresh = false): Promise<User | null> => {
    // 강제 새로고침이 아니면 캐시 먼저 확인
    if (!forceRefresh) {
      const cached = getAuthCache()
      if (cached && cached.isAuthenticated) {
        return cached.user
      }
    }

    // 세션 토큰이 없으면 요청하지 않음
    if (!hasSessionToken()) {
      clearAuthCache()
      return null
    }

    // 쿨다운 체크 (강제 새로고침이 아닌 경우)
    if (!forceRefresh && authCheckCooldown > Date.now()) {
      return user
    }

    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store'
      })

      if (response.ok) {
        const userData = await response.json()
        const userInfo = userData.user
        
        // 성공 시 캐시에 저장하고 5분 쿨다운
        setAuthCache(userInfo)
        setAuthCheckCooldown(Date.now() + (5 * 60 * 1000))
        
        return userInfo
      } else if (response.status === 401) {
        // 401 에러 시 캐시 클리어하고 30분 쿨다운
        clearAuthCache()
        setAuthCheckCooldown(Date.now() + (30 * 60 * 1000))
        return null
      } else {
        // 기타 에러 시 1분 쿨다운
        clearAuthCache()
        setAuthCheckCooldown(Date.now() + (60 * 1000))
        return null
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
      clearAuthCache()
      setAuthCheckCooldown(Date.now() + (60 * 1000))
      return null
    }
  }, [authCheckCooldown, user])

  // 초기 사용자 정보 로드
  useEffect(() => {
    let mounted = true

    const loadUser = async () => {
      setIsLoading(true)
      try {
        // 캐시에서 먼저 확인
        const cached = getAuthCache()
        if (cached && cached.isAuthenticated && hasSessionToken()) {
          if (mounted) {
            setUser(cached.user)
            setIsLoading(false)
          }
          return
        }

        // 세션 토큰이 없으면 즉시 로딩 완료
        if (!hasSessionToken()) {
          clearAuthCache()
          if (mounted) {
            setUser(null)
            setIsLoading(false)
          }
          return
        }

        // 서버에서 사용자 정보 가져오기
        const userData = await fetchUser(true)
        if (mounted) {
          setUser(userData)
        }
      } catch (error) {
        console.error('Error loading user:', error)
        if (mounted) {
          setUser(null)
          clearAuthCache()
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

  // 토큰 변화 감지 (tokenObserver 사용)
  useEffect(() => {
    const unsubscribe = tokenObserver.subscribe(() => {
      const hasToken = hasSessionToken()
      
      if (!hasToken && user) {
        // 토큰이 없는데 사용자가 있으면 로그아웃 처리
        setUser(null)
        setAuthCheckCooldown(0)
        clearAuthCache()
      } else if (hasToken && !user && !isLoading) {
        // 토큰이 있는데 사용자가 없으면 사용자 정보 가져오기
        refreshUser()
      }
    })
    
    return unsubscribe
  }, [user, isLoading])

  // 사용자 정보 새로고침
  const refreshUser = useCallback(async () => {
    try {
      setAuthCheckCooldown(0) // 수동 새로고침 시 쿨다운 무시
      const userData = await fetchUser(true)
      setUser(userData)
    } catch (error) {
      console.error('Error refreshing user:', error)
      setUser(null)
      clearAuthCache()
    }
  }, [fetchUser])

  // 로그인 (캐시에 저장)
  const login = useCallback((userData: User) => {
    setUser(userData)
    setAuthCheckCooldown(0)
    setAuthCache(userData)
  }, [])

  // 로그아웃 (캐시 클리어 및 다른 탭에 알림)
  const logout = useCallback(async () => {
    try {
      setUser(null)
      setAuthCheckCooldown(0)
      clearAuthCache()
      notifyLogout() // 다른 탭에 로그아웃 알림
      
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
    login,
    logout,
    refreshUser
  }), [user, isLoading, login, logout, refreshUser])

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