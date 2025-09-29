'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Phone, MessageSquare, Loader2, Check, Clock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import Link from 'next/link'

// 전화번호 스키마
const phoneSchema = z.object({
  phone: z.string()
    .min(11, '전화번호를 올바르게 입력해주세요')
    .regex(/^01[0-9]-?[0-9]{4}-?[0-9]{4}$/, '올바른 전화번호 형식이 아닙니다')
    .transform(val => val.replace(/-/g, ''))
})

// 인증번호 스키마
const verificationSchema = z.object({
  code: z.string()
    .length(6, '인증번호는 6자리입니다')
    .regex(/^\d{6}$/, '숫자만 입력해주세요')
})

// 새 비밀번호 스키마
const newPasswordSchema = z.object({
  password: z.string()
    .min(6, '비밀번호는 6글자 이상 입력해주세요')
    .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/, '영문과 숫자를 포함해야 합니다'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword']
})

type PhoneFormData = z.infer<typeof phoneSchema>
type VerificationFormData = z.infer<typeof verificationSchema>
type NewPasswordFormData = z.infer<typeof newPasswordSchema>

export default function ForgotPasswordForm() {
  const [step, setStep] = useState<'phone' | 'verification' | 'newpassword' | 'complete'>('phone')
  const [phone, setPhone] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [canResend, setCanResend] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [verificationToken, setVerificationToken] = useState('')
  const router = useRouter()

  // 타이머 효과
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && step === 'verification') {
      setCanResend(true)
    }
  }, [timeLeft, step])

  // 전화번호 폼
  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema)
  })

  // 인증번호 폼
  const verificationForm = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema)
  })

  // 새 비밀번호 폼
  const newPasswordForm = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema)
  })

  // 전화번호 확인 및 인증번호 발송
  const handlePhoneSubmit = async (data: PhoneFormData) => {
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: data.phone })
      })

      const result = await response.json()

      if (response.ok) {
        setPhone(data.phone)
        setTimeLeft(300) // 5분
        setCanResend(false)
        setStep('verification')
        setSuccess('인증번호가 발송되었습니다')
      } else {
        setError(result.error || '인증번호 발송에 실패했습니다')
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      setError('네트워크 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  // 인증번호 확인
  const handleVerificationSubmit = async (data: VerificationFormData) => {
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/verify-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone, 
          code: data.code 
        })
      })

      const result = await response.json()

      if (response.ok) {
        setVerificationToken(result.token)
        setStep('newpassword')
        setSuccess('인증이 완료되었습니다. 새 비밀번호를 설정해주세요')
      } else {
        setError(result.error || '인증번호가 올바르지 않습니다')
      }
    } catch (error) {
      console.error('Verify reset code error:', error)
      setError('네트워크 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  // 새 비밀번호 설정
  const handleNewPasswordSubmit = async (data: NewPasswordFormData) => {
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          password: data.password,
          token: verificationToken
        })
      })

      const result = await response.json()

      if (response.ok) {
        setStep('complete')
        setSuccess('비밀번호가 성공적으로 변경되었습니다')
      } else {
        setError(result.error || '비밀번호 변경에 실패했습니다')
      }
    } catch (error) {
      console.error('Reset password error:', error)
      setError('네트워크 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  // 인증번호 재발송
  const handleResendCode = async () => {
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })

      const result = await response.json()

      if (response.ok) {
        setTimeLeft(300)
        setCanResend(false)
        setSuccess('인증번호가 재발송되었습니다')
      } else {
        setError(result.error || '인증번호 재발송에 실패했습니다')
      }
    } catch (error) {
      console.error('Resend reset code error:', error)
      setError('네트워크 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* 헤더 */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Link 
                href="/login"
                className="mr-3 p-1 rounded-md hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  비밀번호 찾기
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {step === 'phone' && '가입한 전화번호를 입력해주세요'}
                  {step === 'verification' && '인증번호를 입력해주세요'}
                  {step === 'newpassword' && '새 비밀번호를 설정해주세요'}
                  {step === 'complete' && '비밀번호 변경이 완료되었습니다'}
                </p>
              </div>
            </div>

            {/* 진행 단계 표시 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                  ${step === 'phone' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-green-600 text-white'
                  }
                `}>
                  {step === 'phone' ? '1' : <Check className="h-4 w-4" />}
                </div>
                <span className="ml-2 text-sm text-gray-600">전화번호</span>
              </div>
              <div className="flex-1 mx-4 h-px bg-gray-300"></div>
              <div className="flex items-center">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                  ${step === 'phone' || step === 'verification'
                    ? step === 'verification' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                    : 'bg-green-600 text-white'
                  }
                `}>
                  {step === 'newpassword' || step === 'complete' ? <Check className="h-4 w-4" /> : '2'}
                </div>
                <span className="ml-2 text-sm text-gray-600">인증</span>
              </div>
              <div className="flex-1 mx-4 h-px bg-gray-300"></div>
              <div className="flex items-center">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                  ${step === 'newpassword' || step === 'complete'
                    ? step === 'complete' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                  }
                `}>
                  {step === 'complete' ? <Check className="h-4 w-4" /> : '3'}
                </div>
                <span className="ml-2 text-sm text-gray-600">완료</span>
              </div>
            </div>
          </div>

          {/* 메시지 */}
          {error && (
            <div className="mb-4 flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-4 flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
              <Check className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-green-700 text-sm">{success}</span>
            </div>
          )}

          {/* Step 1: 전화번호 입력 */}
          {step === 'phone' && (
            <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-800 text-sm font-medium mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>안내사항</span>
                </div>
                <div className="text-blue-700 text-sm space-y-1">
                  <p>• 전화번호로 가입한 계정만 비밀번호 찾기가 가능합니다</p>
                  <p>• SNS(네이버, 카카오)로 가입한 계정은 해당 서비스에서 비밀번호를 관리해주세요</p>
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  가입한 전화번호
                </label>
                <div className="mt-1 relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    {...phoneForm.register('phone')}
                    type="tel"
                    placeholder="010-0000-0000"
                    disabled={isLoading}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value)
                      e.target.value = formatted
                      phoneForm.setValue('phone', formatted)
                    }}
                    className={`
                      appearance-none block w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm 
                      placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                      focus:border-blue-500 sm:text-sm transition-colors
                      ${phoneForm.formState.errors.phone
                        ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 text-gray-900'
                      }
                      ${isLoading ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
                    `}
                  />
                </div>
                {phoneForm.formState.errors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {phoneForm.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`
                  w-full flex justify-center py-3 px-4 border border-transparent 
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
                  <MessageSquare className="h-4 w-4 mr-2" />
                )}
                {isLoading ? '확인 중...' : '인증번호 발송'}
              </button>
            </form>
          )}

          {/* Step 2: 인증번호 입력 */}
          {step === 'verification' && (
            <form onSubmit={verificationForm.handleSubmit(handleVerificationSubmit)} className="space-y-6">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">{formatPhone(phone)}</span>로<br />
                  인증번호를 발송했습니다
                </p>
              </div>

              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  인증번호 6자리
                </label>
                <div className="mt-1">
                  <input
                    {...verificationForm.register('code')}
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    disabled={isLoading}
                    className={`
                      appearance-none block w-full px-3 py-2 border rounded-lg shadow-sm text-center text-lg font-mono
                      placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                      focus:border-blue-500 sm:text-sm transition-colors
                      ${verificationForm.formState.errors.code
                        ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 text-gray-900'
                      }
                      ${isLoading ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
                    `}
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/\D/g, '')
                    }}
                  />
                </div>
                {verificationForm.formState.errors.code && (
                  <p className="mt-1 text-sm text-red-600">
                    {verificationForm.formState.errors.code.message}
                  </p>
                )}
              </div>

              {/* 타이머 및 재발송 */}
              <div className="text-center">
                {timeLeft > 0 ? (
                  <p className="text-sm text-gray-600">
                    <Clock className="inline h-4 w-4 mr-1" />
                    남은 시간: <span className="font-mono text-blue-600">{formatTime(timeLeft)}</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isLoading || !canResend}
                    className="text-sm text-blue-600 hover:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    인증번호 재발송
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`
                  w-full flex justify-center py-3 px-4 border border-transparent 
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
                  <Check className="h-4 w-4 mr-2" />
                )}
                {isLoading ? '확인 중...' : '인증번호 확인'}
              </button>
            </form>
          )}

          {/* Step 3: 새 비밀번호 설정 */}
          {step === 'newpassword' && (
            <form onSubmit={newPasswordForm.handleSubmit(handleNewPasswordSubmit)} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  새 비밀번호
                </label>
                <div className="mt-1 relative">
                  <input
                    {...newPasswordForm.register('password')}
                    type={showPassword ? 'text' : 'password'}
                    disabled={isLoading}
                    placeholder="영문+숫자 6글자 이상"
                    className={`
                      appearance-none block w-full px-3 py-2 pr-10 border rounded-lg shadow-sm 
                      placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                      focus:border-blue-500 sm:text-sm transition-colors
                      ${newPasswordForm.formState.errors.password
                        ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 text-gray-900'
                      }
                      ${isLoading ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
                    `}
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
                </div>
                {newPasswordForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {newPasswordForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  새 비밀번호 확인
                </label>
                <div className="mt-1 relative">
                  <input
                    {...newPasswordForm.register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    disabled={isLoading}
                    placeholder="비밀번호를 다시 입력해주세요"
                    className={`
                      appearance-none block w-full px-3 py-2 pr-10 border rounded-lg shadow-sm 
                      placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                      focus:border-blue-500 sm:text-sm transition-colors
                      ${newPasswordForm.formState.errors.confirmPassword
                        ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 text-gray-900'
                      }
                      ${isLoading ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
                    `}
                  />
                  <button
                    type="button"
                    disabled={isLoading}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {newPasswordForm.formState.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {newPasswordForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`
                  w-full flex justify-center py-3 px-4 border border-transparent 
                  text-sm font-medium rounded-lg text-white transition-all duration-200
                  ${isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 hover:shadow-lg'
                  }
                `}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Check className="h-4 w-4 mr-2" />
                )}
                {isLoading ? '변경 중...' : '비밀번호 변경'}
              </button>
            </form>
          )}

          {/* Step 4: 완료 */}
          {step === 'complete' && (
            <div className="text-center space-y-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">비밀번호 변경 완료</h3>
                <p className="mt-2 text-sm text-gray-600">
                  새로운 비밀번호로 로그인하실 수 있습니다.
                </p>
              </div>
              <button
                onClick={() => router.push('/login')}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:shadow-lg transition-all duration-200"
              >
                로그인 페이지로 이동
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}