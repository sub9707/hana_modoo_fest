'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, User, Loader2, Check, AlertCircle, Search } from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext' // 추가

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

const socialUserInfoSchema = z.object({
  address: z.string().min(1, '주소를 입력해주세요'),
  addressDetail: z.string().optional(),
  zipCode: z.string().min(5, '우편번호를 입력해주세요')
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
  const { login, refreshUser } = useAuth() // 추가

  const form = useForm<SocialUserInfoFormData>({
    resolver: zodResolver(socialUserInfoSchema),
    defaultValues: {
      address: '',
      addressDetail: '',
      zipCode: ''
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
      oncomplete: function(data) {
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

  const handleSubmit = async (data: SocialUserInfoFormData) => {
    if (!socialData) {
      setError('SNS 인증 정보가 없습니다.')
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      let birthDate = ''
      if (socialData.birthday && socialData.birthyear) {
        birthDate = `${socialData.birthyear}-${socialData.birthday}`
      } else if (socialData.birthyear) {
        birthDate = `${socialData.birthyear}-01-01`
      } else {
        birthDate = ''
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: socialData.name,
          phone: socialData.mobile?.replace(/-/g, ''),
          gender: socialData.gender === 'M' ? 'male' : socialData.gender === 'F' ? 'female' : 'none',
          email: socialData.email,
          profileImage: socialData.profileImage,
          signupMethod: socialData.provider,
          socialId: socialData.id,
          birthDate: birthDate,
          address: data.address,
          addressDetail: data.addressDetail,
          zipCode: data.zipCode,
          autoGenerate: true
        })
      })

      const result = await response.json()

      if (response.ok) { 
        // API 응답이 비어있지만 회원가입은 성공했으므로 OAuth 로그인으로 바로 이동
        const oauthLoginUrl = `/api/auth/oauth?provider=${socialData.provider}&redirect=${encodeURIComponent('/dashboard?signup_success=true')}`
        
        // 바로 OAuth 로그인 실행 (이미 가입된 사용자이므로 로그인 플로우 실행)
        window.location.href = oauthLoginUrl
        
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
      <div className="sm:bg-white py-8 px-6 sm:shadow-xl shadow-none rounded-xl border border-gray-100">
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
    <div className="sm:bg-white py-8 px-6 sm:shadow-xl shadow-none rounded-xl border border-gray-100">
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
              추가 정보를 입력해주세요
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
                {socialData.name || '이름 없음'}
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
            ✅ 위 정보는 {providerInfo.name}에서 자동으로 가져와 적용됩니다
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