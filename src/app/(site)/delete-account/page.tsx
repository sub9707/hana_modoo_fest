'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { 
  AlertTriangle, 
  Lock, 
  Eye, 
  EyeOff, 
  UserMinus, 
  Loader2, 
  ArrowLeft,
  Shield,
  Database,
  MessageSquare
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

// 탈퇴 폼 스키마
const deleteAccountSchema = z.object({
  password: z.string().min(1, '현재 비밀번호를 입력해주세요'),
  reason: z.enum([
    'privacy_concern',
    'service_dissatisfaction', 
    'no_longer_needed',
    'duplicate_account',
    'other'
  ]).optional(),
  reasonDetail: z.string()
    .max(500, '상세 사유는 500자 이내로 입력해주세요')
    .optional(),
  confirmDelete: z.boolean()
    .refine(val => val === true, '탈퇴 확인이 필요합니다')
})

type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>

const DELETION_REASONS = {
  privacy_concern: '개인정보 보호 우려',
  service_dissatisfaction: '서비스 불만족',
  no_longer_needed: '더 이상 필요하지 않음',
  duplicate_account: '중복 계정',
  other: '기타'
} as const

export default function DeleteAccountPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { user, logout } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      password: '',
      reason: undefined,
      reasonDetail: '',
      confirmDelete: false
    }
  })

  const selectedReason = watch('reason')
  const isLoading = isSubmitting || isPending

  const onSubmit = async (data: DeleteAccountFormData) => {
    setError(null)
    setWarning(null)

    startTransition(async () => {
      try {
        const response = await fetch('/api/auth/delete-account', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(data)
        })

        const result = await response.json()

        if (response.ok) {
          // 패턴 경고가 있는 경우 표시
          if (result.patternWarning) {
            setWarning(result.patternWarning)
          }

          // 로그아웃 처리
          logout()
          
          // 탈퇴 완료 페이지로 이동
          router.push('/account-deleted?success=true')

        } else {
          if (result.blocked) {
            // 블랙리스트된 경우
            setError(`${result.error} ${result.blockedUntil ? `(해제 예정: ${new Date(result.blockedUntil).toLocaleDateString()})` : ''}`)
          } else {
            setError(result.error || '탈퇴 처리 중 오류가 발생했습니다')
          }
        }

      } catch (error) {
        console.error('Delete account error:', error)
        setError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
      }
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">로그인이 필요합니다.</p>
          <Link 
            href="/login" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            로그인하러 가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link 
              href="/my-page" 
              className="mr-4 p-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">회원탈퇴</h1>
          </div>
          <p className="text-gray-600">
            정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </p>
        </div>

        {/* 경고 메시지 */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800 mb-2">
                탈퇴 시 삭제되는 정보
              </h3>
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
              <p className="text-sm text-red-700 mt-3 font-medium">
                ⚠️ 탈퇴 후에는 동일한 정보로 재가입하실 수 있습니다. 
                다만, 악의적 사용이 감지될 경우 일시적으로 가입이 제한될 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 탈퇴 폼 */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* 오류/경고 메시지 */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {warning && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm">
                  {warning}
                </div>
              )}

              {/* 현재 비밀번호 */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  현재 비밀번호 확인 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    disabled={isLoading}
                    className={`
                      appearance-none block w-full pl-10 pr-12 py-2 border rounded-lg shadow-sm 
                      placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 
                      focus:border-red-500 sm:text-sm transition-colors
                      ${errors.password
                        ? 'border-red-300 text-red-900'
                        : 'border-gray-300 text-gray-900'
                      }
                      ${isLoading ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
                    `}
                    placeholder="비밀번호를 입력하여 본인 확인"
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
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* 탈퇴 사유 */}
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                  탈퇴 사유 (선택사항)
                </label>
                <select
                  {...register('reason')}
                  disabled={isLoading}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm disabled:bg-gray-50"
                >
                  <option value="">선택해주세요</option>
                  {Object.entries(DELETION_REASONS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              {/* 상세 사유 */}
              {selectedReason && (
                <div>
                  <label htmlFor="reasonDetail" className="block text-sm font-medium text-gray-700 mb-2">
                    상세 사유 (선택사항)
                  </label>
                  <textarea
                    {...register('reasonDetail')}
                    disabled={isLoading}
                    rows={4}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm disabled:bg-gray-50 resize-none"
                    placeholder="구체적인 사유를 알려주시면 서비스 개선에 도움이 됩니다 (최대 500자)"
                  />
                  {errors.reasonDetail && (
                    <p className="mt-1 text-sm text-red-600">{errors.reasonDetail.message}</p>
                  )}
                </div>
              )}

              {/* 확인 체크박스 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      {...register('confirmDelete')}
                      type="checkbox"
                      disabled={isLoading}
                      className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300 rounded disabled:opacity-50"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="confirmDelete" className="font-medium text-gray-700">
                      위 내용을 모두 확인했으며, 회원탈퇴에 동의합니다
                    </label>
                    <p className="text-gray-500 mt-1">
                      탈퇴 처리 후에는 모든 개인정보가 즉시 삭제되며, 복구할 수 없습니다.
                    </p>
                  </div>
                </div>
                {errors.confirmDelete && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmDelete.message}</p>
                )}
              </div>

              {/* 버튼 영역 */}
              <div className="flex items-center justify-between pt-6">
                <Link
                  href="/my-page"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  취소
                </Link>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`
                    inline-flex items-center px-6 py-2 border border-transparent 
                    text-sm font-medium rounded-md text-white transition-all duration-200
                    ${isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 hover:shadow-lg'
                    }
                  `}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <UserMinus className="h-4 w-4 mr-2" />
                  )}
                  {isLoading ? '처리 중...' : '회원탈퇴'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* 하단 안내 */}
        <div className="mt-8 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              탈퇴를 원하지 않으시나요?
            </h3>
            <p className="text-sm text-blue-700">
              계정을 유지하면서 일시적으로 서비스 이용을 중단하고 싶으시다면, 
              로그아웃 후 필요할 때 다시 로그인하시면 됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}