'use client'

import React, { useState } from 'react'
import { Search, Filter, UserCheck, UserX, Calendar, Mail, Phone, Download, Eye, MoreHorizontal } from 'lucide-react'
import { User } from '@/types/admin'
import { sampleUsers } from '@/data/sampleData'

// 회원 상세 보기 모달
interface UserModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onToggleStatus: (userId: string) => void
}

function UserModal({ user, isOpen, onClose, onToggleStatus }: UserModalProps) {
  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">회원 상세 정보</h3>
        
        <div className="space-y-4">
          {/* 프로필 */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-md">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {user.name[0]}
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">{user.name}</h4>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                user.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {user.status === 'active' ? (
                  <>
                    <UserCheck className="w-4 h-4 mr-1" />
                    활성
                  </>
                ) : (
                  <>
                    <UserX className="w-4 h-4 mr-1" />
                    비활성
                  </>
                )}
              </span>
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <div className="flex items-center text-gray-900">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                {user.email}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
              <div className="flex items-center text-gray-900">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                {user.phone}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">가입일</label>
              <div className="flex items-center text-gray-900">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                {user.registeredAt}
              </div>
            </div>
          </div>

          {/* 활동 통계 */}
          <div className="border-t pt-4">
            <h5 className="font-medium text-gray-900 mb-3">활동 통계</h5>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">3</div>
                <div className="text-gray-600">축제 참여</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">7</div>
                <div className="text-gray-600">댓글 작성</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded">
                <div className="text-2xl font-bold text-purple-600">2</div>
                <div className="text-gray-600">글 작성</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded">
                <div className="text-2xl font-bold text-orange-600">12</div>
                <div className="text-gray-600">좋아요</div>
              </div>
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex justify-between items-center pt-6 border-t mt-6">
          <button
            onClick={() => {
              onToggleStatus(user.id)
              onClose()
            }}
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              user.status === 'active'
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {user.status === 'active' ? (
              <>
                <UserX className="w-4 h-4 mr-1" />
                계정 비활성화
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4 mr-1" />
                계정 활성화
              </>
            )}
          </button>
          
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>(sampleUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('전체') // 전체, 활성, 비활성
  const [dateFilter, setDateFilter] = useState('전체') // 전체, 최근 1주일, 최근 1개월, 최근 3개월
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showModal, setShowModal] = useState(false)

  const statusOptions = ['전체', '활성', '비활성']
  const dateOptions = ['전체', '최근 1주일', '최근 1개월', '최근 3개월']

  // 날짜 필터링 함수
  const filterByDate = (user: User) => {
    if (dateFilter === '전체') return true
    
    const userDate = new Date(user.registeredAt)
    const now = new Date()
    
    switch (dateFilter) {
      case '최근 1주일':
        return (now.getTime() - userDate.getTime()) <= (7 * 24 * 60 * 60 * 1000)
      case '최근 1개월':
        return (now.getTime() - userDate.getTime()) <= (30 * 24 * 60 * 60 * 1000)
      case '최근 3개월':
        return (now.getTime() - userDate.getTime()) <= (90 * 24 * 60 * 60 * 1000)
      default:
        return true
    }
  }

  // 필터링된 사용자 목록
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm)
    
    const matchesStatus = statusFilter === '전체' ||
                         (statusFilter === '활성' && user.status === 'active') ||
                         (statusFilter === '비활성' && user.status === 'inactive')
    
    const matchesDate = filterByDate(user)
    
    return matchesSearch && matchesStatus && matchesDate
  }).sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())

  // 통계 계산
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    newThisMonth: users.filter(user => {
      const userDate = new Date(user.registeredAt)
      const now = new Date()
      return (now.getTime() - userDate.getTime()) <= (30 * 24 * 60 * 60 * 1000)
    }).length
  }

  // 회원 상태 토글
  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ))
  }

  // 회원 정보 엑셀 다운로드
  const handleExportExcel = () => {
    console.log('회원 정보 엑셀 추출 시작...')
    // 실제로는 API 호출하여 엑셀 파일 생성 후 다운로드
  }

  // 회원 상세 보기
  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setShowModal(true)
  }

  // 대량 계정 활성화
  const handleBulkActivate = () => {
    const inactiveUsers = users.filter(u => u.status === 'inactive')
    if (inactiveUsers.length > 0 && confirm(`${inactiveUsers.length}개의 계정을 모두 활성화하시겠습니까?`)) {
      setUsers(users.map(user => ({ ...user, status: 'active' })))
    }
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">회원 관리</h2>
        <div className="flex space-x-3">
          <button 
            onClick={handleBulkActivate}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <UserCheck className="w-4 h-4 mr-2" />
            전체 계정 활성화
          </button>
          <button 
            onClick={handleExportExcel}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            엑셀 다운로드
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">전체 회원</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">활성 회원</h3>
          <p className="text-3xl font-bold text-green-600">{stats.active}</p>
          <p className="text-sm text-gray-500 mt-1">
            {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}%
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">비활성 회원</h3>
          <p className="text-3xl font-bold text-red-600">{stats.inactive}</p>
          <p className="text-sm text-gray-500 mt-1">
            {stats.total > 0 ? Math.round((stats.inactive / stats.total) * 100) : 0}%
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">신규 가입</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.newThisMonth}</p>
          <p className="text-sm text-gray-500 mt-1">최근 1개월</p>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* 검색창 */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="이름, 이메일, 연락처로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* 상태 필터 */}
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          {/* 가입일 필터 */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {dateOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 가입 추이 차트 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">월별 가입 추이</h3>
        <div className="h-48 flex items-center justify-center bg-gray-50 rounded-md">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-gray-500">차트 영역</p>
            <p className="text-sm text-gray-400">Chart.js 또는 Recharts 연동</p>
          </div>
        </div>
      </div>

      {/* 회원 목록 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            회원 목록 ({filteredUsers.length}명)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  회원정보
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  연락처
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  가입일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                        {user.name[0]}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {user.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' ? (
                        <>
                          <UserCheck className="w-3 h-3 mr-1" />
                          활성
                        </>
                      ) : (
                        <>
                          <UserX className="w-3 h-3 mr-1" />
                          비활성
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {user.registeredAt}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="상세 보기"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`p-1 rounded transition-colors ${
                          user.status === 'active'
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={user.status === 'active' ? '비활성화' : '활성화'}
                      >
                        {user.status === 'active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                      
                      <button
                        className="p-1 text-gray-400 hover:bg-gray-50 rounded transition-colors"
                        title="더보기"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* 결과 없음 메시지 */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {users.length === 0 
                ? '등록된 회원이 없습니다.' 
                : '검색 조건에 맞는 회원이 없습니다.'
              }
            </p>
          </div>
        )}
      </div>

      {/* 회원 상세 보기 모달 */}
      <UserModal
        user={selectedUser}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedUser(null)
        }}
        onToggleStatus={toggleUserStatus}
      />
    </div>
  )
}