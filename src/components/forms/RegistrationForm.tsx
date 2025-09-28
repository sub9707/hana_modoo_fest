'use client'

import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { User } from '@/types/auth'
import type { RegistrationFormData, AddressSearchResult } from '@/types/registration'
import KakaoAddressSearch from './KakaoAddressSearch'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

interface RegistrationFormProps {
  user: User
}

export default function RegistrationForm({ user }: RegistrationFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors }
  } = useForm<RegistrationFormData>({
    defaultValues: {
      participant_type: 'citizen',
      companions: 0,
      companion_details: '',
      address: '',
      address_detail: '',
      zip_code: '',
      special_requests: '',
      privacy_consent: false,
      marketing_consent: false,
    },
    mode: 'onChange'
  })

  const companions = watch('companions')
  const address = watch('address')
  const privacyConsent = watch('privacy_consent')

  const participantTypes = [
    { id: 'citizen', name: '일반 시민/가족', description: '서울시민 및 가족 단위 참가자' },
    { id: 'single-parent', name: '한부모가족', description: '한부모가족 당사자 및 자녀' },
    { id: 'self-help', name: '자조모임', description: '한부모가족 자조모임 및 단체' },
    { id: 'volunteer', name: '자원봉사자', description: '축제 자원봉사 참여자' },
    { id: 'organization', name: '기관 관계자', description: '협력기관 및 후원기관 관계자' },
  ]

  // 주소 선택 시 처리
  const handleAddressSelect = (addressData: AddressSearchResult) => {
    setValue('address', addressData.address, { shouldValidate: true })
    setValue('zip_code', addressData.zip_code, { shouldValidate: true })
    // 상세주소 입력 필드로 포커스 이동
    setTimeout(() => {
      const detailInput = document.getElementById('address_detail')
      detailInput?.focus()
    }, 100)
  }

  // 폼 제출 처리
  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        router.push(`/registration/success?id=${result.registrationId}`)
      } else {
        throw new Error(result.error || '신청 처리 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert(error instanceof Error ? error.message : '신청 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 font-paper">
      {/* 1. 사용자 기본 정보 표시 */}
      <section className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">신청자 정보</h3>
          <p className="text-sm text-gray-600">
            로그인된 계정 정보로 자동 입력됩니다.
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">이름</label>
              <input
                type="text"
                value={user.name}
                disabled
                className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">전화번호</label>
              <input
                type="text"
                value={user.phone}
                disabled
                className="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. 참가 유형 선택 */}
      <section className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">참가 유형 *</h3>
          <p className="text-sm text-gray-600">
            해당하는 참가 유형을 선택해주세요.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {participantTypes.map((type) => (
            <label
              key={type.id}
              className={`
                relative flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all
                ${watch('participant_type') === type.id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-300 hover:bg-orange-25'
                }
              `}
            >
              <input
                type="radio"
                value={type.id}
                {...register('participant_type', { required: '참가 유형을 선택해주세요.' })}
                className="sr-only"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{type.name}</div>
                <div className="text-sm text-gray-600 mt-1">{type.description}</div>
              </div>
              {watch('participant_type') === type.id && (
                <div className="absolute top-4 right-4 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </label>
          ))}
        </div>
        {errors.participant_type && (
          <p className="text-red-600 text-sm" role="alert">
            {errors.participant_type.message}
          </p>
        )}
      </section>

      {/* 3. 동반자 정보 */}
      <section className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">동반자 정보</h3>
          <p className="text-sm text-gray-600">
            함께 참석할 동반자 정보를 입력해주세요. (본인 제외)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="companions" className="block text-sm font-medium text-gray-700 mb-2">
              동반자 수 (본인 제외) *
            </label>
            <select
              id="companions"
              {...register('companions', {
                valueAsNumber: true,
                min: { value: 0, message: '동반자 수는 0명 이상이어야 합니다.' },
                max: { value: 10, message: '동반 인원은 10명을 초과할 수 없습니다.' }
              })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.companions ? 'border-red-300' : 'border-gray-300'
                }`}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num}명</option>
              ))}
            </select>
            {errors.companions && (
              <p className="text-red-600 text-sm mt-1" role="alert">
                {errors.companions.message}
              </p>
            )}
          </div>

          {companions > 0 && (
            <div className="md:col-span-2">
              <label htmlFor="companion_details" className="block text-sm font-medium text-gray-700 mb-2">
                동반자 세부사항 (선택)
              </label>
              <textarea
                id="companion_details"
                {...register('companion_details')}
                placeholder="동반자의 나이대, 특별 요청사항 등을 적어주세요. (예: 아동 2명, 휠체어 이용자 1명)"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          )}
        </div>
      </section>

      {/* 4. 경품 수령 주소 */}
      <section className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">경품 수령 주소 *</h3>
          <p className="text-sm text-orange-600 font-medium">
            ⚠️ 행사 경품을 받을 주소입니다. 정확히 입력해주세요!
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              우편번호 및 주소 *
            </label>
            <Controller
              name="address"
              control={control}
              rules={{ required: '주소를 입력해주세요.' }}
              render={({ field }) => (
                <KakaoAddressSearch
                  onAddressSelect={handleAddressSelect}
                  value={field.value}
                  className={errors.address ? 'border-red-300' : ''}
                />
              )}
            />
            {errors.address && (
              <p className="text-red-600 text-sm mt-1" role="alert">
                {errors.address.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="address_detail" className="block text-sm font-medium text-gray-700 mb-2">
              상세주소 (동/호수)
            </label>
            <input
              id="address_detail"
              type="text"
              {...register('address_detail')}
              placeholder="상세주소를 입력해주세요 (예: 101동 202호)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {address && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="text-sm text-orange-800">
                <div className="font-medium">입력된 주소:</div>
                <div className="mt-1">
                  [{watch('zip_code')}] {address}
                  {watch('address_detail') && ` ${watch('address_detail')}`}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. 특별 요청사항 */}
      <section className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">특별 요청사항</h3>
        </div>

        <div>
          <label htmlFor="special_requests" className="block text-sm font-medium text-gray-700 mb-2">
            기타 요청사항 (선택)
          </label>
          <textarea
            id="special_requests"
            {...register('special_requests')}
            placeholder="접근성 지원, 알레르기, 기타 도움이 필요한 사항을 적어주세요."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </section>

      {/* 6. 개인정보 및 마케팅 동의 */}
      <section className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">개인정보 처리 동의</h3>
          <p className="text-sm text-gray-600">
            모두하나대축제 2025 참가를 위한 개인정보 수집 및 이용에 대한 동의입니다.
          </p>
        </div>

        {/* 개인정보 처리방침 요약 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">
              개인정보 처리 주요 내용
            </h4>
            <div className="text-xs text-blue-700 space-y-1 mb-3">
              <p><strong>수집목적:</strong> 축제 참가신청, 본인확인, 행사안내, 경품배송</p>
              <p><strong>수집항목:</strong> 이름, 성별, 생년월일, 휴대폰, 주소 등</p>
              <p><strong>보유기간:</strong> 목적 달성 후 지체없이 파기 (법령에 따라 일부 보관)</p>
            </div>
            <Link
              href="/privacy-policy"
              target="_blank"
              className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline"
            >
              전체 개인정보 처리방침 보기
              <ExternalLink className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          {/* 필수 동의 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="privacy_consent"
                {...register('privacy_consent', { required: '개인정보 수집 및 이용에 동의해주세요.' })}
                className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="privacy_consent" className="ml-3 text-sm text-gray-700 flex-1">
                <span className="font-medium text-red-600">* [필수]</span> 개인정보 수집 및 이용에 동의합니다.
                <div className="mt-2 text-xs text-gray-500 bg-gray-50 rounded p-2">
                  <p><strong>수집·이용 목적:</strong> 축제 참가신청 접수, 본인확인, 행사 안내</p>
                  <p><strong>수집 항목:</strong> 이름, 성별, 생년월일, 휴대폰번호, 주소</p>
                  <p><strong>보유 기간:</strong> 참가신청 목적 달성 후 3년간 보관</p>
                  <p className="text-red-600 mt-1">
                    * 동의를 거부할 권리가 있으나, 거부 시 축제 참가신청이 제한됩니다.
                  </p>
                </div>
              </label>
            </div>
            {errors.privacy_consent && (
              <p className="text-red-600 text-sm mt-2 ml-7" role="alert">
                {errors.privacy_consent.message}
              </p>
            )}
          </div>

          {/* 선택 동의 */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="marketing_consent"
                {...register('marketing_consent')}
                className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="marketing_consent" className="ml-3 text-sm text-gray-700 flex-1">
                <span className="font-medium text-gray-600">[선택]</span> 마케팅 정보 수신에 동의합니다.
                <div className="mt-2 text-xs text-gray-500 bg-gray-50 rounded p-2">
                  <p><strong>수집·이용 목적:</strong> 신규 서비스 및 이벤트 정보 제공</p>
                  <p><strong>수집 항목:</strong> 이름, 휴대폰번호, 이메일</p>
                  <p><strong>보유 기간:</strong> 동의 철회 시까지</p>
                  <p className="text-gray-600 mt-1">
                    * 동의하지 않아도 기본 서비스 이용에는 제한이 없습니다.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* 카카오 로그인 관련 추가 안내 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-yellow-800 mb-2">
            SNS 로그인 개인정보 처리 안내
          </h4>
          <div className="text-xs text-yellow-700 space-y-1">
            <p><strong>카카오 로그인 시:</strong> 카카오 계정 정보, 프로필, 이메일 등이 제공됩니다.</p>
            <p><strong>네이버 로그인 시:</strong> 네이버 계정 정보, 프로필, 이메일 등이 제공됩니다.</p>
            <p className="mt-2">
              SNS 로그인으로 제공받은 정보는 회원가입 및 서비스 이용 목적으로만 사용되며,
              각 플랫폼의 개인정보 처리방침도 함께 적용됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* 제출 버튼 */}
      <div className="pt-6">
        <button
          type="submit"
          disabled={isSubmitting || !privacyConsent}
          className={`
            w-full flex justify-center py-4 px-6 border border-transparent 
            text-lg font-bold rounded-xl text-white transition-all duration-200
            ${isSubmitting || !privacyConsent
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 hover:shadow-lg transform hover:scale-[1.02]'
            }
          `}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              신청 처리 중...
            </span>
          ) : (
            '사전참가 신청하기'
          )}
        </button>
      </div>
    </form>
  )
}