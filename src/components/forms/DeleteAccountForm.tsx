'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { deleteAccount } from '@/app/(site)/my-page/delete-account/actions'
import Link from 'next/link'
import {
    ArrowLeft,
    AlertTriangle,
    Database,
    MessageSquare,
    Shield,
    Clock,
    Eye,
    EyeOff,
    Info
} from 'lucide-react'

// 전화번호 가입자용 스키마
const phoneDeleteSchema = z.object({
    password: z.string().min(1, '현재 비밀번호를 입력해주세요'),
    reason: z.enum(['privacy_concern', 'service_dissatisfaction', 'no_longer_needed', 'duplicate_account', 'other']).optional(),
    reasonDetail: z.string().max(500, '500자 이하로 입력해주세요').optional(),
    confirmDelete: z.boolean().refine(val => val === true, { message: '탈퇴 확인이 필요합니다' }),
    agreeRestriction: z.boolean().refine(val => val === true, { message: '재가입 제한 안내에 동의해주세요' })
})

// SNS 가입자용 스키마
const socialDeleteSchema = z.object({
    reason: z.enum(['privacy_concern', 'service_dissatisfaction', 'no_longer_needed', 'duplicate_account', 'other']).optional(),
    reasonDetail: z.string().max(500, '500자 이하로 입력해주세요').optional(),
    confirmDelete: z.boolean().refine(val => val === true, { message: '탈퇴 확인이 필요합니다' }),
    agreeRestriction: z.boolean().refine(val => val === true, { message: '재가입 제한 안내에 동의해주세요' })
})

type PhoneDeleteData = z.infer<typeof phoneDeleteSchema>
type SocialDeleteData = z.infer<typeof socialDeleteSchema>

export function DeleteAccountForm() {
    const { user, logout } = useAuth()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [warning, setWarning] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)

    const isPhoneUser = user?.signup_method === 'phone'

    // 공통 탈퇴 처리 함수
    const handleDeleteRequest = async (data: any, password?: string) => {
        setIsLoading(true)
        setError(null)
        setWarning(null)

        try {
            const result = await deleteAccount({
                ...data,
                password: password
            })

            if (result.success) {
                // 탈퇴 성공 시 먼저 로그아웃 처리
                logout()

                // 패턴 경고가 있으면 잠시 표시 후 이동
                if (result.patternWarning) {
                    setWarning(result.patternWarning)
                    setTimeout(() => {
                        router.push('/account-deleted')
                    }, 2000)
                } else {
                    router.push('/account-deleted')
                }
            } else {
                if (result.blocked) {
                    setError(`계정이 일시적으로 차단되었습니다. ${result.blockedUntil ?
                        `(해제 예정: ${new Date(result.blockedUntil).toLocaleDateString()})` : ''}`)
                } else {
                    setError(result.error || '탈퇴 처리 중 오류가 발생했습니다')
                }

                if (result.patternWarning) {
                    setWarning(result.patternWarning)
                }
            }
        } catch (error) {
            console.error('Delete account error:', error)
            setError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
        } finally {
            setIsLoading(false)
        }
    }

    if (!user) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600 mb-4">로그인이 필요합니다.</p>
                <Link
                    href="/login?callbackUrl=/my-page/delete-account"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                    로그인하러 가기
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* 헤더 */}
            <div>
                <div className="flex items-center mb-4">
                    <Link href="/my-page" className="mr-4 p-2 rounded-md hover:bg-gray-200 transition-colors">
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">회원탈퇴</h1>
                </div>
                <p className="text-gray-600">정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
            </div>

            {/* 계정 타입 안내 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                    <Info className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-medium text-blue-800 mb-1">계정 정보</h3>
                        <p className="text-sm text-blue-700">
                            {user.signup_method === 'phone' && '전화번호로 가입한 계정입니다.'}
                            {user.signup_method === 'naver' && '네이버 계정으로 가입한 계정입니다. SNS 계정으로 가입하셨기 때문에 비밀번호 확인 없이 탈퇴가 가능합니다.'}
                            {user.signup_method === 'kakao' && '카카오 계정으로 가입한 계정입니다. SNS 계정으로 가입하셨기 때문에 비밀번호 확인 없이 탈퇴가 가능합니다.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* 경고 메시지 */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-medium text-red-800 mb-2">탈퇴 시 삭제되는 정보</h3>
                        <ul className="text-sm text-red-700 space-y-1">
                            <li className="flex items-start">
                                <Database className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                                모든 개인정보 (이름, 전화번호, 이메일 등)
                            </li>
                            <li className="flex items-start">
                                <MessageSquare className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                                SNS 계정 연결 정보
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* 재가입 제한 안내 */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <div className="flex">
                    <Clock className="h-5 w-5 text-amber-400 mr-3 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-medium text-amber-800 mb-2">재가입 제한 안내</h3>
                        <div className="text-sm text-amber-700">
                            <p className="mb-2">탈퇴 후 <strong>12시간 이내</strong>에는 동일한 정보로 재가입하실 수 없습니다.</p>
                            <p className="mb-2">이는 서비스 안정성과 보안을 위한 조치입니다.</p>
                            <p className="font-medium">만약 급하게 재가입이 필요하시다면, 02-861-3020로 문의 바랍니다.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 탈퇴 폼 */}
            <div className="bg-white rounded-lg shadow-md p-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                        <p className="text-red-800 text-sm">{error}</p>
                    </div>
                )}

                {warning && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                        <p className="text-yellow-800 text-sm">{warning}</p>
                    </div>
                )}

                {isPhoneUser ? (
                    <PhoneUserForm
                        onSubmit={handleDeleteRequest}
                        isLoading={isLoading}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                    />
                ) : (
                    <SocialUserForm
                        onSubmit={handleDeleteRequest}
                        isLoading={isLoading}
                    />
                )}
            </div>
        </div>
    )
}

// 전화번호 가입자용 폼 컴포넌트
function PhoneUserForm({
    onSubmit,
    isLoading,
    showPassword,
    setShowPassword
}: {
    onSubmit: (data: any, password?: string) => Promise<void>
    isLoading: boolean
    showPassword: boolean
    setShowPassword: (show: boolean) => void
}) {
    const form = useForm<PhoneDeleteData>({
        resolver: zodResolver(phoneDeleteSchema),
        defaultValues: {
            confirmDelete: false,
            agreeRestriction: false
        }
    })

    const handleSubmit = form.handleSubmit(async (data) => {
        if (isLoading) return
        await onSubmit(data, data.password)
    })

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* 비밀번호 입력 */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    현재 비밀번호 확인 *
                </label>
                <div className="relative">
                    <input
                        {...form.register('password')}
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${form.formState.errors.password
                                ? 'border-red-300 focus:border-red-500'
                                : 'border-gray-300 focus:border-blue-500'
                            }`}
                        placeholder="본인 확인을 위해 현재 비밀번호를 입력하세요"
                        disabled={isLoading}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={isLoading}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
                {form.formState.errors.password && (
                    <p className="mt-1 text-sm text-red-600">{form.formState.errors.password.message}</p>
                )}
            </div>

            <CommonFormFields form={form} isLoading={isLoading} />
            <FormButtons isLoading={isLoading} />
        </form>
    )
}

// SNS 가입자용 폼 컴포넌트
function SocialUserForm({
    onSubmit,
    isLoading
}: {
    onSubmit: (data: any, password?: string) => Promise<void>
    isLoading: boolean
}) {
    const form = useForm<SocialDeleteData>({
        resolver: zodResolver(socialDeleteSchema),
        defaultValues: {
            confirmDelete: false,
            agreeRestriction: false
        }
    })

    const handleSubmit = form.handleSubmit(async (data) => {
        if (isLoading) return
        await onSubmit(data, undefined)
    })

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <CommonFormFields form={form} isLoading={isLoading} />
            <FormButtons isLoading={isLoading} />
        </form>
    )
}

// 공통 폼 필드 컴포넌트
function CommonFormFields({ form, isLoading }: { form: any, isLoading: boolean }) {
    return (
        <>
            {/* 탈퇴 사유 */}
            <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                    탈퇴 사유 (선택사항)
                </label>
                <select
                    {...form.register('reason')}
                    id="reason"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoading}
                >
                    <option value="">선택하지 않음</option>
                    <option value="privacy_concern">개인정보 보호 우려</option>
                    <option value="service_dissatisfaction">서비스 불만족</option>
                    <option value="no_longer_needed">더 이상 필요하지 않음</option>
                    <option value="duplicate_account">중복 계정</option>
                    <option value="other">기타</option>
                </select>
            </div>

            {/* 상세 사유 */}
            <div>
                <label htmlFor="reasonDetail" className="block text-sm font-medium text-gray-700 mb-1">
                    상세 사유 (선택사항)
                </label>
                <textarea
                    {...form.register('reasonDetail')}
                    id="reasonDetail"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="탈퇴 사유를 자세히 알려주시면 서비스 개선에 도움이 됩니다"
                    disabled={isLoading}
                />
            </div>

            {/* 재가입 제한 동의 */}
            <div className="flex items-start">
                <input
                    {...form.register('agreeRestriction')}
                    type="checkbox"
                    id="agreeRestriction"
                    className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={isLoading}
                />
                <label htmlFor="agreeRestriction" className="ml-2 text-sm text-gray-700">
                    탈퇴 후 12시간 동안 재가입이 제한됨을 이해하고 동의합니다 *
                </label>
            </div>
            {form.formState.errors.agreeRestriction && (
                <p className="text-sm text-red-600">{form.formState.errors.agreeRestriction.message}</p>
            )}

            {/* 최종 확인 */}
            <div className="flex items-start">
                <input
                    {...form.register('confirmDelete')}
                    type="checkbox"
                    id="confirmDelete"
                    className="mt-0.5 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    disabled={isLoading}
                />
                <label htmlFor="confirmDelete" className="ml-2 text-sm text-gray-700">
                    위 내용을 모두 확인했으며, 계정을 완전히 삭제하는 것에 동의합니다 *
                </label>
            </div>
            {form.formState.errors.confirmDelete && (
                <p className="text-sm text-red-600">{form.formState.errors.confirmDelete.message}</p>
            )}
        </>
    )
}

// 공통 버튼 컴포넌트
function FormButtons({ isLoading }: { isLoading: boolean }) {
    return (
        <div className="flex space-x-4 pt-4">
            <Link
                href="/my-page"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center"
            >
                취소
            </Link>
            <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? '처리 중...' : '회원탈퇴'}
            </button>
        </div>
    )
}