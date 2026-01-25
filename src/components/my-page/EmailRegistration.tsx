'use client'

import { useState, useEffect } from 'react'
import { Mail, Loader2, Check, Clock, AlertCircle, CheckCircle } from 'lucide-react'

interface EmailRegistrationProps {
  currentEmail?: string
  onSuccess?: () => void
}

export default function EmailRegistration({ currentEmail, onSuccess }: EmailRegistrationProps) {
  const [email, setEmail] = useState('')
  const [emailCode, setEmailCode] = useState('')
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null)

  // 타이머
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // 인증번호 발송
  const handleSendCode = async () => {
    if (!email) {
      setMessage({ type: 'error', text: '이메일을 입력해주세요' })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setMessage({ type: 'error', text: '올바른 이메일 형식이 아닙니다' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/auth/send-email-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const result = await response.json()

      if (result.success) {
        setIsCodeSent(true)
        setTimeLeft(result.expiresIn || 300)
        setMessage({ type: 'success', text: '인증번호가 이메일로 전송되었습니다' })
      } else {
        setMessage({ type: 'error', text: result.error || '인증번호 전송에 실패했습니다' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '네트워크 오류가 발생했습니다' })
    } finally {
      setIsLoading(false)
    }
  }

  // 인증번호 확인
  const handleVerifyCode = async () => {
    if (!emailCode || emailCode.length !== 6) {
      setMessage({ type: 'error', text: '6자리 인증번호를 입력해주세요' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/auth/verify-email-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: emailCode })
      })

      const result = await response.json()

      if (result.success) {
        setIsVerified(true)
        setMessage({ type: 'success', text: '이메일 인증이 완료되었습니다' })
      } else {
        setMessage({ type: 'error', text: result.error || '인증번호가 일치하지 않습니다' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '네트워크 오류가 발생했습니다' })
    } finally {
      setIsLoading(false)
    }
  }

  // 이메일 등록
  const handleRegisterEmail = async () => {
    if (!isVerified) {
      setMessage({ type: 'error', text: '이메일 인증을 완료해주세요' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/auth/user/register-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: 'success', text: '이메일이 성공적으로 등록되었습니다' })
        setTimeout(() => {
          onSuccess?.()
        }, 1500)
      } else {
        setMessage({ type: 'error', text: result.error || '이메일 등록에 실패했습니다' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '네트워크 오류가 발생했습니다' })
    } finally {
      setIsLoading(false)
    }
  }

  // 이미 이메일이 있는 경우
  if (currentEmail) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">이메일 등록 완료</h3>
              <p className="text-sm text-gray-600">{currentEmail}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <Mail className="inline h-4 w-4 mr-1" />
            비밀번호 변경 시 이 이메일로 인증이 진행됩니다
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border-2 border-orange-200 shadow-md p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
          <Mail className="h-5 w-5 mr-2 text-orange-600" />
          이메일 등록
        </h3>
        <p className="text-sm text-gray-600">
          비밀번호 찾기 및 변경 시 이메일 인증이 필요합니다
        </p>
      </div>

      <div className="space-y-4">
        {/* 경고 메시지 */}
        <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-red-900 mb-1">
                ⚠️ 중요: 최초 1회만 등록 가능합니다
              </p>
              <ul className="text-xs text-red-800 space-y-1">
                <li>• 한 번 등록한 이메일은 <strong>수정 불가능</strong>합니다</li>
                <li>• 정확한 이메일 주소를 신중하게 입력해주세요</li>
                <li>• 본인이 사용하는 이메일인지 꼭 확인하세요</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 이메일 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이메일 주소 <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isVerified}
              placeholder="example@email.com"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
            />
            <button
              onClick={handleSendCode}
              disabled={isLoading || isVerified || !email}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap font-medium"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isVerified ? (
                <CheckCircle className="h-4 w-4" />
              ) : isCodeSent ? (
                '재전송'
              ) : (
                '인증번호 발송'
              )}
            </button>
          </div>
        </div>

        {/* 인증번호 입력 */}
        {isCodeSent && !isVerified && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              인증번호 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6자리 인증번호"
                  maxLength={6}
                  className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                {timeLeft > 0 && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Clock className="h-4 w-4 text-orange-500 mr-1" />
                    <span className="text-sm text-orange-600 font-medium">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={handleVerifyCode}
                disabled={isLoading || emailCode.length !== 6}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap font-medium"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  '확인'
                )}
              </button>
            </div>
          </div>
        )}

        {/* 메시지 */}
        {message && (
          <div className={`p-3 rounded-lg border ${
            message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            message.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <p className="text-sm flex items-center">
              {message.type === 'success' && <Check className="h-4 w-4 mr-2" />}
              {message.type === 'error' && <AlertCircle className="h-4 w-4 mr-2" />}
              {message.text}
            </p>
          </div>
        )}

        {/* 등록 버튼 */}
        {isVerified && (
          <button
            onClick={handleRegisterEmail}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                처리 중...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                이메일 등록하기
              </>
            )}
          </button>
        )}

        {/* 안내사항 */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-800 font-medium mb-2">
            📌 안내사항
          </p>
          <ul className="text-xs text-amber-700 space-y-1">
            <li>• 인증번호는 5분간 유효합니다</li>
            <li>• 이메일 등록 후 비밀번호 변경 기능을 사용할 수 있습니다</li>
            <li>• 등록된 이메일은 절대 변경할 수 없으니 신중히 입력해주세요</li>
          </ul>
        </div>
      </div>
    </div>
  )
}