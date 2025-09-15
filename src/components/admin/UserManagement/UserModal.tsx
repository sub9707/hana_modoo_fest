'use client'

import React from 'react'
import { Shield, Users, Edit, Calendar, User as UserIcon, Phone, Building, Heart } from 'lucide-react'
import { User } from '@/types/auth'

interface UserModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
}

export default function UserModal({ user, isOpen, onClose }: UserModalProps) {
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
      case 'male':
        return '남성'
      case 'female':
        return '여성'
      case 'none':
        return '비공개'
      default:
        return '비공개'
    }
  }

  const getNextRole = (currentRole: string) => {
    switch (currentRole) {
      case 'user':
        return '편집자로 승급'
      case 'editor':
        return '관리자로 승급'
      case 'admin':
        return '일반회원으로 강등'
      default:
        return '권한 변경'
    }
  }

  const formatDateTime = (dateTimeString?: string) => {
    if (!dateTimeString) return '정보 없음'
    return new Date(dateTimeString).toLocaleString('ko-KR')
  }

  const calculateAge = (birthDate: string) => {
    return new Date().getFullYear() - new Date(birthDate).getFullYear()
  }

  const roleDisplay = getRoleDisplay(user.role)
  const RoleIcon = roleDisplay.icon

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">회원 상세 정보</h3>
        
        <div className="space-y-6">
          {/* 프로필 섹션 */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-md">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {user.name[0]}
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-medium text-gray-900">{user.name}</h4>
              <p className="text-gray-600">@{user.username}</p>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium mt-2 ${roleDisplay.color}`}>
                <RoleIcon className="w-4 h-4 mr-1" />
                {roleDisplay.text}
              </span>
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

          {/* 활동 통계 */}
          <div className="border-t pt-4">
            <h5 className="font-medium text-gray-900 mb-3">활동 통계</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">5</div>
                <div className="text-gray-600">축제 참여</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-gray-600">댓글 작성</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded">
                <div className="text-2xl font-bold text-purple-600">3</div>
                <div className="text-gray-600">글 작성</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded">
                <div className="text-2xl font-bold text-orange-600">28</div>
                <div className="text-gray-600">좋아요</div>
              </div>
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex justify-between items-center pt-6 border-t mt-6">
          
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}