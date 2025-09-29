'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { loginSchema, type LoginData } from '@/lib/validations/auth'
import Image from 'next/image'
import { loginAction } from '@/lib/actions/auth'
import Link from 'next/link'

interface LoginFormProps {
  redirectTo?: string
}

export default function LoginForm({ redirectTo = '/' }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  const onSubmit = async (data: LoginData) => {
    setError(null)

    startTransition(async () => {
      const formData = new FormData()
      formData.append('username', data.username)
      formData.append('password', data.password)

      try {
        const result = await loginAction(formData)

        if (result.error) {
          setError(result.error)
        } else if (result.success) {
          reset()
          
          router.refresh()
          await new Promise(resolve => setTimeout(resolve, 150))
          window.location.href = redirectTo
        }
      } catch (error) {
        console.error('Login error:', error)
        setError('로그인 처리 중 오류가 발생했습니다.')
      }
    })
  }

  const handleSocialLogin = async (provider: 'naver' | 'kakao') => {
    setSocialLoading(provider)
    setError(null)

    try {
      const params = new URLSearchParams({
        provider: provider,
        redirect: redirectTo
      })

      const oauthUrl = `/api/auth/oauth?${params.toString()}`
      window.location.href = oauthUrl
    } catch (error) {
      console.error('Social login error:', error)
      setError('SNS 로그인 처리 중 오류가 발생했습니다.')
      setSocialLoading(null)
    }
  }

  const isLoading = isSubmitting || isPending

  return (
    <div className="sm:bg-white py-8 px-6 sm:shadow-xl shadow-none rounded-xl border border-gray-100 font-paper">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            로그인
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            모두하나대축제 2025에 오신 것을 환영합니다
          </p>
          {redirectTo !== '/' && (
            <p className="mt-1 text-xs text-blue-600">
              로그인 후 요청한 페이지로 이동합니다
            </p>
          )}
        </div>

        <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                disabled={isLoading || socialLoading !== null}
                className={`
                  appearance-none block w-full px-3 py-2 border rounded-lg shadow-sm 
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                  focus:border-blue-500 sm:text-sm transition-colors
                  ${errors.username
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300'}
                  ${isLoading || socialLoading !== null ? 'bg-gray-50 cursor-not-allowed' : ''}
                `}
                placeholder="사용자명을 입력하세요"
              />
              {errors.username && (
                <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>
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
                disabled={isLoading || socialLoading !== null}
                className={`
                  appearance-none block w-full px-3 py-2 pr-10 border rounded-lg shadow-sm 
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                  focus:border-blue-500 sm:text-sm transition-colors
                  ${errors.password
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300'}
                  ${isLoading || socialLoading !== null ? 'bg-gray-50 cursor-not-allowed' : ''}
                `}
                placeholder="비밀번호를 입력하세요"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading || socialLoading !== null}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || socialLoading !== null}
              className={`
                group relative w-full flex justify-center py-3 px-4 border border-transparent 
                text-sm font-medium rounded-lg text-white transition-colors
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                ${isLoading || socialLoading !== null
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-800 hover:bg-gray-700'
                }
              `}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                '로그인'
              )}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
            >
              비밀번호를 잊으셨나요?
            </Link>
          </div>

          <div className="text-center border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600">
              아직 계정이 없으신가요?{' '}
              <Link
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                회원가입
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}