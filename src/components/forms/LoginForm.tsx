'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'

const loginSchema = z.object({
  username: z.string().min(1, '아이디를 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요')
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  redirectTo?: string
}

export default function LoginForm({ redirectTo = '/' }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [socialLoading, setSocialLoading] = useState<'naver' | null>(null)
  const { refreshUser } = useAuth()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    setError(null)

    startTransition(async () => {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })

        const result = await response.json()

        if (!response.ok) {
          setError(result.error || '로그인에 실패했습니다')
          return
        }

        // 서버에서 사용자 정보를 다시 가져옴
        await refreshUser()
        router.push(redirectTo)
        router.refresh()
      } catch (error) {
        console.error('Login error:', error)
        setError('로그인 처리 중 오류가 발생했습니다')
      }
    })
  }

  const handleSocialLogin = async (provider: 'naver') => {
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

  // Development 환경 체크
  const isDevelopment = process.env.NODE_ENV === 'development'
  console.log(isDevelopment)

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
              아이디
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
                placeholder="아이디를 입력하세요"
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
                  appearance-none block w-full px-3 py-2 border rounded-lg shadow-sm 
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                  focus:border-blue-500 sm:text-sm pr-10 transition-colors
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
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || socialLoading !== null}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  로그인 중...
                </>
              ) : (
                '로그인'
              )}
            </button>
          </div>
        </form>

        {/* Development 환경에서만 네이버 로그인 버튼 표시 */}
        {/* {isDevelopment && (
          <>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    또는 SNS 계정으로 로그인 (개발 환경)
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('naver')}
                  disabled={isLoading || socialLoading !== null}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-[#03C75A] hover:bg-[#02B350] text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {socialLoading === 'naver' ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5" />
                      네이버 로그인 중...
                    </>
                  ) : (
                    <>
                      <Image
                        src="/images/common/naver-logo.png"
                        alt="네이버"
                        width={20}
                        height={20}
                        className="bg-white rounded p-0.5"
                      />
                      네이버로 로그인
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )} */}

        <div className="mt-6">
          <div className="text-sm text-center space-y-2">
            <p className="text-gray-600">
              계정이 없으신가요?{' '}
              <Link
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}