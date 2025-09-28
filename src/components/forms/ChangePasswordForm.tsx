// src/components/forms/ChangePasswordForm.tsx
'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { changePassword } from '@/app/(site)/my-page/change-password/actions'
import { 
  calculatePasswordStrength, 
  getPasswordStrengthColor, 
  getPasswordStrengthText,
  type PasswordStrengthResult 
} from '@/lib/utils/password'
import { Eye, EyeOff, Lock, Shield, CheckCircle, AlertCircle } from 'lucide-react'

interface FormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface FormErrors {
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
  general?: string
}

export function ChangePasswordForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const [formData, setFormData] = useState<FormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  // NextJS 15: 실시간 비밀번호 강도 검사
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrengthResult | null>(null)

  // 비밀번호 강도 실시간 계산
  useEffect(() => {
    if (formData.newPassword) {
      const strength = calculatePasswordStrength(formData.newPassword)
      setPasswordStrength(strength)
    } else {
      setPasswordStrength(null)
    }
  }, [formData.newPassword])

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

    if (!formData.currentPassword) {
      newErrors.currentPassword = '현재 비밀번호를 입력해주세요'
    }

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

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = '현재 비밀번호와 동일한 비밀번호는 사용할 수 없습니다'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 입력값 변경 핸들러
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // 실시간 에러 제거
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
    
    // 일반 에러 제거
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }))
    }
  }

  // 비밀번호 표시/숨기기 토글
  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    startTransition(async () => {
      try {
        const result = await changePassword({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmNewPassword: formData.confirmPassword
        })

        if (result.success) {
          // NextJS 15: 향상된 사용자 피드백
          const successMessage = result.message || '비밀번호가 성공적으로 변경되었습니다.'
          
          // 성공 알림 표시
          setErrors({})
          
          // 잠시 후 마이페이지로 이동
          setTimeout(() => {
            router.push('/my-page')
            router.refresh() // NextJS 15: 캐시 갱신
          }, 1500)
          
          // 폼 초기화
          setFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          })
          
          alert(successMessage)
        } else {
          setErrors({ general: result.error || '비밀번호 변경에 실패했습니다.' })
        }
      } catch (error) {
        console.error('Password change error:', error)
        setErrors({ general: '오류가 발생했습니다. 잠시 후 다시 시도해주세요.' })
      }
    })
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Shield className="w-6 h-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">비밀번호 변경</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 일반 에러 메시지 */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm">{errors.general}</p>
          </div>
        )}

        {/* 현재 비밀번호 */}
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
            현재 비밀번호 *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPasswords.current ? 'text' : 'password'}
              id="currentPassword"
              value={formData.currentPassword}
              onChange={(e) => handleChange('currentPassword', e.target.value)}
              className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.currentPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="현재 비밀번호를 입력하세요"
              disabled={isPending}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isPending}
            >
              {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.currentPassword}
            </p>
          )}
        </div>

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
              disabled={isPending}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isPending}
            >
              {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          {/* 비밀번호 강도 표시기 */}
          {passwordStrength && formData.newPassword && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">비밀번호 강도:</span>
                <span className={`text-xs font-medium ${
                  passwordStrength.isStrong ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {getPasswordStrengthText(passwordStrength.strength)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength.strength)}`}
                  style={{ width: `${(passwordStrength.score / 8) * 100}%` }}
                ></div>
              </div>
              {passwordStrength.feedback.length > 0 && (
                <ul className="text-xs text-gray-600 space-y-1">
                  {passwordStrength.feedback.map((feedback, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                      {feedback}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          
          {errors.newPassword && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.newPassword}
            </p>
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
              disabled={isPending}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isPending}
            >
              {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          {/* 비밀번호 일치 표시 */}
          {formData.confirmPassword && (
            <div className="mt-1">
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
          
          {errors.confirmPassword && (
            <p className="text-red-600 text-sm mt-1 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* 제출 버튼 */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isPending}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isPending || !passwordStrength?.isStrong}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
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

      {/* 보안 안내 */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900 mb-2">보안 안내</h3>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• 강력한 비밀번호를 사용하여 계정을 보호하세요</li>
          <li>• 다른 사이트와 동일한 비밀번호를 사용하지 마세요</li>
        </ul>
      </div>
    </div>
  )
}