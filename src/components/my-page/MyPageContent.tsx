// src/app/my-page/components/MyPageContent.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User } from '@/types/auth'
import { 
  getSignupMethodText, 
  getGenderText, 
  getRoleText
} from '@/lib/utils/user'
import { 
  formatDate, 
  formatRelativeTime 
} from '@/lib/utils/date'
import { updateUserActivity } from '@/app/(site)/my-page/actions'

interface MyPageContentProps {
  user: User & {
    address?: string
    address_detail?: string
    zip_code?: string
  }
}

export function MyPageContent({ user }: MyPageContentProps) {
  const [isActivityUpdating, setIsActivityUpdating] = useState(false)

  // 활동 시간 업데이트 핸들러
  const handleUpdateActivity = async () => {
    if (isActivityUpdating) return
    
    setIsActivityUpdating(true)
    try {
      await updateUserActivity()
      // 성공적으로 업데이트되면 페이지 새로고침
      window.location.reload()
    } catch (error) {
      console.error('Activity update error:', error)
    } finally {
      setIsActivityUpdating(false)
    }
  }

  return (
    <div className="p-6 space-y-8">
      {/* 프로필 섹션 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">프로필 정보</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              {user.profile_image ? (
                <img
                  src={user.profile_image}
                  alt={`${user.name} 프로필`}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600 text-xl font-bold">
                    {user.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                <p className="text-gray-600">@{user.username}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin' 
                      ? 'bg-red-100 text-red-800'
                      : user.role === 'editor'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {getRoleText(user.role)}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {getSignupMethodText(user.signup_method)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 연락처 정보 */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">연락처 정보</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">전화번호:</span>
                <span className="font-medium">{user.phone}</span>
              </div>
              {user.email && (
                <div className="flex justify-between">
                  <span className="text-gray-600">이메일:</span>
                  <span className="font-medium">{user.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 개인 정보 섹션 */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">개인 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">성별:</span>
              <span className="font-medium">{getGenderText(user.gender)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">생년월일:</span>
              <span className="font-medium">{formatDate(user.birth_date)}</span>
            </div>
            {user.company && (
              <div className="flex justify-between">
                <span className="text-gray-600">회사/소속:</span>
                <span className="font-medium">{user.company}</span>
              </div>
            )}
          </div>

          {/* 주소 정보 */}
          {(user.address || user.zip_code) && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">주소 정보</h4>
              {user.zip_code && (
                <div className="flex justify-between">
                  <span className="text-gray-600">우편번호:</span>
                  <span className="font-medium">{user.zip_code}</span>
                </div>
              )}
              {user.address && (
                <div>
                  <span className="text-gray-600">주소:</span>
                  <div className="mt-1">
                    <p className="font-medium">{user.address}</p>
                    {user.address_detail && (
                      <p className="text-gray-600 text-sm">{user.address_detail}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 계정 활동 섹션 */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">계정 활동</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">가입일:</span>
              <span className="font-medium">{formatDate(user.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">최근 수정:</span>
              <span className="font-medium">{formatDate(user.updated_at)}</span>
            </div>
          </div>
          <div className="space-y-3">
            {user.last_login_at && (
              <div className="flex justify-between">
                <span className="text-gray-600">마지막 로그인:</span>
                <span className="font-medium">{formatRelativeTime(user.last_login_at)}</span>
              </div>
            )}
            {user.last_activity_at && (
              <div className="flex justify-between">
                <span className="text-gray-600">마지막 활동:</span>
                <span className="font-medium">{formatRelativeTime(user.last_activity_at)}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 빠른 액션 섹션 */}
      <section className="border-t border-gray-200 pt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">계정 관리</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/my-page/change-password"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            비밀번호 변경
          </Link>
          
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            현재 마이페이지는 정보 확인용으로만 제공됩니다. 
            정보 수정이 필요한 경우 관리자에게 문의해주세요.
          </p>
        </div>

        {/* 위험 구역 */}
        <div className="mt-8 pt-6 border-t border-red-200">
          <h3 className="text-sm font-medium text-red-800 mb-2">위험 구역</h3>
          <p className="text-sm text-red-600 mb-4">
            회원 탈퇴 후 12시간이 지나야 재가입할 수 있으니 주의해주세요.
          </p>
          <Link
            href="/my-page/delete-account"
            className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            회원 탈퇴
          </Link>
        </div>
      </section>
    </div>
  )
}