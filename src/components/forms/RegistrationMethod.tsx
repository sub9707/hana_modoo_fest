'use client'

import { useState } from 'react'
import { Phone, MessageSquare, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface RegistrationMethodProps {
  onMethodSelect: (method: 'phone' | 'social') => void
  message?: string | null
}

export default function RegistrationMethod({ onMethodSelect, message }: RegistrationMethodProps) {
  const [selectedMethod, setSelectedMethod] = useState<'phone' | 'social' | null>(null)

  const handleContinue = () => {
    if (selectedMethod) {
      onMethodSelect(selectedMethod)
    }
  }

  return (
    <div className="sm:bg-white py-8 px-6 sm:shadow-xl shadow-none rounded-xl border border-gray-100 font-paper">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            회원가입
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            가입 방법을 선택해주세요
          </p>
        </div>

        {message && (
          <div className="mt-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
            {message}
          </div>
        )}

        <div className="mt-8 space-y-4">
          {/* 전화번호 인증 */}
          <div
            className={`
              relative rounded-lg border-2 p-4 cursor-pointer transition-all
              ${selectedMethod === 'phone' 
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }
            `}
            onClick={() => setSelectedMethod('phone')}
          >
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  type="radio"
                  name="registration-method"
                  value="phone"
                  checked={selectedMethod === 'phone'}
                  onChange={() => setSelectedMethod('phone')}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-gray-900">
                    전화번호로 가입
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-600">
                  휴대폰 번호를 인증하여 빠르게 가입할 수 있습니다
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  • 휴대폰 인증 후 추가 정보 입력
                  • 가장 빠른 가입 방법
                </div>
              </div>
            </div>
          </div>

          {/* SNS 인증 */}
          <div
            className={`
              relative rounded-lg border-2 p-4 cursor-pointer transition-all
              ${selectedMethod === 'social' 
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }
            `}
            onClick={() => setSelectedMethod('social')}
          >
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  type="radio"
                  name="registration-method"
                  value="social"
                  checked={selectedMethod === 'social'}
                  onChange={() => setSelectedMethod('social')}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-gray-900">
                    SNS로 가입
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-600">
                  네이버 또는 카카오 계정으로 간편하게 가입하세요
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  • 네이버, 카카오 지원
                  • 기본 정보 자동 입력
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleContinue}
            disabled={!selectedMethod}
            className={`
              w-full flex justify-center py-3 px-4 border border-transparent 
              text-sm font-medium rounded-lg text-white transition-all duration-200
              ${selectedMethod
                ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:shadow-lg'
                : 'bg-gray-300 cursor-not-allowed'
              }
            `}
          >
            계속하기
          </button>
        </div>

        {/* 로그인 링크 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link 
              href="/login" 
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors inline-flex items-center"
            >
              <ArrowLeft className="h-3 w-3 mr-1" />
              로그인하러 가기
            </Link>
          </p>
        </div>

        {/* 주의사항 */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">안내사항</h3>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• 하나의 계정으로만 가입이 가능합니다</li>
            <li>• SNS로 가입 시 다른 방법으로 중복 가입할 수 없습니다</li>
            <li>• 가입 후 계정 정보는 마이페이지에서 수정 가능합니다</li>
          </ul>
        </div>
      </div>
    </div>
  )
}