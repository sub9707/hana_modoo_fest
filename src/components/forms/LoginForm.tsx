'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react'
import { loginAction, loginWithRedirect } from '@/lib/actions/auth'
import { useAuth } from '@/contexts/AuthContext'

// 로그인 폼 스키마
const loginSchema = z.object({
  username: z.string().min(1, '사용자명을 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  const redirectTo = searchParams.get('redirect') || '/dashboard'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const onSubmit = async (data: LoginFormData) => {
    setError(null)

    startTransition(async () => {
      const formData = new FormData()
      formData.append('username', data.username)
      formData.append('password', data.password)

      const result = await loginAction(formData)

      if (result.error) {
        setError(result.error)
      } else if (result.success && result.user) {
        // 로그인 성공 후 전체 사용자 정보 가져오기
        try {
          const response = await fetch('/api/auth/me')
          const { user: fullUserData } = await response.json()

          if (fullUserData) {
            // Context 상태 업데이트
            login(fullUserData)
          }
        } catch (error) {
          console.error('Failed to fetch full user data:', error)
        }

        reset()
        router.push(redirectTo)
      }
    })
  }

  const isLoading = isSubmitting || isPending

  return (
    <div className="sm:bg-white py-8 px-6 sm:shadow-xl shadow-none rounded-xl border border-gray-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            로그인
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            모두하나대축제 2025에 오신 것을 환영합니다
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              사용자명
            </label>
            <div className="mt-1">
              <input
                {...register('username')}
                type="text"
                autoComplete="username"
                disabled={isLoading}
                className={`
                  appearance-none block w-full px-3 py-2 border rounded-lg shadow-sm 
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                  focus:border-blue-500 sm:text-sm transition-colors
                  ${errors.username
                    ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 text-gray-900'
                  }
                  ${isLoading ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
                `}
                placeholder="사용자명을 입력하세요"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <div className="mt-1 relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                disabled={isLoading}
                className={`
                  appearance-none block w-full px-3 py-2 pr-10 border rounded-lg shadow-sm 
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                  focus:border-blue-500 sm:text-sm transition-colors
                  ${errors.password
                    ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 text-gray-900'
                  }
                  ${isLoading ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
                `}
                placeholder="비밀번호를 입력하세요"
              />
              <button
                type="button"
                disabled={isLoading}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                )}
              </button>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`
                group relative w-full flex justify-center py-3 px-4 border border-transparent 
                text-sm font-medium rounded-lg text-white transition-all duration-200
                ${isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:shadow-lg'
                }
              `}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <LogIn className="h-4 w-4 mr-2" />
              )}
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </div>

          {/* 테스트 계정 정보 (개발 환경에서만 표시) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
              <h3 className="text-sm font-medium text-gray-700 mb-2">테스트 계정</h3>
              <div className="text-xs text-gray-600 space-y-1">
                <p>관리자: admin / admin123</p>
                <p>편집자: editor / editor123</p>
                <p>사용자: user / user123</p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}