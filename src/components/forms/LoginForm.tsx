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
import Alert from '@/components/ui/Alert'

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

  const handleTestLogin = async () => {
    setError(null)

    startTransition(async () => {
      const formData = new FormData()
      formData.append('username', 'test_admin')
      formData.append('password', 'Test1234!')

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
        console.error('Test login error:', error)
        setError('테스트 계정 로그인 중 오류가 발생했습니다.')
      }
    })
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
            <Alert type="error" message={error} />
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

          {/* 소셜 로그인 섹션 (네이버 검수 완료 후 활성화) */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('naver')}
                disabled={isLoading || socialLoading !== null}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium bg-[#03C75A] hover:bg-[#02B350] text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {socialLoading === 'naver' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Image src="/images/common/naver-logo.png" alt="Naver" width={20} height={20} />
                    <span>네이버로 로그인</span>
                  </>
                )}
              </button>
            </div>
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

          {/* 테스트 계정 로그인 */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleTestLogin}
              disabled={isLoading || socialLoading !== null}
              className={`
                w-full flex items-center justify-center gap-2 px-4 py-2.5
                border-2 border-dashed border-gray-300 rounded-lg
                text-sm font-medium text-gray-600
                transition-all
                ${isLoading || socialLoading !== null
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:border-gray-400 hover:bg-gray-50 hover:text-gray-800'
                }
              `}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>테스트 계정으로 로그인</span>
                </>
              )}
            </button>
            <p className="mt-2 text-xs text-center text-gray-500">
              프로젝트 리뷰를 위한 데모 계정으로 로그인합니다
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}