// components/registration/RegistrationForm.tsx
'use client'

import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import type { User } from '@/types/auth'

interface Program {
  id: string
  name: string
  category: string
  time: string
}

interface RegistrationFormProps {
  user: User
  programs: Program[]
}

interface FormData {
  participantType: string
  email: string
  companions: number
  companionDetails: string
  selectedPrograms: string[]
  specialRequests: string
  privacyConsent: boolean
  marketingConsent: boolean
  smsConsent: boolean
}

export default function RegistrationForm({ user, programs }: RegistrationFormProps) {
  const router = useRouter()
  const { refreshUser } = useAuth()
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    defaultValues: {
      participantType: '',
      email: '',
      companions: 0,
      companionDetails: '',
      selectedPrograms: [],
      specialRequests: '',
      privacyConsent: false,
      marketingConsent: false,
      smsConsent: false,
    },
    mode: 'onChange' // 실시간 유효성 검사
  })

  // watch를 사용하여 특정 필드 값 감시
  const companions = watch('companions')
  const selectedPrograms = watch('selectedPrograms')
  const privacyConsent = watch('privacyConsent')

  const participantTypes = [
    { id: 'citizen', name: '일반 시민/가족', description: '서울시민 및 가족 단위 참가자' },
    { id: 'single-parent', name: '한부모가족', description: '한부모가족 당사자 및 자녀' },
    { id: 'self-help', name: '자조모임', description: '한부모가족 자조모임 및 단체' },
    { id: 'volunteer', name: '자원봉사자', description: '축제 자원봉사 참여자' },
    { id: 'organization', name: '기관 관계자', description: '협력기관 및 후원기관 관계자' },
  ]

  const programsByCategory = programs.reduce((acc, program) => {
    if (!acc[program.category]) {
      acc[program.category] = []
    }
    acc[program.category].push(program)
    return acc
  }, {} as Record<string, Program[]>)

  // 프로그램 토글 함수
  const handleProgramToggle = (programId: string) => {
    const currentPrograms = selectedPrograms || []
    const newPrograms = currentPrograms.includes(programId)
      ? currentPrograms.filter(id => id !== programId)
      : [...currentPrograms, programId]
    
    setValue('selectedPrograms', newPrograms, { shouldValidate: true })
  }

  // 폼 제출 성공 처리
  const onSubmit = async (data: FormData) => {
    try {
    //   const response = await fetch('/api/registration', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       userId: user.id,
    //       name: user.name,
    //       phone: user.phone,
    //       ...data,
    //     }),
    //   })

    //   if (response.ok) {
    //     const { registrationId } = await response.json()
    //     router.push(`/registration/success?id=${registrationId}`)
    //   } else {
    //     const errorData = await response.json()
    //     throw new Error(errorData.error || '신청 처리 중 오류가 발생했습니다.')
    //   }
    alert(
        JSON.stringify(data)
    )
    } catch (error) {
      console.error('Registration error:', error)
      alert(error instanceof Error ? error.message : '신청 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  // 폼 유효성 검사 실패 처리
  const onError = (errors: any) => {
    console.error('Form validation errors:', errors)
    
    // 첫 번째 에러 필드로 스크롤 및 포커스
    const firstErrorField = Object.keys(errors)[0]
    if (firstErrorField) {
      const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.focus()
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-8">
      {/* 1. 참가자 정보 (수정 불가) */}
      <section className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">참가자 정보</h3>
          <p className="text-sm text-gray-600">
            로그인된 계정 정보로 자동 입력됩니다. (수정 불가)
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              성명 *
            </label>
            <input
              type="text"
              value={user.name}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              연락처 *
            </label>
            <input
              type="tel"
              value={user.phone}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>
      </section>

      {/* 2. 참가 대상 선택 */}
      <section className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">참가 대상 *</h3>
          <p className="text-sm text-gray-600">
            해당하는 참가 대상을 선택해주세요.
          </p>
        </div>
        
        <Controller
          name="participantType"
          control={control}
          rules={{ required: '참가 대상을 선택해주세요.' }}
          render={({ field }) => (
            <div className="space-y-3">
              {participantTypes.map((type) => (
                <label
                  key={type.id}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    field.value === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      {...field}
                      value={type.id}
                      checked={field.value === type.id}
                      className="mt-1 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{type.name}</div>
                      <div className="text-sm text-gray-600">{type.description}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        />
        {errors.participantType && (
          <p className="text-red-600 text-sm mt-1" role="alert">
            {errors.participantType.message}
          </p>
        )}
      </section>

      {/* 3. 연락 정보 */}
      <section className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">연락 정보</h3>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            이메일 주소 *
          </label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: '이메일 주소를 입력해주세요.',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: '올바른 이메일 형식이 아닙니다.'
              }
            })}
            placeholder="example@email.com"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : 'email-help'}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p id="email-error" className="text-red-600 text-sm mt-1" role="alert">
              {errors.email.message}
            </p>
          )}
          <p id="email-help" className="text-sm text-gray-500 mt-1">
            신청 확인 및 축제 안내를 위해 사용됩니다.
          </p>
        </div>
      </section>

      {/* 4. 동반 참가자 */}
      <section className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">동반 참가자</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="companions" className="block text-sm font-medium text-gray-700 mb-2">
              동반 인원 (본인 제외)
            </label>
            <select
              id="companions"
              {...register('companions', {
                valueAsNumber: true,
                min: { value: 0, message: '동반 인원은 0명 이상이어야 합니다.' },
                max: { value: 10, message: '동반 인원은 10명을 초과할 수 없습니다.' }
              })}
              aria-invalid={errors.companions ? 'true' : 'false'}
              aria-describedby={errors.companions ? 'companions-error' : undefined}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.companions ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num}명</option>
              ))}
            </select>
            {errors.companions && (
              <p id="companions-error" className="text-red-600 text-sm mt-1" role="alert">
                {errors.companions.message}
              </p>
            )}
          </div>
          
          {companions > 0 && (
            <div className="md:col-span-2">
              <label htmlFor="companionDetails" className="block text-sm font-medium text-gray-700 mb-2">
                동반자 세부사항 (선택)
              </label>
              <textarea
                id="companionDetails"
                {...register('companionDetails')}
                placeholder="동반자의 나이대, 특별 요청사항 등을 적어주세요. (예: 아동 2명, 휠체어 이용자 1명)"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>
      </section>

      {/* 5. 관심 프로그램 */}
      <section className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">관심 프로그램</h3>
          <p className="text-sm text-gray-600">
            참여하고 싶은 프로그램을 모두 선택해주세요. (중복 선택 가능)
          </p>
        </div>
        
        <div className="space-y-6">
          {Object.entries(programsByCategory).map(([category, categoryPrograms]) => (
            <fieldset key={category} className="space-y-3">
              <legend className="text-lg font-semibold text-gray-800 capitalize">
                {category}
              </legend>
              <div className="grid md:grid-cols-2 gap-3">
                {categoryPrograms.map((program) => (
                  <label
                    key={program.id}
                    className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedPrograms?.includes(program.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedPrograms?.includes(program.id) || false}
                      onChange={() => handleProgramToggle(program.id)}
                      className="mt-1 text-blue-600 focus:ring-blue-500"
                      aria-describedby={`program-${program.id}-time`}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{program.name}</div>
                      <div id={`program-${program.id}-time`} className="text-sm text-gray-600">
                        {program.time}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      </section>

      {/* 6. 특별 요청사항 */}
      <section className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">특별 요청사항</h3>
        </div>
        
        <div>
          <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-2">
            기타 요청사항 (선택)
          </label>
          <textarea
            id="specialRequests"
            {...register('specialRequests')}
            placeholder="접근성 지원, 알레르기, 기타 도움이 필요한 사항을 적어주세요."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </section>

      {/* 7. 개인정보 동의 */}
      <section className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">개인정보 처리 동의</h3>
        </div>
        
        <fieldset className="space-y-4">
          <legend className="sr-only">개인정보 처리 동의</legend>
          
          {/* 필수 동의 */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                {...register('privacyConsent', {
                  required: '개인정보 수집·이용에 동의해주세요.'
                })}
                aria-invalid={errors.privacyConsent ? 'true' : 'false'}
                aria-describedby={errors.privacyConsent ? 'privacy-error' : 'privacy-details'}
                className="mt-1 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-800 mb-1">
                  개인정보 수집·이용 동의 (필수) *
                </div>
                <div id="privacy-details" className="text-sm text-gray-600 space-y-1">
                  <p>• 수집항목: 성명, 연락처, 이메일, 참가 정보</p>
                  <p>• 이용목적: 축제 참가 관리, 안내사항 전달, 안전관리</p>
                  <p>• 보유기간: 축제 종료 후 1년 (법정 보관기간 준수)</p>
                  <p>• 동의거부권: 동의를 거부할 수 있으나, 축제 참가신청이 제한됩니다.</p>
                </div>
              </div>
            </label>
            {errors.privacyConsent && (
              <p id="privacy-error" className="text-red-600 text-sm mt-2" role="alert">
                {errors.privacyConsent.message}
              </p>
            )}
          </div>

          {/* 선택 동의 */}
          <div className="space-y-3">
            <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
              <input
                type="checkbox"
                {...register('marketingConsent')}
                className="mt-1 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-800">이메일 수신 동의 (선택)</div>
                <div className="text-sm text-gray-600">
                  축제 관련 소식 및 이벤트 정보를 이메일로 받아보시겠습니까?
                </div>
              </div>
            </label>

            <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
              <input
                type="checkbox"
                {...register('smsConsent')}
                className="mt-1 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-800">SMS 수신 동의 (선택)</div>
                <div className="text-sm text-gray-600">
                  축제 당일 긴급 안내사항을 문자로 받아보시겠습니까?
                </div>
              </div>
            </label>
          </div>
        </fieldset>
      </section>

      {/* 제출 버튼 */}
      <div className="pt-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            뒤로 가기
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !privacyConsent}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-festival-blue to-festival-purple text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
        
        <p className="text-sm text-gray-500 mt-4 text-center">
          신청 완료 후 입력하신 이메일과 휴대폰으로 확인 안내를 보내드립니다.
        </p>
      </div>
    </form>
  )
}