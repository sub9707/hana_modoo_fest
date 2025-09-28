// src/components/forms/DirectRegistrationForm.tsx
'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    User, Phone, Lock, Eye, EyeOff, Building, MapPin,
    Check, X, Loader2, AlertTriangle, Shield
} from 'lucide-react'
import { directRegistrationSchema, type DirectRegistrationData } from '@/lib/validations/registration'
import { AddressSearchResult, type DuplicationCheckResponse } from '@/types/registration'
import KakaoAddressSearch from './KakaoAddressSearch'
import { useAuth } from '@/contexts/AuthContext'

interface DirectRegistrationFormProps {
    onBack: () => void
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

    const form = useForm<DirectRegistrationData>({
        resolver: zodResolver(directRegistrationSchema),
        defaultValues: {
            name: '',
            username: '',
            password: '',
            confirmPassword: '',
            phone: '',
            gender: 'none',
            birthDate: '',
            company: '',
            address: '',
            addressDetail: '',
            zipCode: '',
            agreedToTerms: false,
            agreedToPrivacy: false,
            agreedToMarketing: false
        },
        mode: 'onChange'
    })

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

        setIsSubmitting(true)

        try {
            const response = await fetch('/api/auth/direct-register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            const result = await response.json()

            if (result.success) {
                console.log('DirectRegistration: Registration successful', result)

                // AuthContext에 사용자 정보 설정
                if (result.user) {
                    console.log('DirectRegistration: Setting user in context', result.user)
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
            <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-blue-900 mb-1">
                            중요 안내사항
                        </h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• 휴대폰 번호는 경품 지급을 위한 연락처입니다</li>
                            <li>• 정확한 번호를 입력해주세요 (잘못된 번호 시 경품 수령 불가)</li>
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
                            사용자명 <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <input
                                    {...form.register('username', {
                                        onChange: () => {
                                            // 입력이 변경되면 중복 체크 상태 초기화
                                            setUsernameCheck({ isChecking: false, isChecked: false, available: false, message: '' })
                                        }
                                    })}
                                    type="text"
                                    placeholder="user123"
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
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
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
                                            // 입력이 변경되면 중복 체크 상태 초기화
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
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
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

                    <div className="space-y-3">
                        <label className="flex items-start space-x-3">
                            <input
                                {...form.register('agreedToTerms')}
                                type="checkbox"
                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">
                                <span className="text-red-500">*</span> 이용약관에 동의합니다
                            </span>
                        </label>

                        <label className="flex items-start space-x-3">
                            <input
                                {...form.register('agreedToPrivacy')}
                                type="checkbox"
                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">
                                <span className="text-red-500">*</span> 개인정보처리방침에 동의합니다
                            </span>
                        </label>
                    </div>

                    {(form.formState.errors.agreedToTerms || form.formState.errors.agreedToPrivacy) && (
                        <p className="text-sm text-red-600">필수 약관에 동의해주세요</p>
                    )}
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
                        disabled={isSubmitting || !usernameCheck.available || !phoneCheck.available}
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