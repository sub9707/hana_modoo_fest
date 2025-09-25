'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, User, Loader2, Check, AlertCircle, Search, Phone, Calendar, UserCheck } from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

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

// 모든 필드를 선택적으로 만든 고정 스키마
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
    .min(1, '생년월일을 입력해주세요')
    .regex(/^\d{4}-\d{2}-\d{2}$/, '올바른 날짜 형식이 아닙니다')
    .optional()
}).superRefine((data, ctx) => {
  // 런타임에서 동적 검증 - socialData에 없는 정보만 필수로 체크
  const socialData = (window as any).__tempSocialData

  if (!socialData?.name && !data.name) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '이름을 입력해주세요',
      path: ['name']
    })
  }

  if (!socialData?.mobile && !data.phone) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '전화번호를 입력해주세요',
      path: ['phone']
    })
  }

  if ((!socialData?.gender || socialData.gender === 'none') && !data.gender) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: '성별을 선택해주세요',
      path: ['gender']
    })
  }

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
  const { login, refreshUser } = useAuth()
  const router = useRouter()

  // URL에서 원래 가려던 경로 추출
  const searchParams = new URLSearchParams(window.location.search)
  const originalRedirect = searchParams.get('redirect') || '/'

  // 부족한 정보 체크
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
        ? `${socialData.birthyear}-${socialData.birthday}`
        : ''
    }
  })

  // 카카오 우편번호 API 스크립트 로드
  useEffect(() => {
    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY

    if (!kakaoKey) {
      console.warn('NEXT_PUBLIC_KAKAO_JS_KEY 환경변수가 설정되지 않았습니다.')
      return
    }

    if (window.daum?.Postcode) {
      setIsKakaoLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    script.async = true
    script.onload = () => {
      setIsKakaoLoaded(true)
    }
    script.onerror = () => {
      console.error('카카오 우편번호 API 로드에 실패했습니다.')
    }

    document.head.appendChild(script)

    return () => {
      const existingScript = document.querySelector('script[src*="postcode.v2.js"]')
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [])

  const handleSearchAddress = () => {
    if (!window.daum?.Postcode) {
      alert('우편번호 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
      return
    }

    new window.daum.Postcode({
      oncomplete: function (data) {
        form.setValue('zipCode', data.zonecode)
        form.setValue('address', data.roadAddress || data.jibunAddress)

        const addressDetailInput = document.querySelector('input[name="addressDetail"]') as HTMLInputElement
        if (addressDetailInput) {
          addressDetailInput.focus()
        }

        form.trigger(['zipCode', 'address'])
      },
      width: 100,
      height: 400
    }).open()
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
  }

  const handleSubmit = async (data: SocialUserInfoFormData) => {
    if (!socialData) {
      setError('SNS 인증 정보가 없습니다.')
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      // 최종 데이터 준비
      const finalData = {
        // SNS에서 받은 데이터 우선 사용
        name: socialData.name || data.name,
        phone: socialData.mobile?.replace(/-/g, '') || data.phone?.replace(/-/g, ''),
        gender: socialData.gender === 'M' ? 'male' : socialData.gender === 'F' ? 'female' : data.gender,
        email: socialData.email,
        profileImage: socialData.profileImage,
        signupMethod: socialData.provider,
        socialId: socialData.id,

        // 생년월일 처리
        birthDate: socialData.birthyear && socialData.birthday
          ? `${socialData.birthyear}-${socialData.birthday}`
          : data.birthDate,

        // 사용자가 입력한 주소 정보
        address: data.address,
        addressDetail: data.addressDetail,
        zipCode: data.zipCode,
        autoGenerate: true
      }

      console.log('Final registration data:', finalData)

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      })

      const result = await response.json()

      if (response.ok) {
        console.log('Registration successful:', result)

        if (result.user && result.autoLogin) {
          console.log('Auto-login successful, setting user in context')

          // 즉시 AuthContext에 사용자 정보 설정 (UI 즉시 업데이트)
          login(result.user)

          // 원래 가려던 페이지 또는 홈으로 SPA 방식 이동
          const finalRedirect = originalRedirect && originalRedirect !== '/dashboard'
            ? originalRedirect
            : '/'

          router.push(
            `${finalRedirect}${finalRedirect.includes('?') ? '&' : '?'}signup_success=true`
          )
        } else {
          console.log('Auto-login failed, redirecting to login')
          router.push('/login?message=가입완료. 로그인해주세요')
        }

        return
      } else {
        setError(result.error || '회원가입에 실패했습니다')
      }
    } catch (error) {
      console.error('Social registration error:', error)
      setError('네트워크 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  const getProviderInfo = () => {
    if (!socialData) return { name: '', color: '', bgColor: '' }

    const providerConfig = {
      naver: {
        name: '네이버',
        color: 'text-[#03C75A]',
        bgColor: 'bg-[#03C75A]'
      },
      kakao: {
        name: '카카오',
        color: 'text-[#FEE500]',
        bgColor: 'bg-[#FEE500]'
      }
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
    <div className="sm:bg-white py-8 px-6 sm:shadow-xl shadow-none rounded-xl border border-gray-100 font-paper">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
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
                : '주소 정보를 입력해주세요'}
            </p>
          </div>
        </div>

        {/* SNS 계정 정보 표시 */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center">
            {socialData.profileImage ? (
              <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3 bg-gray-200">
                <Image
                  src={socialData.profileImage}
                  alt="프로필 이미지"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                  }}
                />
                <div className="fallback-icon hidden absolute inset-0 flex items-center justify-center bg-gray-300">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            ) : (
              <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                <User className="h-6 w-6 text-gray-600" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center">
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium text-white ${providerInfo.bgColor}`}>
                  {providerInfo.name}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {socialData.name || '이름 정보 없음'}
              </p>
              <div className="text-xs text-gray-600 space-y-0.5 mt-1">
                {socialData.email && <p>📧 {socialData.email}</p>}
                {socialData.mobile && <p>📱 {socialData.mobile}</p>}
                {socialData.gender && <p>👤 {socialData.gender === 'M' ? '남성' : socialData.gender === 'F' ? '여성' : '기타'}</p>}
                {socialData.birthyear && <p>🗓️ {socialData.birthyear}년생</p>}
                {socialData.birthday && <p>🎂 {socialData.birthday} (월-일)</p>}
              </div>
            </div>
          </div>
          <div className="mt-3 text-xs text-green-700 bg-green-50 rounded px-2 py-1">
            ✅ {providerInfo.name}에서 받은 정보는 자동으로 입력됩니다
          </div>
        </div>

        {/* 오류 메시지 */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* 입력 폼 */}
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">

          {/* 부족한 개인정보 입력 섹션 */}
          {Object.values(missingInfo).some(missing => missing) && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
              <h3 className="text-sm font-medium text-yellow-800 mb-3">
                ⚠️ 추가 정보 입력 필요
              </h3>
              <div className="space-y-4">

                {/* 이름 입력 */}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {form.formState.errors.name && (
                      <p className="mt-1 text-xs text-red-600">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                )}

                {/* 전화번호 입력 */}
                {missingInfo.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Phone className="inline h-4 w-4 mr-1" />
                      휴대폰 번호 <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...form.register('phone')}
                      type="tel"
                      disabled={isLoading}
                      placeholder="010-0000-0000"
                      onChange={(e) => {
                        const formatted = formatPhone(e.target.value)
                        e.target.value = formatted
                        form.setValue('phone', formatted.replace(/-/g, ''))
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {form.formState.errors.phone && (
                      <p className="mt-1 text-xs text-red-600">
                        {form.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                )}

                {/* 성별 선택 */}
                {missingInfo.gender && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <UserCheck className="inline h-4 w-4 mr-1" />
                      성별 <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...form.register('gender')}
                      disabled={isLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">선택해주세요</option>
                      <option value="male">남성</option>
                      <option value="female">여성</option>
                      <option value="none">선택안함</option>
                    </select>
                    {form.formState.errors.gender && (
                      <p className="mt-1 text-xs text-red-600">
                        {form.formState.errors.gender.message}
                      </p>
                    )}
                  </div>
                )}

                {/* 생년월일 입력 */}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {form.formState.errors.birthDate && (
                      <p className="mt-1 text-xs text-red-600">
                        {form.formState.errors.birthDate.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 우편번호 및 기본주소 */}
          <div className="space-y-3">
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                우편번호 <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex space-x-2">
                <input
                  {...form.register('zipCode')}
                  type="text"
                  disabled={isLoading}
                  placeholder="12345"
                  readOnly
                  className="flex-1 appearance-none block px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50"
                />
                <button
                  type="button"
                  disabled={isLoading || !isKakaoLoaded}
                  onClick={handleSearchAddress}
                  className={`
                    px-4 py-2 border text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
                    ${isLoading || !isKakaoLoaded
                      ? 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    }
                  `}
                  title={!isKakaoLoaded ? '우편번호 검색 서비스 로딩 중...' : '우편번호 검색'}
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
              {!isKakaoLoaded && (
                <p className="mt-1 text-xs text-blue-600">
                  📄 우편번호 검색 서비스를 준비하고 있습니다...
                </p>
              )}
              {form.formState.errors.zipCode && (
                <p className="mt-1 text-xs text-red-600">
                  {form.formState.errors.zipCode.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                기본주소 <span className="text-red-500">*</span>
              </label>
              <input
                {...form.register('address')}
                type="text"
                disabled={isLoading}
                placeholder="우편번호 검색 버튼을 클릭하세요"
                readOnly
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50"
              />
              {form.formState.errors.address && (
                <p className="mt-1 text-xs text-red-600">
                  {form.formState.errors.address.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="addressDetail" className="block text-sm font-medium text-gray-700">
                상세주소 (선택사항)
              </label>
              <input
                {...form.register('addressDetail')}
                type="text"
                disabled={isLoading}
                placeholder="상세주소를 입력하세요 (동, 호수 등)"
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full flex justify-center py-3 px-4 border border-transparent 
                text-sm font-medium rounded-lg text-white transition-all duration-200
                ${isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:shadow-lg'
                }
              `}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              {isLoading ? '가입 중...' : '간편 가입 완료'}
            </button>
          </div>
        </form>

        {/* 안내사항 */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700">
            <strong>간편 가입:</strong> {providerInfo.name} 계정으로 간편하게 가입됩니다.
            별도의 비밀번호 설정 없이 {providerInfo.name} 로그인만으로 이용하실 수 있습니다.
          </p>
          <p className="text-xs text-blue-600 mt-1">
            💡 로그인 시에는 "{providerInfo.name}로 시작하기" 버튼을 사용하세요.
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_KAKAO_JS_KEY && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-700">
              ⚠️ <strong>개발자 알림:</strong> NEXT_PUBLIC_KAKAO_JS_KEY 환경변수가 설정되지 않았습니다.
              우편번호 검색 기능이 제한될 수 있습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}