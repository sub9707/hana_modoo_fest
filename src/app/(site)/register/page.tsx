'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import PhoneRegistration from '@/components/forms/PhoneRegistration'
import SocialRegistration from '@/components/forms/SocialRegistration'
import RegistrationMethod from '@/components/forms/RegistrationMethod'

// SocialData 타입 정의 (SocialRegistration과 일치)
interface SocialData {
  provider: 'naver' | 'kakao'
  id: string
  email?: string
  name?: string
  profileImage?: string
  gender?: string
  birthday?: string
  mobile?: string
  birthyear?: string // 네이버에서 받아오는 출생연도
}

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const [registrationStep, setRegistrationStep] = useState<'method' | 'phone' | 'social' | 'complete'>('method')
  const [socialData, setSocialData] = useState<SocialData | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    // URL 파라미터에서 메시지 확인
    const urlMessage = searchParams.get('message')
    const provider = searchParams.get('provider')
    const userData = searchParams.get('user_data')

    if (urlMessage) {
      setMessage(urlMessage)
    }

    // SNS로부터 리다이렉트된 경우
    if (provider && userData) {
      try {
        const decodedUserData = JSON.parse(decodeURIComponent(userData))
        
        // 네이버/카카오 데이터 구조에 맞게 매핑
        const mappedSocialData: SocialData = {
          provider: provider as 'naver' | 'kakao',
          id: decodedUserData.id || decodedUserData.user_id,
          email: decodedUserData.email,
          name: decodedUserData.name || decodedUserData.nickname,
          profileImage: decodedUserData.profile_image || decodedUserData.profileImage,
          gender: decodedUserData.gender,
          birthday: decodedUserData.birthday,
          mobile: decodedUserData.mobile || decodedUserData.phone_number,
          birthyear: decodedUserData.birthyear || decodedUserData.birth_year // 네이버 출생연도
        }

        setSocialData(mappedSocialData)
        setRegistrationStep('social')

        // 디버깅을 위한 로그 (개발 환경에서만)
        if (process.env.NODE_ENV === 'development') {
          console.log('Received social data:', decodedUserData)
          console.log('Mapped social data:', mappedSocialData)
        }
      } catch (error) {
        console.error('Failed to parse social data:', error)
        setMessage('SNS 로그인 정보를 처리하는 중 오류가 발생했습니다.')
      }
    }
  }, [searchParams])

  const handleMethodSelect = (method: 'phone' | 'social') => {
    if (method === 'phone') {
      setRegistrationStep('phone')
    } else {
      // SNS 선택 시 로그인 페이지로 이동
      window.location.href = '/login'
    }
  }

  const handleRegistrationComplete = () => {
    setRegistrationStep('complete')
  }

  const handleBackToMethod = () => {
    // 소셜 데이터 초기화
    setSocialData(null)
    setMessage(null)
    setRegistrationStep('method')
    
    // URL 파라미터도 정리
    const url = new URL(window.location.href)
    url.searchParams.delete('provider')
    url.searchParams.delete('user_data')
    url.searchParams.delete('message')
    window.history.replaceState({}, '', url.pathname)
  }

  const renderCurrentStep = () => {
    switch (registrationStep) {
      case 'method':
        return (
          <RegistrationMethod 
            onMethodSelect={handleMethodSelect}
            message={message}
          />
        )
      case 'phone':
        return (
          <PhoneRegistration 
            onComplete={handleRegistrationComplete}
            onBack={handleBackToMethod}
          />
        )
      case 'social':
        return (
          <SocialRegistration 
            socialData={socialData}
            onComplete={handleRegistrationComplete}
            onBack={handleBackToMethod}
          />
        )
      case 'complete':
        return (
          <div className="sm:bg-white py-8 px-6 sm:shadow-xl shadow-none rounded-xl border border-gray-100">
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">회원가입 완료!</h2>
              <p className="text-gray-600 mb-2">
                모두하나대축제 2025에 오신 것을 환영합니다.
              </p>
              {socialData && (
                <p className="text-sm text-blue-600 mb-6">
                  {socialData.provider === 'naver' ? '네이버' : '카카오'} 계정으로 가입이 완료되었습니다.
                </p>
              )}
              <div className="space-y-3">
                <a
                  href="/login"
                  className="block w-full px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  로그인하러 가기
                </a>
                <button
                  onClick={() => window.location.href = '/'}
                  className="block w-full px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  메인으로 이동
                </button>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 -mt-16">
        {renderCurrentStep()}
      </div>
    </div>
  )
}