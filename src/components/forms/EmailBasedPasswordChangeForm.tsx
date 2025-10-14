// src/components/forms/EmailBasedPasswordChangeForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  calculatePasswordStrength, 
  getPasswordStrengthColor, 
  getPasswordStrengthText,
  type PasswordStrengthResult 
} from '@/lib/utils/password'
import { 
  Eye, EyeOff, Lock, Mail, CheckCircle, AlertCircle, 
  Loader2, Clock, Shield 
} from 'lucide-react'

interface FormData {
  email: string
  verificationCode: string
  newPassword: string
  confirmPassword: string
}

interface FormErrors {
  email?: string
  verificationCode?: string
  newPassword?: string
  confirmPassword?: string
  general?: string
}

export function EmailBasedPasswordChangeForm({ userEmail }: { userEmail?: string }) {
  const router = useRouter()
  
  const [step, setStep] = useState<'email' | 'password'>('email')
  const [isLoading, setIsLoading] = useState(false)
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  
  const [formData, setFormData] = useState<FormData>({
    email: userEmail || '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false
  })
  const [successMessage, setSuccessMessage] = useState<string>('')

  // 비밀번호 강도 실시간 계산
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrengthResult | null>(null)

  useEffect(() => {
    if (formData.newPassword) {
      const strength = calculatePasswordStrength(formData.newPassword)
      setPasswordStrength(strength)
    } else {
      setPasswordStrength(null)
    }
  }, [formData.newPassword])

  // 타이머 카운트다운
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  // 시간 포맷팅 (MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // 이메일 인증번호 발송
  const handleSendVerificationCode = async () => {
    if (!formData.email) {
      setErrors({ email: '이메일을 입력해주세요' })
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const response = await fetch('/api/auth/send-email-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email,
          skipDuplicateCheck: true // 비밀번호 변경 모드임을 표시
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setIsCodeSent(true)
        setTimeLeft(300) // 5분
        setErrors({})
        alert('인증번호가 이메일로 전송되었습니다')
      } else {
        setErrors({ email: data.error || '인증번호 발송에 실패했습니다' })
      }
    } catch (error) {
      console.error('Send verification code error:', error)
      setErrors({ general: '네트워크 오류가 발생했습니다' })
    } finally {
      setIsLoading(false)
    }
  }

  // 인증번호 확인 및 다음 단계로
  const handleVerifyCode = async () => {
    if (!formData.verificationCode || formData.verificationCode.length !== 6) {
      setErrors({ verificationCode: '6자리 인증번호를 입력해주세요' })
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const response = await fetch('/api/auth/verify-email-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          code: formData.verificationCode 
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setStep('password')
        setErrors({})
      } else {
        setErrors({ verificationCode: data.error || '인증번호가 올바르지 않습니다' })
      }
    } catch (error) {
      console.error('Verify code error:', error)
      setErrors({ general: '네트워크 오류가 발생했습니다' })
    } finally {
      setIsLoading(false)
    }
  }

  // 비밀번호 유효성 검사
  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return '비밀번호는 8자 이상이어야 합니다'
    }
    
    if (password.length > 128) {
      return '비밀번호는 128자를 초과할 수 없습니다'
    }
    
    const hasLetter = /[a-zA-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    
    if (!hasLetter || !hasNumber || !hasSpecial) {
      return '영문, 숫자, 특수문자를 모두 포함해야 합니다'
    }
    
    return null
  }

  // 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.newPassword) {
      newErrors.newPassword = '새 비밀번호를 입력해주세요'
    } else {
      const passwordError = validatePassword(formData.newPassword)
      if (passwordError) {
        newErrors.newPassword = passwordError
      } else if (passwordStrength && !passwordStrength.isStrong) {
        newErrors.newPassword = '더 강한 비밀번호를 사용해주세요'
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '새 비밀번호 확인을 입력해주세요'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = '새 비밀번호가 일치하지 않습니다'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 비밀번호 변경 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const response = await fetch('/api/auth/change-password-with-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          verificationCode: formData.verificationCode,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccessMessage(data.message || '비밀번호가 성공적으로 변경되었습니다')
        
        setTimeout(() => {
          router.push('/my-page')
          router.refresh()
        }, 2000)
      } else {
        setErrors({ general: data.error || '비밀번호 변경에 실패했습니다' })
      }
    } catch (error) {
      console.error('Change password error:', error)
      setErrors({ general: '네트워크 오류가 발생했습니다' })
    } finally {
      setIsLoading(false)
    }
  }

  // 입력값 변경 핸들러
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
    
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }))
    }
  }

  // 비밀번호 표시/숨기기 토글
  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  // 성공 메시지 표시
  if (successMessage) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 font-paper">
        <div className="text-center space-y-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">비밀번호 변경 완료</h3>
            <p className="mt-2 text-sm text-gray-600">{successMessage}</p>
            <p className="mt-1 text-xs text-gray-500">잠시 후 마이페이지로 이동합니다...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 font-paper">
      <div className="flex items-center mb-6">
        <Shield className="w-6 h-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">
          이메일 인증으로 비밀번호 변경
        </h2>
      </div>

      {/* 일반 에러 메시지 */}
      {errors.general && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-red-800 text-sm">{errors.general}</p>
        </div>
      )}

      {/* Step 1: 이메일 인증 */}
      {step === 'email' && (
        <div className="space-y-6">
          {/* 이메일 입력 */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              이메일 주소 *
            </label>
            <p className="text-xs text-gray-600 mb-2">
              등록된 이메일 주소로 인증번호를 발송합니다
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  disabled={true}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  placeholder="example@email.com"
                />
              </div>
              <button
                type="button"
                onClick={handleSendVerificationCode}
                disabled={isLoading || !formData.email}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap font-medium transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isCodeSent ? (
                  '재전송'
                ) : (
                  '인증번호 발송'
                )}
              </button>
            </div>
            {errors.email && (
              <p className="text-red-600 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.email}
              </p>
            )}
          </div>

          {/* 인증번호 입력 */}
          {isCodeSent && (
            <div>
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
                인증번호 *
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    id="verificationCode"
                    value={formData.verificationCode}
                    onChange={(e) => handleChange('verificationCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    className={`w-full px-3 py-3 pr-20 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.verificationCode ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="6자리 인증번호"
                  />
                  {timeLeft > 0 && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <Clock className="h-4 w-4 text-blue-500 mr-1" />
                      <span className="text-sm text-blue-600 font-medium">
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={isLoading || formData.verificationCode.length !== 6}
                  className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap font-medium transition-colors"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    '확인'
                  )}
                </button>
              </div>
              {errors.verificationCode && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.verificationCode}
                </p>
              )}
            </div>
          )}

          {/* 안내사항 */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800 font-medium mb-2">안내사항</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• 인증번호는 5분간 유효합니다</li>
              <li>• 이메일이 도착하지 않으면 스팸함을 확인해주세요</li>
              <li>• 인증번호는 여러 번 재전송할 수 있습니다</li>
            </ul>
          </div>
        </div>
      )}

      {/* Step 2: 새 비밀번호 입력 */}
      {step === 'password' && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 새 비밀번호 */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              새 비밀번호 *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPasswords.new ? 'text' : 'password'}
                id="newPassword"
                value={formData.newPassword}
                onChange={(e) => handleChange('newPassword', e.target.value)}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.newPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="새 비밀번호를 입력하세요"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isLoading}
              >
                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-red-600 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.newPassword}
              </p>
            )}
            
            {/* 비밀번호 강도 표시 */}
            {passwordStrength && formData.newPassword && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">비밀번호 강도</span>
                  <span className={`text-xs font-medium ${getPasswordStrengthColor(passwordStrength.strength)}`}>
                    {getPasswordStrengthText(passwordStrength.strength)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      passwordStrength.strength === 'very-weak' ? 'bg-red-500 w-1/5' :
                      passwordStrength.strength === 'weak' ? 'bg-orange-500 w-2/5' :
                      passwordStrength.strength === 'fair' ? 'bg-yellow-500 w-3/5' :
                      passwordStrength.strength === 'good' ? 'bg-blue-500 w-4/5' :
                      'bg-green-500 w-full'
                    }`}
                  />
                </div>
                {passwordStrength.feedback.length > 0 && (
                  <ul className="mt-2 text-xs text-gray-600 space-y-1">
                    {passwordStrength.feedback.map((tip, index) => (
                      <li key={index}>• {tip}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* 새 비밀번호 확인 */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              새 비밀번호 확인 *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="새 비밀번호를 다시 입력하세요"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isLoading}
              >
                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.confirmPassword}
              </p>
            )}
            
            {/* 비밀번호 일치 확인 표시 */}
            {formData.newPassword && formData.confirmPassword && (
              <div className="mt-2">
                {formData.newPassword === formData.confirmPassword ? (
                  <p className="text-green-600 text-sm flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    비밀번호가 일치합니다
                  </p>
                ) : (
                  <p className="text-red-600 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    비밀번호가 일치하지 않습니다
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 제출 버튼 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setStep('email')
                setFormData(prev => ({ ...prev, newPassword: '', confirmPassword: '' }))
                setErrors({})
              }}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              이전
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  변경 중...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  비밀번호 변경
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* 보안 안내 */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900 mb-2">보안 안내</h3>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• 강력한 비밀번호를 사용하여 계정을 보호하세요</li>
          <li>• 다른 사이트와 동일한 비밀번호를 사용하지 마세요</li>
          <li>• 비밀번호는 정기적으로 변경하는 것을 권장합니다</li>
        </ul>
      </div>
    </div>
  )
}