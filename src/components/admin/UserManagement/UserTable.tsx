'use client'

import React from 'react'
import { Shield, Users, Edit, Calendar, Clock, ChevronUp, ChevronDown } from 'lucide-react'
import { User } from '@/types/auth'

type SortField = 'name' | 'username' | 'company' | 'role' | 'created_at' | 'last_login_at'
type SortOrder = 'asc' | 'desc'

// 순수 함수들 - 컴포넌트 외부로 이동
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

const formatDateTime = (dateTimeString?: string) => {
  if (!dateTimeString) return '-'
  const date = new Date(dateTimeString)
  return date.toLocaleDateString('ko-KR') + ' ' + date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

interface UserTableProps {
  users: User[]
  onViewUser: (user: User) => void
  onSort: (field: SortField) => void
  sortField: SortField
  sortOrder: SortOrder
}

export default function UserTable({
  users,
  onViewUser,
  onSort,
  sortField,
  sortOrder
}: UserTableProps) {

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => onSort(field)}
      className="flex items-center space-x-1 hover:text-blue-600 transition-colors group"
    >
      <span>{children}</span>
      <div className="flex flex-col">
        <ChevronUp 
          className={`w-3 h-3 ${
            sortField === field && sortOrder === 'asc' 
              ? 'text-blue-600' 
              : 'text-gray-300 group-hover:text-gray-400'
          }`} 
        />
        <ChevronDown 
          className={`w-3 h-3 -mt-1 ${
            sortField === field && sortOrder === 'desc' 
              ? 'text-blue-600' 
              : 'text-gray-300 group-hover:text-gray-400'
          }`} 
        />
      </div>
    </button>
  )

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-900">
          회원 목록 ({users.length}명)
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="name">회원명</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="username">사용자명</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="company">소속</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                연락처/성별
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="role">권한</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="last_login_at">최근 로그인</SortButton>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="created_at">가입일</SortButton>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => {
              const roleDisplay = getRoleDisplay(user.role)
              const RoleIcon = roleDisplay.icon

              return (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                        {user.name[0]}
                      </div>
                      <div className="ml-4">
                        <button
                          onClick={() => onViewUser(user)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        >
                          {user.name}
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.company || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="space-y-1">
                      <div>{user.phone}</div>
                      <div className="text-xs text-gray-400">{getGenderDisplay(user.gender)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-80 ${roleDisplay.color}`}
                    >
                      <RoleIcon className="w-3 h-3 mr-1" />
                      {roleDisplay.text}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDateTime(user.last_login_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDateTime(user.created_at)}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      
      {/* 결과 없음 메시지 */}
      {users.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">검색 조건에 맞는 회원이 없습니다.</p>
        </div>
      )}
    </div>
  )
}