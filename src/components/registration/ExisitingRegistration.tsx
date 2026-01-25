'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@/types/auth'
import type { Registration } from '@/types/registration'

interface ExistingRegistrationProps {
  user: User
  registration: Registration & { user_name: string; user_phone: string }
}

export default function ExistingRegistration({ user, registration }: ExistingRegistrationProps) {
  const router = useRouter()
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 참가유형 한글 변환
  const getParticipantTypeText = (type: string) => {
    const types = {
      'citizen': '일반 시민/가족',
      'single-parent': '한부모가족',
      'self-help': '자조모임',
      'volunteer': '자원봉사자',
      'organization': '기관 관계자'
    }
    return types[type as keyof typeof types] || type
  }

  // 참가신청 취소
  const handleCancel = async () => {
    setIsCancelling(true)
    
    try {
      const response = await fetch('/api/registration', {
        method: 'DELETE'
      })

      const result = await response.json()

      if (response.ok) {
        alert('참가신청이 취소되었습니다.')
        router.refresh() // 페이지 새로고침
      } else {
        throw new Error(result.error || '취소 처리 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('Cancel error:', error)
      alert(error instanceof Error ? error.message : '취소 처리 중 오류가 발생했습니다.')
    } finally {
      setIsCancelling(false)
      setShowCancelModal(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* 신청 상태 */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-3 px-6 py-3 bg-green-100 text-green-800 rounded-xl font-semibold text-lg">
          <span className="text-2xl"> </span>
          <span>참가신청 완료</span>
        </div>
      </div>

      {/* 접수번호 */}
      <div className="text-center">
        <div className="text-lg font-medium text-gray-600 mb-2">접수번호</div>
        <div className="inline-block px-6 py-4 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-xl font-mono font-bold text-2xl">
          {registration.registration_number}
        </div>
      </div>

      {/* 신청 정보 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 기본 정보 */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2">기본 정보</h3>
          
          {[
            { label: '신청자', value: registration.user_name, icon: '👤' },
            { label: '연락처', value: registration.user_phone, icon: '📞' },
            { label: '참가유형', value: getParticipantTypeText(registration.participant_type), icon: '🏷️' }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <span>{item.icon}</span>
                <span className="font-medium text-gray-700">{item.label}</span>
              </div>
              <span className="text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>

        {/* 추가 정보 */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2">참가 정보</h3>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <span>👥</span>
              <span className="font-medium text-gray-700">총 참가인원</span>
            </div>
            <span className="text-gray-900">{registration.companions + 1}명 (본인 포함)</span>
          </div>

          {registration.companion_details && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span>📝</span>
                <span className="font-medium text-gray-700">동반자 정보</span>
              </div>
              <p className="text-gray-900 text-sm whitespace-pre-wrap">
                {registration.companion_details}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <span>📅</span>
              <span className="font-medium text-gray-700">신청일시</span>
            </div>
            <span className="text-gray-900 text-sm">
              {formatDate(registration.created_at)}
            </span>
          </div>
        </div>
      </div>

      {/* 주소 정보 */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800 border-b pb-2">경품 수령 주소</h3>
        
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <span className="text-xl">🏠</span>
            <div className="flex-1">
              <div className="font-medium text-orange-800 mb-1">
                [{registration.zip_code}] {registration.address}
              </div>
              {registration.address_detail && (
                <div className="text-orange-700">
                  {registration.address_detail}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 특별 요청사항 */}
      {registration.special_requests && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2">특별 요청사항</h3>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-900 whitespace-pre-wrap">
              {registration.special_requests}
            </p>
          </div>
        </div>
      )}


      {/* 액션 버튼들 */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
        <button
          onClick={() => router.push(`/registration/success?id=${registration.id}`)}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white font-medium rounded-lg hover:from-orange-500 hover:to-pink-600 hover:shadow-lg transition-all focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          접수증 확인하기
        </button>
        
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          홈으로 가기
        </button>
        
        <button
          onClick={() => setShowCancelModal(true)}
          className="px-6 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          신청 취소
        </button>
      </div>

      {/* 취소 확인 모달 */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              참가신청 취소
            </h3>
            
            <p className="text-gray-600 mb-6">
              정말로 참가신청을 취소하시겠습니까?<br/>
              취소된 신청은 복구할 수 없으며, 다시 신청하셔야 합니다.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={isCancelling}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                유지하기
              </button>
              
              <button
                onClick={handleCancel}
                disabled={isCancelling}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                {isCancelling ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    처리중...
                  </span>
                ) : (
                  '취소하기'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}