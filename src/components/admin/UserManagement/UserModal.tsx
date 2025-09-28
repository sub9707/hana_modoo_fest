'use client'

import React, { useState } from 'react'
import {
  Shield, Users, Edit, Calendar, User as UserIcon, Phone, Building, Heart,
  Settings, Key, Trash2, AlertTriangle, X, CheckCircle, Globe
} from 'lucide-react'
import { User } from '@/types/auth'
import UserEditModal from './UserEditModal'

interface UserModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onUserUpdate?: (updatedUser: User) => void
  onUserDelete?: (userId: string) => void
}

interface EditUserData {
  name: string
  company?: string
  gender: 'male' | 'female' | 'none'
  birth_date: string
  phone: string
  role: 'admin' | 'editor' | 'user'
}

export default function UserModal({
  user,
  isOpen,
  onClose,
  onUserUpdate,
  onUserDelete
}: UserModalProps) {
  const [showEditModal, setShowEditModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [actionResult, setActionResult] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  if (!isOpen || !user) return null

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'admin':
        return { text: '관리자', color: 'bg-red-100 text-red-800', icon: Shield }
      case 'editor':
        return { text: '편집자', color: 'bg-orange-100 text-orange-800', icon: Edit }
      case 'user':
        return { text: '일반회원', color: 'bg-green-100 text-green-800', icon: Users }
      default:
        return { text: '일반회원', color: 'bg-gray-100 text-gray-800', icon: Users }
    }
  }

  const getGenderDisplay = (gender: string) => {
    switch (gender) {
      case 'male': return '남성'
      case 'female': return '여성'
      case 'none': return '비공개'
      default: return '비공개'
    }
  }

  const getSignupMethodDisplay = (method: string) => {
    switch (method) {
      case 'phone': return { text: '전화번호 가입', icon: Phone, color: 'bg-blue-100 text-blue-800' }
      case 'naver': return { text: '네이버 로그인', icon: Globe, color: 'bg-green-100 text-green-800' }
      case 'kakao': return { text: '카카오 로그인', icon: Globe, color: 'bg-yellow-100 text-yellow-800' }
      default: return { text: '일반 가입', icon: UserIcon, color: 'bg-gray-100 text-gray-800' }
    }
  }

  const formatDateTime = (dateTimeString?: string) => {
    if (!dateTimeString) return '정보 없음'
    return new Date(dateTimeString).toLocaleString('ko-KR')
  }

  // 소셜 로그인 사용자 여부 확인
  const isSocialUser = user.signup_method === 'naver' || user.signup_method === 'kakao'

  // 비밀번호 초기화
  const handlePasswordReset = async () => {
    if (!confirm(`${user.name}님의 비밀번호를 전화번호로 초기화하시겠습니까?\n초기화된 비밀번호: ${user.phone.replace(/-/g, '')}`)) {
      return
    }

    setLoading(true)
    setActionResult(null)

    try {
      const response = await fetch(`/api/admin/users/${user.id}/password-reset`, {
        method: 'POST',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '비밀번호 초기화에 실패했습니다.')
      }

      setActionResult({
        type: 'success',
        message: `비밀번호가 "${result.newPassword}"로 초기화되었습니다.`
      })

    } catch (error) {
      setActionResult({
        type: 'error',
        message: error instanceof Error ? error.message : '비밀번호 초기화에 실패했습니다.'
      })
    } finally {
      setLoading(false)
    }
  }

  // 사용자 정보 수정
  const handleUserEdit = async (userData: EditUserData) => {
    setLoading(true)
    setActionResult(null)

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '사용자 정보 수정에 실패했습니다.')
      }

      setActionResult({
        type: 'success',
        message: '사용자 정보가 성공적으로 수정되었습니다.'
      })

      // 부모 컴포넌트에 업데이트 알림
      if (onUserUpdate) {
        onUserUpdate(result)
      }

    } catch (error) {
      setActionResult({
        type: 'error',
        message: error instanceof Error ? error.message : '사용자 정보 수정에 실패했습니다.'
      })
    } finally {
      setLoading(false)
    }
  }

  // 권한 빠른 변경
  const handleQuickRoleChange = async (newRole: 'admin' | 'editor' | 'user') => {
    if (!confirm(`${user.name}님의 권한을 "${getRoleDisplay(newRole).text}"로 변경하시겠습니까?`)) {
      return
    }

    setLoading(true)
    setActionResult(null)

    try {
      const response = await fetch(`/api/admin/users/${user.id}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '권한 변경에 실패했습니다.')
      }

      setActionResult({
        type: 'success',
        message: result.message
      })

      // 부모 컴포넌트에 업데이트 알림
      if (onUserUpdate) {
        onUserUpdate(result.user)
      }

    } catch (error) {
      setActionResult({
        type: 'error',
        message: error instanceof Error ? error.message : '권한 변경에 실패했습니다.'
      })
    } finally {
      setLoading(false)
    }
  }

  // 사용자 삭제
  const handleUserDelete = async () => {
    if (!confirm(`${user.name}님의 계정을 정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      return
    }

    const secondConfirm = prompt(`확인을 위해 "${user.name}"을 입력해주세요:`)
    if (secondConfirm !== user.name) {
      alert('이름이 일치하지 않습니다.')
      return
    }

    setLoading(true)
    setActionResult(null)

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '사용자 삭제에 실패했습니다.')
      }

      setActionResult({
        type: 'success',
        message: result.message
      })

      // 부모 컴포넌트에 삭제 알림
      if (onUserDelete) {
        onUserDelete(user.id)
      }

      // 2초 후 모달 닫기
      setTimeout(() => {
        onClose()
      }, 2000)

    } catch (error) {
      setActionResult({
        type: 'error',
        message: error instanceof Error ? error.message : '사용자 삭제에 실패했습니다.'
      })
    } finally {
      setLoading(false)
    }
  }

  const roleDisplay = getRoleDisplay(user.role)
  const signupMethodDisplay = getSignupMethodDisplay(user.signup_method || 'phone')
  const RoleIcon = roleDisplay.icon
  const SignupIcon = signupMethodDisplay.icon

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">회원 상세 정보</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 액션 결과 메시지 */}
          {actionResult && (
            <div className={`mb-4 p-3 rounded-md flex items-center ${actionResult.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
              {actionResult.type === 'success' ? (
                <CheckCircle className="w-4 h-4 mr-2" />
              ) : (
                <AlertTriangle className="w-4 h-4 mr-2" />
              )}
              {actionResult.message}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 왼쪽: 사용자 정보 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 프로필 섹션 */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-md">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {user.name[0]}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-medium text-gray-900">{user.name}</h4>
                  <p className="text-gray-600">@{user.username}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${roleDisplay.color}`}>
                      <RoleIcon className="w-4 h-4 mr-1" />
                      {roleDisplay.text}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${signupMethodDisplay.color}`}>
                      <SignupIcon className="w-3 h-3 mr-1" />
                      {signupMethodDisplay.text}
                    </span>
                  </div>
                </div>
              </div>

              {/* 기본 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                  <div className="flex items-center text-gray-900">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    {user.phone}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">소속</label>
                  <div className="flex items-center text-gray-900">
                    <Building className="w-4 h-4 mr-2 text-gray-400" />
                    {user.company || '정보 없음'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
                  <div className="flex items-center text-gray-900">
                    <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
                    {getGenderDisplay(user.gender)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">생년월일</label>
                  <div className="flex items-center text-gray-900">
                    <Heart className="w-4 h-4 mr-2 text-gray-400" />
                    {user.birth_date}
                  </div>
                </div>

                {/* 소셜 로그인 사용자의 경우 이메일 표시 */}
                {isSocialUser && user.email && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                    <div className="flex items-center text-gray-900">
                      <Globe className="w-4 h-4 mr-2 text-gray-400" />
                      {user.email}
                    </div>
                  </div>
                )}
              </div>

              {/* 계정 정보 */}
              <div className="border-t pt-4">
                <h5 className="font-medium text-gray-900 mb-3">계정 정보</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">가입일</label>
                    <div className="flex items-center text-gray-900">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {formatDateTime(user.created_at)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">최근 로그인</label>
                    <div className="flex items-center text-gray-900">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {formatDateTime(user.last_login_at)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">최근 활동</label>
                    <div className="flex items-center text-gray-900">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {formatDateTime(user.last_activity_at)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">정보 수정일</label>
                    <div className="flex items-center text-gray-900">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {formatDateTime(user.updated_at)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 오른쪽: 관리자 액션 */}
            <div className="space-y-4">
              <h5 className="font-medium text-gray-900 mb-3">관리자 액션</h5>

              {/* 정보 수정 */}
              <button
                onClick={() => setShowEditModal(true)}
                disabled={loading}
                className="w-full flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Settings className="w-4 h-4 mr-2" />
                정보 수정
              </button>

              {/* 권한 빠른 변경 */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">권한 변경</p>
                <div className="grid grid-cols-1 gap-2">
                  {user.role !== 'user' && (
                    <button
                      onClick={() => handleQuickRoleChange('user')}
                      disabled={loading}
                      className="flex items-center justify-center px-3 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      일반회원으로
                    </button>
                  )}
                  {user.role !== 'editor' && (
                    <button
                      onClick={() => handleQuickRoleChange('editor')}
                      disabled={loading}
                      className="flex items-center justify-center px-3 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      편집자로
                    </button>
                  )}
                  {user.role !== 'admin' && (
                    <button
                      onClick={() => handleQuickRoleChange('admin')}
                      disabled={loading}
                      className="flex items-center justify-center px-3 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      관리자로
                    </button>
                  )}
                </div>
              </div>

              {/* 비밀번호 초기화 - 소셜 로그인 사용자는 숨김 */}
              {!isSocialUser && (
                <button
                  onClick={handlePasswordReset}
                  disabled={loading}
                  className="w-full flex items-center justify-center px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50"
                >
                  <Key className="w-4 h-4 mr-2" />
                  비밀번호 초기화
                </button>
              )}

              {/* 소셜 로그인 사용자에게는 안내 메시지 */}
              {isSocialUser && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 text-blue-600 mr-2" />
                    <p className="text-sm text-blue-800">
                      소셜 로그인 사용자는 비밀번호 관리가 불필요합니다.
                    </p>
                  </div>
                </div>
              )}

              {/* 사용자 삭제 */}
              <button
                onClick={handleUserDelete}
                disabled={loading}
                className="w-full flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                계정 삭제
              </button>

              <div className="text-xs text-gray-500 mt-4">
                <p>※ 초기화된 비밀번호는 가입자의 전화번호(- 제외)로 초기화됩니다.</p>
                {isSocialUser && (
                  <p className="text-blue-600 mt-2">※ 소셜 로그인 계정은 해당 플랫폼에서 관리됩니다.</p>
                )}
              </div>
            </div>
          </div>

          {/* 닫기 버튼 */}
          <div className="flex justify-end pt-6 border-t mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
      {/* 사용자 정보 수정 모달 */}
      <UserEditModal
        user={user}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleUserEdit}
      />
    </>
  )
}