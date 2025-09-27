'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, LogIn, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { loginAction } from '@/lib/actions/auth'
import { useAuth } from '@/contexts/AuthContext'
import { User } from '@/types/auth'
import Image from 'next/image'

// 로그인 폼 스키마
const loginSchema = z.object({
  username: z.string().min(1, '사용자명을 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
})

type LoginFormData = z.infer<typeof loginSchema>

// SNS 버튼 컴포넌트
function SocialLoginButton({ provider, onClick, isLoading }: { provider: 'naver' | 'kakao', onClick: () => void, isLoading: boolean }) {
  if (provider === "naver") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={isLoading}
        className={`
        relative w-full h-15 flex justify-center items-center py-3 px-4 rounded-lg 
        bg-[#03C75A] hover:bg-[#02B350] text-white transition-all duration-200
        ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-lg"}
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
      `}
      >
        {/* 로고: 왼쪽 고정 */}
        {!isLoading && (
          <div className="absolute left-4">
            <Image
              src="/images/common/naver-logo.png"
              alt="네이버 로고"
              width={25}
              height={25}
            />
          </div>
        )}

        {/* 중앙 컨텐츠 */}
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <span className="text-center text-xl">네이버로 시작하기</span>
        )}
      </button>
    )
  }

  if (provider === "kakao") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={isLoading}
        className={`
          w-full rounded-lg overflow-hidden 
          ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-90"}
        `}
      >
        {isLoading ? (
          <div className="flex justify-center py-3">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          <Image
            src="/images/common/kakao_login_large_wide.png"
            alt="카카오 로그인 버튼"
            width={320}
            height={48}
            className="w-full h-auto"
          />
        )}
      </button>
    )
  }

  return null
}

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  const redirectTo = searchParams.get('redirect') || '/'

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

  // 일반 로그인 폼 제출 처리 수정
  const onSubmit = async (data: LoginFormData) => {
    setError(null)

    startTransition(async () => {
      const formData = new FormData()
      formData.append('username', data.username)
      formData.append('password', data.password)

      try {
        const result = await loginAction(formData)

        if (result.error) {
          setError(result.error)
        } else if (result.success && result.user) {
          try {
            const response = await fetch('/api/auth/me', {
              method: 'GET',
              credentials: 'include',
              cache: 'no-store',
            })

            if (response.ok) {
              const { user: fullUserData } = await response.json()
              if (fullUserData) {
                login(fullUserData)
              }
            }
          } catch (error) {
            console.error('Failed to fetch full user data:', error)
            login(result.user as User)
          }

          reset()
          // SPA 방식으로 페이지 이동
          router.push(redirectTo)
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
      // OAuth URL로 리다이렉트 (이 부분은 OAuth 특성상 어쩔 수 없이 전체 페이지 이동)
      const params = new URLSearchParams({
        provider: provider,
        redirect: redirectTo
      })

      const oauthUrl = `/api/auth/oauth?${params.toString()}`

      // OAuth는 외부 서비스로 이동해야 하므로 window.location.href 사용 필요
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
        </div>

        {/* SNS 로그인 섹션 */}
        <div className="mt-8 space-y-3">
          <SocialLoginButton
            provider="naver"
            onClick={() => handleSocialLogin('naver')}
            isLoading={socialLoading === 'naver'}
          />
          <SocialLoginButton
            provider="kakao"
            onClick={() => handleSocialLogin('kakao')}
            isLoading={socialLoading === 'kakao'}
          />
        </div>

        {/* 구분선 */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">또는</span>
            </div>
          </div>
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
                    ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 text-gray-900'
                  }
                  ${isLoading || socialLoading !== null ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
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
                disabled={isLoading || socialLoading !== null}
                className={`
                  appearance-none block w-full px-3 py-2 pr-10 border rounded-lg shadow-sm 
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                  focus:border-blue-500 sm:text-sm transition-colors
                  ${errors.password
                    ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 text-gray-900'
                  }
                  ${isLoading || socialLoading !== null ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
                `}
                placeholder="비밀번호를 입력하세요"
              />
              <button
                type="button"
                disabled={isLoading || socialLoading !== null}
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
              disabled={isLoading || socialLoading !== null}
              className={`
                group relative w-full flex justify-center py-3 px-4 border border-transparent 
                text-sm font-medium rounded-lg text-white transition-all duration-200
                ${isLoading || socialLoading !== null
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
          {/* 회원가입 및 비밀번호 찾기 링크 + 안내 텍스트 */}
          <div className="flex flex-col items-center space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">비밀번호를 잊으셨나요?</span>
              <Link
                href="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                비밀번호 변경
              </Link>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-gray-500">아직 계정이 없으신가요?</span>
              <Link
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                회원가입
              </Link>
            </div>
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