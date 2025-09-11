'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
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

  // 사용자 정보 새로고침
  const refreshUser = async () => {
    try {
      const response = await fetch('/api/auth/me')
      const { user: userData } = await response.json()
      setUser(userData)
    } catch (error) {
      console.error('Auth refresh error:', error)
      setUser(null)
    }
  }

  // 로그인 처리
  const login = (userData: User) => {
    setUser(userData)
  }

  // 로그아웃 처리
  const logout = () => {
    setUser(null)
  }

  // 초기 인증 상태 확인
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true)
      await refreshUser()
      setIsLoading(false)
    }

    checkAuthStatus()
  }, [])

  const value = {
    user,
    isLoading,
    login,
    logout,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// useAuth 훅
export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}