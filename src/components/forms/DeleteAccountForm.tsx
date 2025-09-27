// src/app/(site)/my-page/delete-account/components/DeleteAccountForm.tsx
'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  UserMinus, 
  Loader2, 
  ArrowLeft,
  Shield,
  Database,
  MessageSquare,
  Clock
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { deleteAccountSchema, type DeleteAccountData } from '@/lib/validations/auth'
import { deleteAccount } from '@/app/(site)/my-page/delete-account/actions'

type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>

const DELETION_REASONS = {
  privacy_concern: '개인정보 보호 우려',
  service_dissatisfaction: '서비스 불만족',
  no_longer_needed: '더 이상 필요하지 않음',
  duplicate_account: '중복 계정',
  other: '기타'
} as const

export function DeleteAccountForm() {
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
      confirmDelete: false,
      agreeRestriction: false
    }
  })

  const selectedReason = watch('reason')
  const isLoading = isSubmitting || isPending

  const onSubmit = async (data: DeleteAccountFormData) => {
    setError(null)
    setWarning(null)

    startTransition(async () => {
      try {
        const result = await deleteAccount({
          password: data.password,
          reason: data.reason,
          reasonDetail: data.reasonDetail,
          confirmDelete: data.confirmDelete
        })

        if (result.success) {
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
            setError(`${result.error} ${result.blockedUntil ? 
              `(해제 예정: ${new Date(result.blockedUntil).toLocaleDateString()})` : ''}`)
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
    <>
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
              <li className="flex items-start">
                <Shield className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                로그인 세션 및 인증 정보
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 재가입 제한 안내 */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
        <div className="flex">
          <Clock className="h-5 w-5 text-amber-400 mr-3 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-amber-800 mb-2">
              재가입 제한 안내
            </h3>
            <div className="text-sm text-amber-700">
              <p className="mb-2">
                탈퇴 후 <strong>12시간 이내</strong>에는 동일한 정보로 재가입하실 수 없습니다.
              </p>
              <p className="mb-2">
                이는 서비스 안정성과 보안을 위한 조치입니다.
              </p>
              <p className="font-medium">
                만약 급하게 재가입이 필요하시다면, 탈퇴 전에 신중히 고려해주세요.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 탈퇴 폼 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* 경고 메시지 */}
          {warning && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-yellow-800 text-sm">{warning}</p>
            </div>
          )}

          {/* 현재 비밀번호 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              현재 비밀번호 확인 *
            </label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                id="password"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password 
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
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* 탈퇴 사유 */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
              탈퇴 사유 (선택사항)
            </label>
            <select
              {...register('reason')}
              id="reason"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
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
              <label htmlFor="reasonDetail" className="block text-sm font-medium text-gray-700 mb-1">
                상세 사유 (선택사항)
              </label>
              <textarea
                {...register('reasonDetail')}
                id="reasonDetail"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="탈퇴 사유를 자세히 알려주시면 서비스 개선에 도움이 됩니다"
                disabled={isLoading}
              />
              {errors.reasonDetail && (
                <p className="text-red-600 text-sm mt-1">{errors.reasonDetail.message}</p>
              )}
            </div>
          )}

          {/* 재가입 제한 동의 */}
          <div className="flex items-start">
            <input
              {...register('agreeRestriction')}
              type="checkbox"
              id="agreeRestriction"
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={isLoading}
            />
            <label htmlFor="agreeRestriction" className="ml-2 text-sm text-gray-700">
              탈퇴 후 <strong>12시간 이내 재가입 제한</strong>에 대해 안내받았으며 이에 동의합니다 *
            </label>
          </div>
          {errors.agreeRestriction && (
            <p className="text-red-600 text-sm">{errors.agreeRestriction.message}</p>
          )}

          {/* 탈퇴 확인 */}
          <div className="flex items-start">
            <input
              {...register('confirmDelete')}
              type="checkbox"
              id="confirmDelete"
              className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              disabled={isLoading}
            />
            <label htmlFor="confirmDelete" className="ml-2 text-sm text-gray-700">
              위 내용을 모두 확인했으며, <strong>정말로 탈퇴하겠습니다</strong> *
            </label>
          </div>
          {errors.confirmDelete && (
            <p className="text-red-600 text-sm">{errors.confirmDelete.message}</p>
          )}

          {/* 제출 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  탈퇴 처리 중...
                </>
              ) : (
                <>
                  <UserMinus className="h-4 w-4 mr-2" />
                  회원 탈퇴
                </>
              )}
            </button>
            
            <Link
              href="/my-page"
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-center"
            >
              취소
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}