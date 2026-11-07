'use client'

import Link from 'next/link'
import { User } from '@/types/auth'
import { 
  getSignupMethodText, 
  getGenderText, 
  getRoleText
} from '@/lib/utils/user'
import { 
  formatDate
} from '@/lib/utils'
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Shield, 
  Clock, 
  Settings, 
  Trash2,
  RefreshCw,
  Building,
  Activity,
  AlertTriangle
} from 'lucide-react'
import { useState } from 'react'
import EmailRegistration from '@/components/my-page/EmailRegistration'

interface MyPageContentProps {
  user: User & {
    address?: string
    address_detail?: string
    zip_code?: string
  }
}

export function MyPageContent({ user }: MyPageContentProps) {
  const [isEmailRegistered, setIsEmailRegistered] = useState(!!user.email)

  // 가입 방법별 배지 색상
  const getSignupMethodBadgeColor = (method: string) => {
    switch (method) {
      case 'phone':
        return 'bg-blue-100 text-blue-800'
      case 'naver':
        return 'bg-green-100 text-green-800'
      case 'kakao':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // 역할별 배지 색상
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'editor':
        return 'bg-purple-100 text-purple-800'
      case 'user':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // 이메일 등록 완료 시 호출
  const handleEmailRegistered = () => {
    setIsEmailRegistered(true)
    // 페이지 새로고침으로 최신 사용자 정보 반영
    window.location.reload()
  }

  // 일반 가입자이고 이메일이 없는 경우에만 이메일 등록 섹션 표시
  const shouldShowEmailRegistration = user.signup_method === 'phone' && !isEmailRegistered

  return (
    <div className="p-6 space-y-8 font-paper">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">마이페이지</h1>
        <div className="flex space-x-3">
          {/* 비밀번호 변경 버튼 추가 (전화번호 가입자만) */}
          {user.signup_method === 'phone' && (
            <Link
              href="/my-page/change-password-options"
              className="inline-flex items-center px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Shield className="h-4 w-4 mr-2" />
              비밀번호 변경
            </Link>
          )}
          <Link
            href="/my-page/delete-account"
            className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            회원탈퇴
          </Link>
        </div>
      </div>

      {/* 이메일 등록 안내 (일반 가입자이고 이메일이 없는 경우) */}
      {shouldShowEmailRegistration && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300 rounded-lg p-6 shadow-sm">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-orange-900 mb-2">
                이메일 등록을 권장합니다
              </h3>
              <ul className="text-sm text-orange-800 space-y-1 mb-3">
                <li>• 비밀번호를 잊어버린 경우 이메일로 재설정할 수 있습니다</li>
                <li>• 계정 보안을 위한 추가 인증 수단으로 사용됩니다</li>
                <li>• <strong className="text-orange-900">최초 1회만 등록 가능</strong>하므로 신중하게 입력해주세요</li>
              </ul>
              <p className="text-xs text-orange-700 bg-orange-100 p-2 rounded border border-orange-200">
                한 번 등록한 이메일은 수정할 수 없습니다. 정확한 이메일을 입력해주세요.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 이메일 등록 섹션 (일반 가입자이고 이메일이 없는 경우) */}
      {shouldShowEmailRegistration && (
        <EmailRegistration 
          currentEmail={user.email}
          onSuccess={handleEmailRegistered}
        />
      )}

      {/* 프로필 섹션 */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">프로필 정보</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 기본 정보 */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              {user.profile_image ? (
                <img
                  src={user.profile_image}
                  alt={`${user.name} 프로필`}
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-gray-600" />
                </div>
              )}
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
                <p className="text-gray-600">@{user.username}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                    <Shield className="h-3 w-3 mr-1" />
                    {getRoleText(user.role)}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSignupMethodBadgeColor(user.signup_method)}`}>
                    {getSignupMethodText(user.signup_method)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">전화번호</p>
                  <p className="text-sm text-gray-600">{user.phone}</p>
                </div>
              </div>

              {user.email ? (
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">이메일</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  {user.signup_method === 'phone' && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                      등록완료
                    </span>
                  )}
                </div>
              ) : user.signup_method !== 'phone' ? (
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">이메일</p>
                    <p className="text-sm text-gray-500">SNS에서 제공되지 않음</p>
                  </div>
                </div>
              ) : null}

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">생년월일</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(user.birth_date, 'long')} ({getGenderText(user.gender)})
                  </p>
                </div>
              </div>

              {user.company && (
                <div className="flex items-center space-x-3">
                  <Building className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">회사/소속</p>
                    <p className="text-sm text-gray-600">{user.company}</p>
                  </div>
                </div>
              )}

              {(user.address || user.zip_code) && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">주소</p>
                    <p className="text-sm text-gray-600">
                      {user.zip_code && `(${user.zip_code}) `}
                      {user.address}
                      {user.address_detail && ` ${user.address_detail}`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='border border-gray-100 mt-5'/>
        <div className='mt-6 text-sm text-gray-500 text-center'>
          본 페이지는 회원 정보 열람용입니다. <br/>정보 수정을 위해서는 02-861-3020으로 연락바랍니다.
        </div>
      </section>
    </div>
  )
}