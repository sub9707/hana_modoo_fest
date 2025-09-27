'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Phone, MessageSquare, Loader2, Check, Clock, Search } from 'lucide-react'

interface PhoneRegistrationProps {
  onComplete: () => void
  onBack: () => void
}

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

// 사용자 정보 스키마 (주소 필드 추가)
const userInfoSchema = z.object({
  name: z.string().min(2, '이름은 2글자 이상 입력해주세요'),
  username: z.string()
    .min(4, '사용자명은 4글자 이상 입력해주세요')
    .regex(/^[a-zA-Z0-9_]+$/, '영문, 숫자, 언더바만 사용 가능합니다'),
  password: z.string()
    .min(6, '비밀번호는 6글자 이상 입력해주세요')
    .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/, '영문과 숫자를 포함해야 합니다'),
  confirmPassword: z.string(),
  gender: z.enum(['male', 'female', 'none'], { message: '성별을 선택해주세요' }),
  birthDate: z.string()
    .min(1, '생년월일을 입력해주세요')
    .regex(/^\d{4}-\d{2}-\d{2}$/, '올바른 날짜 형식이 아닙니다'),
  company: z.string().optional(),
  // 주소 필드 추가
  address: z.string().min(1, '주소를 입력해주세요'),
  addressDetail: z.string().optional(),
  zipCode: z.string().min(5, '우편번호를 입력해주세요')
}).refine(data => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['confirmPassword']
})

type PhoneFormData = z.infer<typeof phoneSchema>
type VerificationFormData = z.infer<typeof verificationSchema>
type UserInfoFormData = z.infer<typeof userInfoSchema>

export default function PhoneRegistration({ onComplete, onBack }: PhoneRegistrationProps) {
  const [step, setStep] = useState<'phone' | 'verification' | 'userinfo'>('phone')
  const [phone, setPhone] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [canResend, setCanResend] = useState(false)
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false)

  // 카카오 우편번호 API 스크립트 로드
  useEffect(() => {
    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY

    if (!kakaoKey) {
      console.warn('NEXT_PUBLIC_KAKAO_JS_KEY 환경변수가 설정되지 않았습니다.')
      return
    }

    if (window.daum?.Postcode) {
      setIsKakaoLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    script.async = true
    script.onload = () => {
      setIsKakaoLoaded(true)
    }
    script.onerror = () => {
      console.error('카카오 우편번호 API 로드에 실패했습니다.')
    }

    document.head.appendChild(script)

    return () => {
      const existingScript = document.querySelector('script[src*="postcode.v2.js"]')
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [])

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

  // 사용자 정보 폼
  const userInfoForm = useForm<UserInfoFormData>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      address: '',
      addressDetail: '',
      zipCode: ''
    }
  })

  // 주소 검색 함수
  const handleSearchAddress = () => {
    if (!window.daum?.Postcode) {
      alert('우편번호 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
      return
    }

    new window.daum.Postcode({
      oncomplete: function (data) {
        userInfoForm.setValue('zipCode', data.zonecode)
        userInfoForm.setValue('address', data.roadAddress || data.jibunAddress)

        // 상세주소 입력 필드로 포커스 이동
        setTimeout(() => {
          const addressDetailInput = document.querySelector('input[name="addressDetail"]') as HTMLInputElement
          if (addressDetailInput) {
            addressDetailInput.focus()
          }
        }, 100)

        userInfoForm.trigger(['zipCode', 'address'])
      },
      width: 100,
      height: 400
    }).open()
  }

  // 전화번호 인증 요청
  const handlePhoneSubmit = async (data: PhoneFormData) => {
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: data.phone })
      })

      const result = await response.json()

      if (response.ok) {
        setPhone(data.phone)
        setTimeLeft(180)
        setCanResend(false)
        setStep('verification')
        setSuccess('인증번호가 발송되었습니다')
      } else {
        setError(result.error || '인증번호 발송에 실패했습니다')
      }
    } catch (error) {
      console.error('Send verification error:', error)
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
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          code: data.code
        })
      })

      const result = await response.json()

      if (response.ok) {
        setStep('userinfo')
        setSuccess('전화번호 인증이 완료되었습니다')
      } else {
        setError(result.error || '인증번호가 올바르지 않습니다')
      }
    } catch (error) {
      console.error('Verify code error:', error)
      setError('네트워크 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  // 회원가입 완료
  const handleUserInfoSubmit = async (data: UserInfoFormData) => {
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          phone,
          signupMethod: 'phone'
        })
      })

      const result = await response.json()

      if (response.ok) {
        onComplete()
      } else {
        // 12시간 재가입 제한 에러 특별 처리
        if (result.blocked && result.reason === 'recent_deletion') {
          setError(
            `회원탈퇴 후 12시간이 지나야 재가입이 가능합니다. ` +
            `${result.remainingHours}시간 후 다시 시도해주세요.`
          )
        } else if (result.blocked) {
          // 기타 블랙리스트 에러
          setError(
            result.error +
            (result.blockedUntil ?
              ` (해제 예정: ${new Date(result.blockedUntil).toLocaleDateString()})` : '')
          )
        } else {
          // 일반 에러
          setError(result.error || '회원가입에 실패했습니다')
        }
      }
    } catch (error) {
      console.error('Registration error:', error)
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
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })

      const result = await response.json()

      if (response.ok) {
        setTimeLeft(180)
        setCanResend(false)
        setSuccess('인증번호가 재발송되었습니다')
      } else {
        setError(result.error || '인증번호 재발송에 실패했습니다')
      }
    } catch (error) {
      console.error('Resend verification error:', error)
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
    <div className="sm:bg-white py-8 px-6 sm:shadow-xl shadow-none rounded-xl border border-gray-100 font-paper">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {/* 헤더 */}
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-3 p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              전화번호로 가입
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {step === 'phone' && '휴대폰 번호를 입력해주세요'}
              {step === 'verification' && '인증번호를 입력해주세요'}
              {step === 'userinfo' && '추가 정보를 입력해주세요'}
            </p>
          </div>
        </div>

        {/* 진행 단계 표시 */}
        <div className="flex items-center justify-between mb-8">
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
              ${step === 'phone'
                ? 'bg-gray-300 text-gray-600'
                : step === 'verification'
                  ? 'bg-blue-600 text-white'
                  : 'bg-green-600 text-white'
              }
            `}>
              {step === 'userinfo' ? <Check className="h-4 w-4" /> : '2'}
            </div>
            <span className="ml-2 text-sm text-gray-600">인증</span>
          </div>
          <div className="flex-1 mx-4 h-px bg-gray-300"></div>
          <div className="flex items-center">
            <div className={`
              flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
              ${step !== 'userinfo'
                ? 'bg-gray-300 text-gray-600'
                : 'bg-blue-600 text-white'
              }
            `}>
              3
            </div>
            <span className="ml-2 text-sm text-gray-600">정보입력</span>
          </div>
        </div>

        {/* 메시지 */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            {success}
          </div>
        )}

        {/* 전화번호 입력 단계 */}
        {step === 'phone' && (
          <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                휴대폰 번호
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
              {isLoading ? '발송 중...' : '인증번호 발송'}
            </button>
          </form>
        )}

        {/* 인증번호 확인 단계 */}
        {step === 'verification' && (
          <form onSubmit={verificationForm.handleSubmit(handleVerificationSubmit)} className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600">
                <span className="font-medium">{phone}</span>으로<br />
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

        {/* 사용자 정보 입력 단계 */}
        {step === 'userinfo' && (
          <form onSubmit={userInfoForm.handleSubmit(handleUserInfoSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  {...userInfoForm.register('name')}
                  type="text"
                  disabled={isLoading}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {userInfoForm.formState.errors.name && (
                  <p className="mt-1 text-xs text-red-600">
                    {userInfoForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  사용자명 <span className="text-red-500">*</span>
                </label>
                <input
                  {...userInfoForm.register('username')}
                  type="text"
                  disabled={isLoading}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {userInfoForm.formState.errors.username && (
                  <p className="mt-1 text-xs text-red-600">
                    {userInfoForm.formState.errors.username.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  비밀번호 <span className="text-red-500">*</span>
                </label>
                <input
                  {...userInfoForm.register('password')}
                  type="password"
                  disabled={isLoading}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {userInfoForm.formState.errors.password && (
                  <p className="mt-1 text-xs text-red-600">
                    {userInfoForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  비밀번호 확인 <span className="text-red-500">*</span>
                </label>
                <input
                  {...userInfoForm.register('confirmPassword')}
                  type="password"
                  disabled={isLoading}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {userInfoForm.formState.errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">
                    {userInfoForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  성별 <span className="text-red-500">*</span>
                </label>
                <select
                  {...userInfoForm.register('gender')}
                  disabled={isLoading}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">선택해주세요</option>
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                  <option value="none">선택안함</option>
                </select>
                {userInfoForm.formState.errors.gender && (
                  <p className="mt-1 text-xs text-red-600">
                    {userInfoForm.formState.errors.gender.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                  생년월일 <span className="text-red-500">*</span>
                </label>
                <input
                  {...userInfoForm.register('birthDate')}
                  type="date"
                  disabled={isLoading}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {userInfoForm.formState.errors.birthDate && (
                  <p className="mt-1 text-xs text-red-600">
                    {userInfoForm.formState.errors.birthDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* 주소 입력 섹션 */}
            <div className="space-y-3">
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                  우편번호 <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex space-x-2">
                  <input
                    {...userInfoForm.register('zipCode')}
                    type="text"
                    disabled={isLoading}
                    placeholder="12345"
                    readOnly
                    className="flex-1 appearance-none block px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50"
                  />
                  <button
                    type="button"
                    disabled={isLoading || !isKakaoLoaded}
                    onClick={handleSearchAddress}
                    className={`
                      px-4 py-2 border text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
                      ${isLoading || !isKakaoLoaded
                        ? 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed'
                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                      }
                    `}
                    title={!isKakaoLoaded ? '우편번호 검색 서비스 로딩 중...' : '우편번호 검색'}
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
                {!isKakaoLoaded && (
                  <p className="mt-1 text-xs text-blue-600">
                    우편번호 검색 서비스를 준비하고 있습니다...
                  </p>
                )}
                {userInfoForm.formState.errors.zipCode && (
                  <p className="mt-1 text-xs text-red-600">
                    {userInfoForm.formState.errors.zipCode.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  기본주소 <span className="text-red-500">*</span>
                </label>
                <input
                  {...userInfoForm.register('address')}
                  type="text"
                  disabled={isLoading}
                  placeholder="우편번호 검색 버튼을 클릭하세요"
                  readOnly
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50"
                />
                {userInfoForm.formState.errors.address && (
                  <p className="mt-1 text-xs text-red-600">
                    {userInfoForm.formState.errors.address.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="addressDetail" className="block text-sm font-medium text-gray-700">
                  상세주소 (선택사항)
                </label>
                <input
                  {...userInfoForm.register('addressDetail')}
                  type="text"
                  disabled={isLoading}
                  placeholder="상세주소를 입력하세요 (동, 호수 등)"
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                소속 (선택사항)
              </label>
              <input
                {...userInfoForm.register('company')}
                type="text"
                disabled={isLoading}
                placeholder="회사명, 학교명 등"
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
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
              {isLoading ? '가입 중...' : '회원가입 완료'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}