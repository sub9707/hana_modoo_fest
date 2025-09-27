'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Phone, MessageSquare, Loader2, Check, Clock, AlertCircle, Eye, EyeOff, Search } from 'lucide-react'

interface PhoneRegistrationTestProps {
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

export default function PhoneRegistrationTest({ onComplete, onBack }: PhoneRegistrationTestProps) {
  const [step, setStep] = useState<'phone' | 'verification' | 'userinfo'>('phone')
  const [phone, setPhone] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [canResend, setCanResend] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false)
  
  // 개발 모드 상태
  const [devMode, setDevMode] = useState(false)
  const [devCode, setDevCode] = useState('')

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
  const handleSendVerification = async (data: PhoneFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    setDevMode(false)
    setDevCode('')

    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: data.phone })
      })

      const result = await response.json()

      if (response.ok) {
        setPhone(data.phone)
        setStep('verification')
        setTimeLeft(300) // 5분
        setCanResend(false)
        setSuccess('인증번호가 발송되었습니다')
        
        // 개발 모드 확인
        if (result.devMode) {
          setDevMode(true)
          setDevCode(result.verificationCode)
          setSuccess(result.message)
        }
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError('네트워크 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  // 인증번호 확인
  const handleVerifyCode = async (data: VerificationFormData) => {
    setIsLoading(true)
    setError(null)

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
        setSuccess('전화번호 인증이 완료되었습니다')
        setStep('userinfo')
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError('네트워크 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  // 회원가입 완료
  const handleRegister = async (data: UserInfoFormData) => {
    setIsLoading(true)
    setError(null)

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
        setSuccess('회원가입이 완료되었습니다!')
        setTimeout(() => {
          onComplete()
        }, 1500)
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError('네트워크 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  // 인증번호 재발송
  const handleResend = () => {
    setStep('phone')
    setTimeLeft(0)
    setCanResend(false)
    setError(null)
    setSuccess(null)
    setDevMode(false)
    setDevCode('')
    verificationForm.reset()
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
          <div className="flex-1">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                전화번호로 가입
              </h2>
              {/* 개발 모드 표시 */}
              {devMode && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                  DEV
                </span>
              )}
            </div>
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
            <span className="ml-2 text-sm text-gray-600">완료</span>
          </div>
        </div>

        {/* 개발 모드 힌트 */}
        {devMode && step === 'verification' && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-800 text-sm font-medium mb-2">
              <AlertCircle className="h-4 w-4" />
              <span>개발 모드 활성화</span>
            </div>
            <div className="text-blue-700 text-sm space-y-1">
              <p>• 자동 생성된 인증번호: <code className="bg-blue-100 px-1 rounded font-mono">{devCode}</code></p>
              <p>• 관리자 바이패스 코드: <code className="bg-blue-100 px-1 rounded font-mono">000000</code></p>
              <p>• 실제 SMS는 발송되지 않습니다</p>
            </div>
            {/* 빠른 입력 버튼 */}
            <div className="mt-3 flex space-x-2">
              <button
                type="button"
                onClick={() => verificationForm.setValue('code', devCode)}
                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
              >
                자동 코드 입력
              </button>
              <button
                type="button"
                onClick={() => verificationForm.setValue('code', '000000')}
                className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
              >
                관리자 코드 입력
              </button>
            </div>
          </div>
        )}

        {/* 에러/성공 메시지 */}
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
          <form onSubmit={phoneForm.handleSubmit(handleSendVerification)} className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                휴대폰 번호
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...phoneForm.register('phone')}
                  type="tel"
                  placeholder="010-1234-5678"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value)
                    e.target.value = formatted
                    phoneForm.setValue('phone', formatted)
                  }}
                />
              </div>
              {phoneForm.formState.errors.phone && (
                <p className="mt-1 text-sm text-red-600">{phoneForm.formState.errors.phone.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  인증번호 발송 중...
                </>
              ) : (
                '인증번호 발송'
              )}
            </button>
          </form>
        )}

        {/* Step 2: 인증번호 입력 */}
        {step === 'verification' && (
          <form onSubmit={verificationForm.handleSubmit(handleVerifyCode)} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                인증번호
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MessageSquare className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...verificationForm.register('code')}
                  type="text"
                  placeholder="6자리 숫자 입력"
                  maxLength={6}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(/[^\d]/g, '')
                  }}
                />
              </div>
              {verificationForm.formState.errors.code && (
                <p className="mt-1 text-sm text-red-600">{verificationForm.formState.errors.code.message}</p>
              )}
              
              <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                <span>{formatPhone(phone)}로 발송됨</span>
                {timeLeft > 0 && (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatTime(timeLeft)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    인증 확인 중...
                  </>
                ) : (
                  '인증번호 확인'
                )}
              </button>

              {canResend && (
                <button
                  type="button"
                  onClick={handleResend}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  인증번호 재발송
                </button>
              )}
            </div>
          </form>
        )}

        {/* Step 3: 사용자 정보 입력 */}
        {step === 'userinfo' && (
          <form onSubmit={userInfoForm.handleSubmit(handleRegister)} className="space-y-6">
            {/* 이름 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                이름 *
              </label>
              <input
                {...userInfoForm.register('name')}
                type="text"
                placeholder="홍길동"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {userInfoForm.formState.errors.name && (
                <p className="mt-1 text-sm text-red-600">{userInfoForm.formState.errors.name.message}</p>
              )}
            </div>

            {/* 사용자명 */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                사용자명 *
              </label>
              <input
                {...userInfoForm.register('username')}
                type="text"
                placeholder="user123"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {userInfoForm.formState.errors.username && (
                <p className="mt-1 text-sm text-red-600">{userInfoForm.formState.errors.username.message}</p>
              )}
            </div>

            {/* 비밀번호 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 *
              </label>
              <div className="relative">
                <input
                  {...userInfoForm.register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="영문+숫자 6자리 이상"
                  className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {userInfoForm.formState.errors.password && (
                <p className="mt-1 text-sm text-red-600">{userInfoForm.formState.errors.password.message}</p>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 확인 *
              </label>
              <div className="relative">
                <input
                  {...userInfoForm.register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 다시 입력해주세요"
                  className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {userInfoForm.formState.errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{userInfoForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            {/* 성별 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                성별 *
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    {...userInfoForm.register('gender')}
                    type="radio"
                    value="male"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">남성</span>
                </label>
                <label className="flex items-center">
                  <input
                    {...userInfoForm.register('gender')}
                    type="radio"
                    value="female"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">여성</span>
                </label>
                <label className="flex items-center">
                  <input
                    {...userInfoForm.register('gender')}
                    type="radio"
                    value="none"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">선택안함</span>
                </label>
              </div>
              {userInfoForm.formState.errors.gender && (
                <p className="mt-1 text-sm text-red-600">{userInfoForm.formState.errors.gender.message}</p>
              )}
            </div>

            {/* 생년월일 */}
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                생년월일 *
              </label>
              <input
                {...userInfoForm.register('birthDate')}
                type="date"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {userInfoForm.formState.errors.birthDate && (
                <p className="mt-1 text-sm text-red-600">{userInfoForm.formState.errors.birthDate.message}</p>
              )}
            </div>

            {/* 주소 입력 섹션 */}
            <div className="space-y-3">
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                  우편번호 *
                </label>
                <div className="flex space-x-2">
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
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  기본주소 *
                </label>
                <input
                  {...userInfoForm.register('address')}
                  type="text"
                  disabled={isLoading}
                  placeholder="우편번호 검색 버튼을 클릭하세요"
                  readOnly
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                />
                {userInfoForm.formState.errors.address && (
                  <p className="mt-1 text-xs text-red-600">
                    {userInfoForm.formState.errors.address.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="addressDetail" className="block text-sm font-medium text-gray-700 mb-2">
                  상세주소 (선택사항)
                </label>
                <input
                  {...userInfoForm.register('addressDetail')}
                  type="text"
                  disabled={isLoading}
                  placeholder="상세주소를 입력하세요 (동, 호수 등)"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* 회사명 */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                회사명 (선택)
              </label>
              <input
                {...userInfoForm.register('company')}
                type="text"
                placeholder="회사명을 입력해주세요"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  회원가입 처리 중...
                </>
              ) : (
                '회원가입 완료'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}