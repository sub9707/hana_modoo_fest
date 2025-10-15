// src/components/forms/DirectRegistrationForm.tsx
'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    User, Phone, Lock, Eye, EyeOff, Building, MapPin,
    Check, X, Loader2, AlertTriangle, Shield, Mail, Clock, CheckCircle
} from 'lucide-react'
import { directRegistrationSchema, type DirectRegistrationData } from '@/lib/validations/registration'
import { AddressSearchResult, type DuplicationCheckResponse } from '@/types/registration'
import KakaoAddressSearch from './KakaoAddressSearch'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

interface DirectRegistrationFormProps {
    onBack: () => void
}

interface EmailVerificationState {
    isSent: boolean
    isVerified: boolean
    isChecking: boolean
    timeLeft: number
    message: string
}

export function DirectRegistrationForm({ onBack }: DirectRegistrationFormProps) {
    const router = useRouter()
    const { login } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    // 중복 체크 상태
    const [usernameCheck, setUsernameCheck] = useState<{
        isChecking: boolean
        isChecked: boolean
        available: boolean
        message: string
    }>({ isChecking: false, isChecked: false, available: false, message: '' })

    const [phoneCheck, setPhoneCheck] = useState<{
        isChecking: boolean
        isChecked: boolean
        available: boolean
        message: string
    }>({ isChecking: false, isChecked: false, available: false, message: '' })

    // 이메일 인증 상태
    const [emailVerification, setEmailVerification] = useState<EmailVerificationState>({
        isSent: false,
        isVerified: false,
        isChecking: false,
        timeLeft: 0,
        message: ''
    })

    const form = useForm<DirectRegistrationData>({
        resolver: zodResolver(directRegistrationSchema),
        defaultValues: {
            name: '',
            username: '',
            password: '',
            confirmPassword: '',
            phone: '',
            email: '',
            emailCode: '',
            gender: 'none',
            birthDate: '',
            company: '',
            address: '',
            addressDetail: '',
            zipCode: '',
            agreedToTerms: false,
            agreedToPrivacy: false,
            agreedToMarketing: false,
            parentalConsent: false
        },
        mode: 'onChange'
    })

    // 이메일 인증 타이머
    useEffect(() => {
        if (emailVerification.timeLeft > 0) {
            const timer = setTimeout(() => {
                setEmailVerification(prev => ({
                    ...prev,
                    timeLeft: prev.timeLeft - 1
                }))
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [emailVerification.timeLeft])

    // 시간 포맷팅 함수
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    // 사용자명 중복 체크 함수
    const checkUsername = useCallback(async () => {
        const username = form.getValues('username')

        if (!username || username.length < 4) {
            setUsernameCheck({
                isChecking: false,
                isChecked: false,
                available: false,
                message: '사용자명은 4글자 이상 입력해주세요'
            })
            return
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            setUsernameCheck({
                isChecking: false,
                isChecked: false,
                available: false,
                message: '영문, 숫자, 언더바만 사용 가능합니다'
            })
            return
        }

        setUsernameCheck(prev => ({ ...prev, isChecking: true }))

        try {
            const response = await fetch('/api/auth/check-username', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            })

            const result: DuplicationCheckResponse = await response.json()
            setUsernameCheck({
                isChecking: false,
                isChecked: true,
                available: result.available,
                message: result.message
            })
        } catch (error) {
            setUsernameCheck({
                isChecking: false,
                isChecked: false,
                available: false,
                message: '중복 확인 중 오류가 발생했습니다'
            })
        }
    }, [form])

    // 전화번호 중복 체크 함수
    const checkPhone = useCallback(async () => {
        const phone = form.getValues('phone')

        if (!phone || phone.length !== 11) {
            setPhoneCheck({
                isChecking: false,
                isChecked: false,
                available: false,
                message: '휴대폰 번호 11자리를 입력해주세요'
            })
            return
        }

        if (!phone.startsWith('01')) {
            setPhoneCheck({
                isChecking: false,
                isChecked: false,
                available: false,
                message: '올바른 휴대폰 번호를 입력해주세요'
            })
            return
        }

        setPhoneCheck(prev => ({ ...prev, isChecking: true }))

        try {
            const response = await fetch('/api/auth/check-phone', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone })
            })

            const result: DuplicationCheckResponse = await response.json()
            setPhoneCheck({
                isChecking: false,
                isChecked: true,
                available: result.available,
                message: result.message
            })
        } catch (error) {
            setPhoneCheck({
                isChecking: false,
                isChecked: false,
                available: false,
                message: '중복 확인 중 오류가 발생했습니다'
            })
        }
    }, [form])

    // 이메일 인증번호 발송
    const handleSendEmailVerification = async () => {
        const email = form.getValues('email')

        if (!email) {
            setEmailVerification(prev => ({
                ...prev,
                message: '이메일을 입력해주세요'
            }))
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setEmailVerification(prev => ({
                ...prev,
                message: '올바른 이메일 형식이 아닙니다'
            }))
            return
        }

        setEmailVerification(prev => ({ ...prev, isChecking: true, message: '' }))

        try {
            const response = await fetch('/api/auth/send-email-verification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })

            const result = await response.json()

            if (result.success) {
                setEmailVerification({
                    isSent: true,
                    isVerified: false,
                    isChecking: false,
                    timeLeft: result.expiresIn || 300,
                    message: '인증번호가 이메일로 전송되었습니다'
                })
            } else {
                setEmailVerification({
                    isSent: false,
                    isVerified: false,
                    isChecking: false,
                    timeLeft: 0,
                    message: result.error || '인증번호 전송에 실패했습니다'
                })
            }
        } catch (error) {
            setEmailVerification({
                isSent: false,
                isVerified: false,
                isChecking: false,
                timeLeft: 0,
                message: '네트워크 오류가 발생했습니다'
            })
        }
    }

    // 이메일 인증번호 확인
    const handleVerifyEmailCode = async () => {
        const email = form.getValues('email')
        const code = form.getValues('emailCode')

        if (!code || code.length !== 6) {
            setEmailVerification(prev => ({
                ...prev,
                message: '6자리 인증번호를 입력해주세요'
            }))
            return
        }

        setEmailVerification(prev => ({ ...prev, isChecking: true, message: '' }))

        try {
            const response = await fetch('/api/auth/verify-email-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code })
            })

            const result = await response.json()

            if (result.success) {
                setEmailVerification({
                    isSent: true,
                    isVerified: true,
                    isChecking: false,
                    timeLeft: 0,
                    message: '이메일 인증이 완료되었습니다'
                })
            } else {
                setEmailVerification(prev => ({
                    ...prev,
                    isChecking: false,
                    message: result.error || '인증번호가 일치하지 않습니다'
                }))
            }
        } catch (error) {
            setEmailVerification(prev => ({
                ...prev,
                isChecking: false,
                message: '네트워크 오류가 발생했습니다'
            }))
        }
    }

    // 전화번호 포맷팅
    const formatPhone = (value: string) => {
        const numbers = value.replace(/[^\d]/g, '')
        if (numbers.length <= 3) return numbers
        if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
        return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
    }

    const onSubmit = async (data: DirectRegistrationData) => {
        setSubmitError(null)

        // 중복 체크 확인
        if (!usernameCheck.isChecked || !usernameCheck.available) {
            setSubmitError('사용자명 중복 확인을 완료해주세요')
            return
        }

        if (!phoneCheck.isChecked || !phoneCheck.available) {
            setSubmitError('전화번호 중복 확인을 완료해주세요')
            return
        }

        // 이메일 인증 확인
        if (!emailVerification.isVerified) {
            setSubmitError('이메일 인증을 완료해주세요')
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch('/api/auth/direct-register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            const result = await response.json()

            if (result.success) {
                // AuthContext에 사용자 정보 설정
                if (result.user) {
                    login(result.user)
                }

                // 성공 메시지와 함께 메인 페이지로 이동
                const redirectUrl = new URL('/', window.location.origin)
                redirectUrl.searchParams.set('signup_success', 'true')

                router.push(redirectUrl.pathname + redirectUrl.search)
            } else {
                setSubmitError(result.error || '회원가입에 실패했습니다')
            }
        } catch (error) {
            setSubmitError('네트워크 오류가 발생했습니다')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleAddressSelect = (addressData: AddressSearchResult) => {
        form.setValue('address', addressData.address, { shouldValidate: true })
        form.setValue('zipCode', addressData.zip_code, { shouldValidate: true })

        // 상세주소 입력 필드로 포커스 이동
        setTimeout(() => {
            const detailInput = document.getElementById('addressDetail')
            detailInput?.focus()
        }, 100)
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100 font-paper">
            {/* 헤더 */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">회원가입</h2>
                <p className="text-gray-600">모두하나대축제에 참여하세요</p>
            </div>

            {/* 경품 관련 안내 */}
            <div className="mb-8 p-4 bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200 rounded-lg">
                <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-orange-900 mb-1">
                            중요 안내사항
                        </h3>
                        <ul className="text-sm text-orange-800 space-y-1">
                            <li>• 휴대폰 번호는 경품 지급을 위한 연락처입니다</li>
                            <li>• 정확한 정보를 입력해주세요 (잘못된 번호일 시 경품 수령 불가)</li>
                            <li>• 동일 번호로 중복 가입 시 참여가 제한됩니다</li>
                            <li>• 부정한 방법으로 중복 참여 시 모든 혜택이 박탈됩니다</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* 폼 */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* 기본 정보 섹션 */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        기본 정보
                    </h3>

                    {/* 이름 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            이름 <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...form.register('name')}
                            type="text"
                            placeholder="홍길동"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {form.formState.errors.name && (
                            <p className="mt-1 text-sm text-red-600">{form.formState.errors.name.message}</p>
                        )}
                    </div>

                    {/* 사용자명 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            로그인 ID <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <input
                                    {...form.register('username', {
                                        onChange: () => {
                                            setUsernameCheck({ isChecking: false, isChecked: false, available: false, message: '' })
                                        }
                                    })}
                                    type="text"
                                    placeholder="ID 입력"
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    {usernameCheck.isChecked && usernameCheck.available && <Check className="h-4 w-4 text-green-500" />}
                                    {usernameCheck.isChecked && !usernameCheck.available && <X className="h-4 w-4 text-red-500" />}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={checkUsername}
                                disabled={usernameCheck.isChecking || !form.getValues('username')}
                                className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                            >
                                {usernameCheck.isChecking ? (
                                    <>
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        확인중
                                    </>
                                ) : (
                                    '중복확인'
                                )}
                            </button>
                        </div>
                        {form.formState.errors.username && (
                            <p className="mt-1 text-sm text-red-600">{form.formState.errors.username.message}</p>
                        )}
                        {usernameCheck.message && (
                            <p className={`mt-1 text-sm ${usernameCheck.available ? 'text-green-600' : 'text-red-600'}`}>
                                {usernameCheck.message}
                            </p>
                        )}
                    </div>

                    {/* 비밀번호 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            비밀번호 <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                {...form.register('password')}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                            </button>
                        </div>
                        {form.formState.errors.password && (
                            <p className="mt-1 text-sm text-red-600">{form.formState.errors.password.message}</p>
                        )}
                    </div>

                    {/* 비밀번호 확인 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            비밀번호 확인 <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                {...form.register('confirmPassword')}
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="비밀번호를 다시 입력해주세요"
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                            </button>
                        </div>
                        {form.formState.errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{form.formState.errors.confirmPassword.message}</p>
                        )}
                    </div>
                </div>

                {/* 연락처 정보 섹션 */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Phone className="h-5 w-5 mr-2" />
                        연락처 정보
                    </h3>

                    {/* 휴대폰 번호 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            휴대폰 번호 <span className="text-red-500">*</span>
                            <span className="text-xs text-blue-600 ml-2">(경품 수령용 - 정확히 입력해주세요)</span>
                        </label>
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <input
                                    {...form.register('phone', {
                                        onChange: (e) => {
                                            const value = e.target.value.replace(/[^\d]/g, '')
                                            e.target.value = formatPhone(value)
                                            form.setValue('phone', value)
                                            setPhoneCheck({ isChecking: false, isChecked: false, available: false, message: '' })
                                        }
                                    })}
                                    type="tel"
                                    placeholder="010-0000-0000"
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    {phoneCheck.isChecked && phoneCheck.available && <Check className="h-4 w-4 text-green-500" />}
                                    {phoneCheck.isChecked && !phoneCheck.available && <X className="h-4 w-4 text-red-500" />}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={checkPhone}
                                disabled={phoneCheck.isChecking || !form.getValues('phone')}
                                className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                            >
                                {phoneCheck.isChecking ? (
                                    <>
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        확인중
                                    </>
                                ) : (
                                    '중복확인'
                                )}
                            </button>
                        </div>
                        {form.formState.errors.phone && (
                            <p className="mt-1 text-sm text-red-600">{form.formState.errors.phone.message}</p>
                        )}
                        {phoneCheck.message && (
                            <p className={`mt-1 text-sm ${phoneCheck.available ? 'text-green-600' : 'text-red-600'}`}>
                                {phoneCheck.message}
                            </p>
                        )}
                    </div>

                    {/* 이메일 (필수) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            이메일 <span className="text-red-500">*</span>
                        </label>
                        <p className="text-xs text-gray-600 mb-2">
                            비밀번호 찾기 및 변경 시 필요합니다
                        </p>

                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <input
                                    {...form.register('email')}
                                    type="email"
                                    placeholder="example@email.com"
                                    disabled={emailVerification.isVerified}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                />
                                <button
                                    type="button"
                                    onClick={handleSendEmailVerification}
                                    disabled={emailVerification.isChecking || emailVerification.isVerified}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap"
                                >
                                    {emailVerification.isChecking ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : emailVerification.isVerified ? (
                                        <CheckCircle className="h-4 w-4" />
                                    ) : emailVerification.isSent ? (
                                        '재전송'
                                    ) : (
                                        '인증번호'
                                    )}
                                </button>
                            </div>

                            {form.formState.errors.email && (
                                <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
                            )}

                            {emailVerification.isSent && !emailVerification.isVerified && (
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            {...form.register('emailCode')}
                                            type="text"
                                            placeholder="6자리 인증번호 입력"
                                            maxLength={6}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                                                form.setValue('emailCode', value)
                                            }}
                                            className="w-full px-3 py-2 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {emailVerification.timeLeft > 0 && (
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                <Clock className="h-4 w-4 text-orange-500 mr-1" />
                                                <span className="text-sm text-orange-600 font-medium">
                                                    {formatTime(emailVerification.timeLeft)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleVerifyEmailCode}
                                        disabled={emailVerification.isChecking}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 whitespace-nowrap"
                                    >
                                        {emailVerification.isChecking ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            '확인'
                                        )}
                                    </button>
                                </div>
                            )}

                            {emailVerification.message && (
                                <p className={`text-sm ${
                                    emailVerification.isVerified
                                        ? 'text-green-600'
                                        : emailVerification.isSent
                                            ? 'text-blue-600'
                                            : 'text-red-600'
                                }`}>
                                    {emailVerification.isVerified && <Check className="inline h-4 w-4 mr-1" />}
                                    {emailVerification.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* 개인 정보 섹션 */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">개인 정보</h3>

                    {/* 성별 & 생년월일 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                성별 <span className="text-red-500">*</span>
                            </label>
                            <select
                                {...form.register('gender')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="none">선택 안함</option>
                                <option value="male">남성</option>
                                <option value="female">여성</option>
                            </select>
                            {form.formState.errors.gender && (
                                <p className="mt-1 text-sm text-red-600">{form.formState.errors.gender.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                생년월일 <span className="text-red-500">*</span>
                            </label>
                            <input
                                {...form.register('birthDate')}
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {form.formState.errors.birthDate && (
                                <p className="mt-1 text-sm text-red-600">{form.formState.errors.birthDate.message}</p>
                            )}
                        </div>
                    </div>

                    {/* 만 14세 미만 법정대리인 동의 */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <label className="flex items-start space-x-3 cursor-pointer">
                            <input
                                {...form.register('parentalConsent')}
                                type="checkbox"
                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700 flex-1">
                                만 14세 미만인 경우, 법정대리인(부모 또는 보호자)이
                                본 회원가입 및 개인정보 수집에 동의합니다.
                                <span className="block text-xs text-blue-600 mt-1">
                                    ※ 만 14세 이상인 경우 체크하지 않으셔도 됩니다
                                </span>
                            </span>
                        </label>
                    </div>

                    {/* 회사명 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Building className="inline h-4 w-4 mr-1" />
                            소속 (행사관계자일 경우)
                        </label>
                        <input
                            {...form.register('company')}
                            type="text"
                            placeholder="소속을 입력해주세요"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* 주소 정보 섹션 */}
                <div className="space-y-4 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        주소 정보 (선택)
                    </h3>

                    <div className="space-y-4">
                        {/* 우편번호 & 기본주소 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">우편번호</label>
                                <input
                                    {...form.register('zipCode')}
                                    type="text"
                                    placeholder="우편번호"
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">기본주소</label>
                                <KakaoAddressSearch
                                    onAddressSelect={handleAddressSelect}
                                    value={form.watch('address')}
                                    placeholder="주소 검색을 클릭해주세요"
                                    disabled={isSubmitting}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* 상세주소 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">상세주소</label>
                            <input
                                {...form.register('addressDetail')}
                                id="addressDetail"
                                type="text"
                                placeholder="상세주소를 입력해주세요 (동, 호수 등)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* 약관 동의 */}
                <div className="space-y-3 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        약관 동의
                    </h3>

                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                        {/* 서비스 이용약관 */}
                        <label className="flex items-start space-x-3 cursor-pointer hover:bg-white p-2 rounded transition-colors">
                            <input
                                {...form.register('agreedToTerms')}
                                type="checkbox"
                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700 flex-1">
                                <span className="text-red-500 font-bold">* [필수]</span>{' '}
                                <Link
                                    className="text-blue-600 hover:text-blue-800 underline font-medium"
                                    href="/terms-of-service"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    서비스 이용약관
                                </Link>
                                에 동의합니다
                            </span>
                        </label>

                        {/* 개인정보처리방침 */}
                        <label className="flex items-start space-x-3 cursor-pointer hover:bg-white p-2 rounded transition-colors">
                            <input
                                {...form.register('agreedToPrivacy')}
                                type="checkbox"
                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700 flex-1">
                                <span className="text-red-500 font-bold">* [필수]</span>{' '}
                                <Link
                                    className="text-blue-600 hover:text-blue-800 underline font-medium"
                                    href="/privacy-policy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    개인정보처리방침
                                </Link>
                                에 동의합니다
                            </span>
                        </label>

                        {/* 마케팅 수신 동의 */}
                        <label className="flex items-start space-x-3 cursor-pointer hover:bg-white p-2 rounded transition-colors">
                            <input
                                {...form.register('agreedToMarketing')}
                                type="checkbox"
                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">
                                [선택] 마케팅 정보 수신에 동의합니다
                            </span>
                        </label>
                    </div>

                    {/* 에러 메시지 */}
                    {(form.formState.errors.agreedToTerms || form.formState.errors.agreedToPrivacy) && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-sm text-red-600 font-medium">
                                필수 약관에 동의해주세요
                            </p>
                        </div>
                    )}

                    {/* 안내 문구 */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs text-blue-800">
                            약관 내용을 확인하시려면 파란색 링크를 클릭하세요. 새 창에서 전체 내용을 확인하실 수 있습니다.
                        </p>
                    </div>
                </div>

                {/* 에러 메시지 */}
                {submitError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{submitError}</p>
                    </div>
                )}

                {/* 버튼 */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        이전으로
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting || !usernameCheck.available || !phoneCheck.available || !emailVerification.isVerified}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                가입 처리 중...
                            </>
                        ) : (
                            '회원가입 완료'
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}