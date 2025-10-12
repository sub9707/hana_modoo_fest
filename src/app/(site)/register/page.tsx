'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import SocialRegistration from '@/components/forms/SocialRegistration'
import { AlertCircle, CheckCircle, UserPlus } from 'lucide-react'
import { DirectRegistrationForm } from '@/components/forms/DirectRegistration'
import Image from 'next/image'

type RegistrationStep = 'method' | 'direct' | 'social' | 'complete'

interface SocialUserData {
  provider: 'naver' | 'kakao'
  id: string
  email?: string
  name?: string
  profileImage?: string
  gender?: string
  birthday?: string
  mobile?: string
  birthyear?: string
}

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [registrationStep, setRegistrationStep] = useState<RegistrationStep>('method')
  const [message, setMessage] = useState<string | null>(null)
  const [socialData, setSocialData] = useState<SocialUserData | null>(null)
  const [isExistingUser, setIsExistingUser] = useState(false)

  // Development 환경 체크
  const isDevelopment = process.env.NODE_ENV === 'development'

  useEffect(() => {
    const messageParam = searchParams.get('message')
    const providerParam = searchParams.get('provider')
    const userDataParam = searchParams.get('user_data')

    if (messageParam) {
      setMessage(decodeURIComponent(messageParam))
      setIsExistingUser(true)
    } else if (providerParam && userDataParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userDataParam))
        
        const transformedSocialData: SocialUserData = {
          provider: providerParam as 'naver' | 'kakao',
          id: userData.id,
          email: userData.email,
          name: userData.name,
          profileImage: userData.profileImage,
          gender: userData.gender,
          birthday: userData.birthday,
          mobile: userData.mobile,
          birthyear: userData.birthyear
        }
        
        setSocialData(transformedSocialData)
        setRegistrationStep('social')
      } catch (error) {
        console.error('Failed to parse user data:', error)
        setMessage('잘못된 요청입니다.')
        setIsExistingUser(true)
      }
    }
  }, [searchParams])

  const handleMethodSelect = (method: 'direct' | 'social') => {
    if (method === 'direct') {
      setRegistrationStep('direct')
    } else {
      // SNS 가입은 로그인 페이지로 이동 (네이버 버튼이 있음)
      router.push('/login')
    }
  }

  const handleBackToMethod = () => {
    setSocialData(null)
    setMessage(null)
    setIsExistingUser(false)
    setRegistrationStep('method')
    
    const url = new URL(window.location.href)
    url.searchParams.delete('provider')
    url.searchParams.delete('user_data')
    url.searchParams.delete('message')
    window.history.replaceState({}, '', url.pathname)
  }

  const handleRegistrationComplete = () => {
    setRegistrationStep('complete')
  }

  // 가입 방식 선택 화면
  const renderMethodSelection = () => (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100 font-paper">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">회원가입</h2>
        <p className="text-gray-600">가입 방식을 선택해주세요</p>
      </div>

      <div className="space-y-4">
        {/* 정보 입력 방식 */}
        <button
          onClick={() => handleMethodSelect('direct')}
          className="w-full p-6 border-2 border-orange-500 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-500 rounded-full">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900">정보 입력으로 가입</h3>
                <p className="text-sm text-gray-600">모든 정보를 입력하여 바로 가입</p>
              </div>
            </div>
          </div>
        </button>

        {/* Development 환경에서만 SNS 가입 방식 표시 */}
        {isDevelopment && (
          <button
            onClick={() => handleMethodSelect('social')}
            className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#03C75A] rounded-full">
                <Image
                  src="/images/common/naver-logo.png"
                  alt="네이버"
                  width={24}
                  height={24}
                  className="bg-white rounded p-0.5"
                />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900">네이버 계정으로 가입</h3>
                <p className="text-sm text-gray-600">네이버 로그인으로 간편 가입 (개발 환경)</p>
              </div>
            </div>
          </button>
        )}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          이미 계정이 있으신가요?{' '}
          <button
            onClick={() => router.push('/login')}
            className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
          >
            로그인
          </button>
        </p>
      </div>
    </div>
  )

  // 회원가입 완료 화면
  const renderCompletionScreen = () => (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100 font-paper">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          회원가입 완료!
        </h2>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          모두하나대축제에 가입해주셔서 감사합니다.<br />
          이제 모든 서비스를 이용하실 수 있습니다.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => router.push('/')}
            className="w-full px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            메인으로 이동
          </button>
        </div>
      </div>
    </div>
  )

  // 기존 사용자 안내 화면
  if (isExistingUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              이미 가입된 계정입니다
            </h2>
            
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm leading-relaxed">{message}</p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => router.push('/login')}
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                로그인 페이지로 이동
              </button>
              
              <button
                onClick={handleBackToMethod}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                다른 방법으로 가입
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {registrationStep === 'method' && renderMethodSelection()}
      
      {registrationStep === 'direct' && (
        <DirectRegistrationForm onBack={handleBackToMethod} />
      )}
      
      {registrationStep === 'social' && socialData && (
        <SocialRegistration
          socialData={socialData}
          onBack={handleBackToMethod}
          onComplete={handleRegistrationComplete}
        />
      )}
      
      {registrationStep === 'complete' && renderCompletionScreen()}
    </div>
  )
}