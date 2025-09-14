'use client'

import React, { useState, useMemo } from 'react'
import { Download, UserCheck } from 'lucide-react'
import SearchAndFilters from './SearchAndFilters'
import ChartSection from './ChartSection'
import UserTable from './UserTable'
import UserModal from './UserModal'
import { User } from '@/types/auth'


type SortField = 'name' | 'username' | 'company' | 'role' | 'created_at' | 'last_login_at'
type SortOrder = 'asc' | 'desc'

interface UsersManagementClientProps {
  initialUsers: User[]
  initialStats: {
    total: number
    admin: number
    editor: number
    user: number
    newThisMonth: number
  }
}

export default function UsersManagementClient({ 
  initialUsers, 
  initialStats 
}: UsersManagementClientProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('전체')
  const [dateFilter, setDateFilter] = useState('전체')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  // 날짜 필터링 함수
  const filterByDate = (user: User) => {
    if (dateFilter === '전체') return true
    
    const userDate = new Date(user.created_at)
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

  // 정렬 함수
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  // 필터링된 및 정렬된 사용자 목록 (메모이제이션)
  const filteredAndSortedUsers = useMemo(() => {
    // 필터링
    const filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           user.phone.includes(searchTerm)
      
      const matchesRole = roleFilter === '전체' ||
                         (roleFilter === '관리자' && user.role === 'admin') ||
                         (roleFilter === '편집자' && user.role === 'editor') ||
                         (roleFilter === '일반회원' && user.role === 'user')
      
      const matchesDate = filterByDate(user)
      
      return matchesSearch && matchesRole && matchesDate
    })

    // 정렬
    return filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField) {
        case 'name':
          aValue = a.name
          bValue = b.name
          break
        case 'username':
          aValue = a.username
          bValue = b.username
          break
        case 'company':
          aValue = a.company || ''
          bValue = b.company || ''
          break
        case 'role':
          aValue = a.role
          bValue = b.role
          break
        case 'created_at':
          aValue = new Date(a.created_at)
          bValue = new Date(b.created_at)
          break
        case 'last_login_at':
          aValue = new Date(a.last_login_at || '1970-01-01')
          bValue = new Date(b.last_login_at || '1970-01-01')
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }, [users, searchTerm, roleFilter, dateFilter, sortField, sortOrder])

  // 회원 정보 엑셀 다운로드
  const handleExportExcel = () => {
    console.log('회원 정보 엑셀 추출 시작...')
    alert('엑셀 파일이 다운로드됩니다.')
    // 실제로는 API 호출하여 엑셀 파일 생성 후 다운로드
  }

  // 회원 상세 보기
  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setShowModal(true)
  }


  return (
    <>
      {/* 액션 버튼 */}
      <div className="flex justify-end space-x-3">
        <button 
          onClick={handleExportExcel}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          엑셀 다운로드
        </button>
      </div>

      {/* 검색 및 필터 */}
      <SearchAndFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />

      {/* 가입 추이 차트 */}
      <ChartSection />

      {/* 회원 목록 테이블 */}
      <UserTable
        users={filteredAndSortedUsers}
        onViewUser={handleViewUser}
        onSort={handleSort}
        sortField={sortField}
        sortOrder={sortOrder}
      />

      {/* 회원 상세 보기 모달 */}
      <UserModal
        user={selectedUser}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setSelectedUser(null)
        }}
      />
    </>
  )
}