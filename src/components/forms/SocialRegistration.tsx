'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, User, Loader2, AlertCircle, Search, Phone, Calendar, Shield, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface SocialRegistrationProps {
  socialData: {
    provider: 'naver' | 'kakao'
    id: string
    email?: string
    name?: string
    profileImage?: string
    gender?: string
    birthday?: string
    mobile?: string
    birthyear?: string
  } | null
  onComplete: () => void
  onBack: () => void
}

// 약관 동의 포함한 스키마
const socialUserInfoSchema = z.object({
  address: z.string().min(1, '주소를 입력해주세요'),
  addressDetail: z.string().optional(),
  zipCode: z.string().min(5, '우편번호를 입력해주세요'),
  name: z.string().min(2, '이름을 입력해주세요').optional(),
  phone: z.string()
    .min(11, '전화번호를 올바르게 입력해주세요')
    .regex(/^01[0-9]{9}$/, '올바른 전화번호 형식이 아닙니다')
    .optional(),
  gender: z.enum(['male', 'female', 'none'], { message: '성별을 선택해주세요' }).optional(),
  birthDate: z.string()
    .optional()
    .refine((val) => {
      // 빈 문자열이거나 undefined면 통과
      if (!val || val === '') return true
      // 값이 있으면 YYYY-MM-DD 형식 체크
      return /^\d{4}-\d{2}-\d{2}$/.test(val)
    }, {
      message: '올바른 날짜 형식이 아닙니다 (YYYY-MM-DD)'
    }),
  // 약관 동의
  agreedToTerms: z.boolean().refine(val => val === true, {
    message: '서비스 이용약관에 동의해주세요'
  }),
  agreedToPrivacy: z.boolean().refine(val => val === true, {
    message: '개인정보 처리방침에 동의해주세요'
  }),
  agreedToMarketing: z.boolean().optional(),
  parentalConsent: z.boolean().optional()
}).superRefine((data, ctx) => {
  const socialData = (window as any).__tempSocialData

  // 이름 체크: 소셜에서 제공하지 않은 경우만 필수
  if (!socialData?.name && !data.name) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '이름을 입력해주세요',
      path: ['name']
    })
  }

  // 전화번호 체크: 소셜에서 제공하지 않은 경우만 필수
  if (!socialData?.mobile && !data.phone) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '전화번호를 입력해주세요',
      path: ['phone']
    })
  }

  // 성별 체크: 소셜에서 제공하지 않은 경우만 필수
  if ((!socialData?.gender || socialData.gender === 'none') && !data.gender) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '성별을 선택해주세요',
      path: ['gender']
    })
  }

  // 생년월일 체크: 소셜에서 제공하지 않은 경우만 필수
  if ((!socialData?.birthyear || !socialData?.birthday) && !data.birthDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '생년월일을 입력해주세요',
      path: ['birthDate']
    })
  }
})

type SocialUserInfoFormData = z.infer<typeof socialUserInfoSchema>

export default function SocialRegistration({
  socialData,
  onComplete,
  onBack
}: SocialRegistrationProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const searchParams = new URLSearchParams(window.location.search)
  const originalRedirect = searchParams.get('redirect') || '/'

  const missingInfo = {
    name: !socialData?.name,
    phone: !socialData?.mobile,
    gender: !socialData?.gender || socialData.gender === 'none',
    birthDate: !socialData?.birthyear || !socialData?.birthday
  }

  const form = useForm<SocialUserInfoFormData>({
    resolver: zodResolver(socialUserInfoSchema),
    defaultValues: {
      address: '',
      addressDetail: '',
      zipCode: '',
      name: socialData?.name || '',
      phone: socialData?.mobile?.replace(/-/g, '') || '',
      gender: socialData?.gender === 'M' ? 'male' : socialData?.gender === 'F' ? 'female' : 'none',
      birthDate: socialData?.birthyear && socialData?.birthday
        ? (() => {
            // 네이버 birthday 형식 처리: "02-15" 또는 "0215"
            const birthday = socialData.birthday.replace(/-/g, '') // 하이픈 제거
            const month = birthday.substring(0, 2)
            const day = birthday.substring(2, 4)
            return `${socialData.birthyear}-${month}-${day}`
          })()
        : '',
      agreedToTerms: false,
      agreedToPrivacy: false,
      agreedToMarketing: false,
      parentalConsent: false
    }
  })

  useEffect(() => {
    if (socialData) {
      (window as any).__tempSocialData = socialData
    }
  }, [socialData])

  useEffect(() => {
    const script = document.createElement('script')
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    script.async = true
    script.onload = () => setIsKakaoLoaded(true)
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleAddressSearch = () => {
    if (!isKakaoLoaded || !(window as any).daum) {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
      return
    }

    new (window as any).daum.Postcode({
      oncomplete: function (data: any) {
        form.setValue('address', data.address, { shouldValidate: true })
        form.setValue('zipCode', data.zonecode, { shouldValidate: true })
      }
    }).open()
  }

  const handleSubmit = async (data: SocialUserInfoFormData) => {
    console.log('=== Form Submit Started ===')
    console.log('Form Data:', data)
    console.log('Form Errors:', form.formState.errors)
    console.log('Social Data:', socialData)

    if (!socialData) {
      setError('SNS 인증 정보를 찾을 수 없습니다.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const finalData = {
        name: socialData.name || data.name,
        phone: socialData.mobile?.replace(/-/g, '') || data.phone,
        gender: socialData.gender === 'M' ? 'male' : socialData.gender === 'F' ? 'female' : data.gender,
        email: socialData.email,
        profileImage: socialData.profileImage,
        signupMethod: socialData.provider,
        socialId: socialData.id,
        birthDate: socialData.birthyear && socialData.birthday
          ? (() => {
              // 네이버 birthday 형식 처리: "02-15" 또는 "0215"
              const birthday = socialData.birthday.replace(/-/g, '') // 하이픈 제거
              const month = birthday.substring(0, 2)
              const day = birthday.substring(2, 4)
              return `${socialData.birthyear}-${month}-${day}`
            })()
          : data.birthDate,
        address: data.address,
        addressDetail: data.addressDetail,
        zipCode: data.zipCode,
        // 약관 동의 정보
        agreedToTerms: data.agreedToTerms,
        agreedToPrivacy: data.agreedToPrivacy,
        agreedToMarketing: data.agreedToMarketing || false,
        parentalConsent: data.parentalConsent || false,
        autoGenerate: true
      }

      console.log('=== Final Data to Send ===')
      console.log(JSON.stringify(finalData, null, 2))

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      })

      console.log('=== API Response ===')
      console.log('Status:', response.status)
      console.log('Status Text:', response.statusText)

      const result = await response.json()
      console.log('Result:', result)

      if (response.ok) {
        console.log('  Registration successful')
        if (result.user && result.autoLogin) {
          console.log('  Auto-login successful, setting user in context')
          login(result.user)
          const finalRedirect = originalRedirect && originalRedirect !== '/my-page' ? originalRedirect : '/'
          const redirectUrl = new URL(finalRedirect, window.location.origin)
          redirectUrl.searchParams.set('signup_success', 'true')
          router.push(redirectUrl.pathname + redirectUrl.search)
        } else {
          console.log('Auto-login failed, redirecting to login')
          router.push('/login?message=가입완료. 로그인해주세요.')
        }
      } else {
        console.error('Registration failed:', result)
        setError(result.error || '회원가입에 실패했습니다.')
      }
    } catch (error) {
      console.error('Network error:', error)
      setError('네트워크 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  const getProviderInfo = () => {
    if (!socialData) return { name: '', color: '', bgColor: '' }
    const providerConfig = {
      naver: { name: '네이버', color: 'text-[#03C75A]', bgColor: 'bg-[#03C75A]' },
      kakao: { name: '카카오', color: 'text-[#FEE500]', bgColor: 'bg-[#FEE500]' }
    }
    return providerConfig[socialData.provider]
  }

  const providerInfo = getProviderInfo()

  if (!socialData) {
    return (
      <div className="sm:bg-white py-8 px-6 sm:shadow-xl shadow-none rounded-xl border border-gray-100 font-paper">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">오류가 발생했습니다</h2>
          <p className="text-gray-600 mb-4">SNS 인증 정보를 찾을 수 없습니다.</p>
          <button
            onClick={onBack}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            다시 시도하기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="sm:bg-white py-8 px-6 sm:shadow-xl shadow-none rounded-xl border border-gray-100 font-paper max-w-2xl mx-auto">
      <div className="sm:mx-auto sm:w-full">
        {/* 헤더 */}
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="mr-3 p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {providerInfo.name} 계정으로 가입
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {Object.values(missingInfo).some(missing => missing)
                ? '부족한 정보를 입력해주세요'
                : '주소 정보와 약관 동의를 확인해주세요'}
            </p>
          </div>
        </div>

        {/* SNS 계정 정보 표시 */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center">
            {socialData.profileImage ? (
              <Image
                src={socialData.profileImage}
                alt="프로필"
                width={48}
                height={48}
                className="rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                <User className="h-6 w-6 text-gray-600" />
              </div>
            )}
            <div className="ml-4 flex-1">
              <p className="font-semibold text-gray-900">{socialData.name || '이름 없음'}</p>
              <p className="text-sm text-gray-600">{socialData.email || '이메일 없음'}</p>
              <div className="text-xs text-gray-500 mt-1">
                {socialData.mobile && <p>{socialData.mobile}</p>}
                {socialData.gender && <p>{socialData.gender === 'M' ? '남성' : socialData.gender === 'F' ? '여성' : '기타'}</p>}
                {socialData.birthyear && <p>{socialData.birthyear}년생</p>}
                {socialData.birthday && <p>{socialData.birthday} (월-일)</p>}
              </div>
            </div>
          </div>
          <div className="mt-3 text-xs text-green-700 bg-green-50 rounded px-2 py-1">
              {providerInfo.name}에서 받은 정보는 자동으로 입력됩니다
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* 입력 폼 */}
        <form 
          onSubmit={form.handleSubmit(
            handleSubmit,
            (errors) => {
              console.error('=== Form Validation Failed ===')
              console.error('Errors:', errors)
              setError('입력 정보를 확인해주세요.')
            }
          )} 
          className="space-y-6"
        >
          {/* 부족한 개인정보 입력 */}
          {Object.values(missingInfo).some(missing => missing) && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-800 mb-3">
                추가 정보 입력 필요
              </h3>
              <div className="space-y-4">
                {missingInfo.name && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <User className="inline h-4 w-4 mr-1" />
                      이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...form.register('name')}
                      type="text"
                      disabled={isLoading}
                      placeholder="실명을 입력해주세요"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    {form.formState.errors.name && (
                      <p className="mt-1 text-sm text-red-600">{form.formState.errors.name.message}</p>
                    )}
                  </div>
                )}

                {missingInfo.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Phone className="inline h-4 w-4 mr-1" />
                      전화번호 <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...form.register('phone')}
                      type="tel"
                      disabled={isLoading}
                      placeholder="01012345678"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    {form.formState.errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{form.formState.errors.phone.message}</p>
                    )}
                  </div>
                )}

                {missingInfo.gender && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      성별 <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...form.register('gender')}
                      disabled={isLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="none">선택 안함</option>
                      <option value="male">남성</option>
                      <option value="female">여성</option>
                    </select>
                    {form.formState.errors.gender && (
                      <p className="mt-1 text-sm text-red-600">{form.formState.errors.gender.message}</p>
                    )}
                  </div>
                )}

                {missingInfo.birthDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      생년월일 <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...form.register('birthDate')}
                      type="date"
                      disabled={isLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    {form.formState.errors.birthDate && (
                      <p className="mt-1 text-sm text-red-600">{form.formState.errors.birthDate.message}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 주소 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              주소 정보 <span className="text-red-500">*</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">우편번호</label>
                <input
                  {...form.register('zipCode')}
                  type="text"
                  readOnly
                  placeholder="우편번호"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">기본주소</label>
                <div className="flex space-x-2">
                  <input
                    {...form.register('address')}
                    type="text"
                    readOnly
                    placeholder="주소 검색 버튼을 클릭하세요"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={handleAddressSearch}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
                {form.formState.errors.address && (
                  <p className="mt-1 text-sm text-red-600">{form.formState.errors.address.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">상세주소</label>
              <input
                {...form.register('addressDetail')}
                type="text"
                placeholder="상세주소를 입력해주세요"
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* 약관 동의 섹션 */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              약관 동의
            </h3>

            {/* 전체 동의 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    form.watch('agreedToTerms') && 
                    form.watch('agreedToPrivacy')
                  }
                  onChange={(e) => {
                    const checked = e.target.checked
                    form.setValue('agreedToTerms', checked)
                    form.setValue('agreedToPrivacy', checked)
                    form.setValue('agreedToMarketing', checked)
                  }}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-base font-bold text-gray-900">
                  전체 동의
                </span>
              </label>
              <p className="text-xs text-gray-600 mt-2 ml-8">
                서비스 이용약관, 개인정보 처리방침, 마케팅 정보 수신(선택)에 모두 동의합니다.
              </p>
            </div>

            {/* 개별 약관 */}
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="border-b border-gray-200 pb-3">
                <label className="flex items-start space-x-3 cursor-pointer hover:bg-white p-2 rounded">
                  <input
                    {...form.register('agreedToTerms')}
                    type="checkbox"
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <span className="text-sm text-gray-900">
                      <span className="text-red-500 font-bold">* [필수]</span>{' '}
                      <Link
                        className="text-blue-600 hover:text-blue-800 underline font-semibold"
                        href="/terms-of-service"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        서비스 이용약관
                      </Link>
                      에 동의합니다
                    </span>
                    <div className="mt-2 text-xs text-gray-500 bg-white border border-gray-200 rounded p-2">
                      <p className="font-medium text-gray-700 mb-1">주요 내용:</p>
                      <ul className="space-y-0.5 list-disc list-inside">
                        <li>서비스 이용 관련 권리와 의무</li>
                        <li>금지 행위 및 이용 제한</li>
                        <li>개인정보 보호 및 책임사항</li>
                      </ul>
                    </div>
                  </div>
                </label>
                {form.formState.errors.agreedToTerms && (
                  <p className="mt-1 text-sm text-red-600 ml-7 font-medium">
                    {form.formState.errors.agreedToTerms.message}
                  </p>
                )}
              </div>

              <div className="border-b border-gray-200 pb-3">
                <label className="flex items-start space-x-3 cursor-pointer hover:bg-white p-2 rounded">
                  <input
                    {...form.register('agreedToPrivacy')}
                    type="checkbox"
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="flex-1">
                    <span className="text-sm text-gray-900">
                      <span className="text-red-500 font-bold">* [필수]</span>{' '}
                      <Link
                        className="text-blue-600 hover:text-blue-800 underline font-semibold"
                        href="/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        개인정보 처리방침
                      </Link>
                      에 동의합니다
                    </span>
                    <div className="mt-2 text-xs text-gray-500 bg-white border border-gray-200 rounded p-2">
                      <p className="font-medium text-gray-700 mb-1">주요 내용:</p>
                      <ul className="space-y-0.5 list-disc list-inside">
                        <li><strong>수집목적:</strong> 회원가입, 본인확인, 서비스 제공</li>
                        <li><strong>수집항목:</strong> 이름, 전화번호, 이메일, 주소 등</li>
                        <li><strong>보유기간:</strong> 회원 탈퇴 시까지</li>
                      </ul>
                    </div>
                  </div>
                </label>
                {form.formState.errors.agreedToPrivacy && (
                  <p className="mt-1 text-sm text-red-600 ml-7 font-medium">
                    {form.formState.errors.agreedToPrivacy.message}
                  </p>
                )}
              </div>

              <label className="flex items-start space-x-3 cursor-pointer hover:bg-white p-2 rounded">
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
          </div>

          {/* 제출 버튼 */}
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
              disabled={isLoading}
              onClick={() => {
                console.log('=== Submit Button Clicked ===')
                console.log('Current Form Values:', form.getValues())
                console.log('Form Is Valid:', form.formState.isValid)
                console.log('Form Errors:', form.formState.errors)
              }}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isLoading ? (
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
    </div>
  )
}