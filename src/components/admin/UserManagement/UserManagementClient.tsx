'use client'

import React, { useState, useMemo } from 'react'
import { Download, UserCheck, RefreshCw, UserPlus } from 'lucide-react'
import SearchAndFilters from './SearchAndFilters'
import ChartSection from './ChartSection'
import UserTable from './UserTable'
import { User } from '@/types/auth'
import { UserStats } from '@/lib/services/users-service'

// 강화된 UserModal import
const UserModal = React.lazy(() => import('./UserModal'))

type SortField = 'name' | 'username' | 'company' | 'role' | 'created_at' | 'last_login_at'
type SortOrder = 'asc' | 'desc'

interface UsersManagementClientProps {
  initialUsers: User[]
  initialStats: UserStats
}

export default function UsersManagementClient({ 
  initialUsers, 
  initialStats 
}: UsersManagementClientProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [stats, setStats] = useState(initialStats)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('전체')
  const [dateFilter, setDateFilter] = useState('전체')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [loading, setLoading] = useState(false)

  // 통계 재계산 함수
  const calculateSimpleStats = (userList: User[]) => {
    const now = new Date()
    return {
      total: userList.length,
      admin: userList.filter(u => u.role === 'admin').length,
      editor: userList.filter(u => u.role === 'editor').length,
      user: userList.filter(u => u.role === 'user').length,
      newThisMonth: userList.filter(user => {
        const userDate = new Date(user.created_at)
        return (now.getTime() - userDate.getTime()) <= (30 * 24 * 60 * 60 * 1000)
      }).length
    }
  }

  // 사용자 목록 새로고침
  const refreshUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/users')
      if (!response.ok) {
        throw new Error('사용자 목록을 가져오는데 실패했습니다.')
      }
      const updatedUsers = await response.json()
      setUsers(updatedUsers)
      
      const simpleStats = calculateSimpleStats(updatedUsers)
      setStats(prevStats => ({
        ...prevStats,
        ...simpleStats
      }))

      // 현재 선택된 사용자가 있다면 업데이트
      if (selectedUser) {
        const updatedSelectedUser = updatedUsers.find((u: User) => u.id === selectedUser.id)
        if (updatedSelectedUser) {
          setSelectedUser(updatedSelectedUser)
        }
      }

    } catch (error) {
      console.error('Error refreshing users:', error)
      alert(error instanceof Error ? error.message : '사용자 목록 새로고침에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 사용자 업데이트 핸들러 (모달에서 호출)
  const handleUserUpdate = (updatedUser: User) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    )
    
    // 통계 업데이트
    const updatedUsers = users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    )
    const simpleStats = calculateSimpleStats(updatedUsers)
    setStats(prevStats => ({
      ...prevStats,
      ...simpleStats
    }))

    // 선택된 사용자 정보 업데이트
    setSelectedUser(updatedUser)
  }

  // 사용자 삭제 핸들러 (모달에서 호출)
  const handleUserDelete = (deletedUserId: string) => {
    const updatedUsers = users.filter(user => user.id !== deletedUserId)
    setUsers(updatedUsers)
    
    // 통계 업데이트
    const simpleStats = calculateSimpleStats(updatedUsers)
    setStats(prevStats => ({
      ...prevStats,
      ...simpleStats
    }))

    // 모달 닫기
    setShowModal(false)
    setSelectedUser(null)
  }

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

  // 필터링 및 정렬된 사용자 목록
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
  const handleExportExcel = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/users/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          users: filteredAndSortedUsers,
          filters: { searchTerm, roleFilter, dateFilter }
        }),
      })

      if (!response.ok) {
        throw new Error('엑셀 내보내기에 실패했습니다.')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `회원목록_${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      alert('엑셀 파일이 다운로드되었습니다.')
    } catch (error) {
      console.error('Error exporting excel:', error)
      alert(error instanceof Error ? error.message : '엑셀 내보내기에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 회원 상세 보기
  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setShowModal(true)
  }

  return (
    <div className="space-y-6">
      {/* 액션 버튼 */}
      <div className="flex justify-end space-x-3">
        <button 
          onClick={refreshUsers}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          새로고침
        </button>
        <button 
          onClick={handleExportExcel}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
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

      {/* 강화된 회원 상세 보기 모달 */}
      <React.Suspense fallback={<div>Loading...</div>}>
        <UserModal
          user={selectedUser}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false)
            setSelectedUser(null)
          }}
          onUserUpdate={handleUserUpdate}
          onUserDelete={handleUserDelete}
        />
      </React.Suspense>

      {/* 로딩 오버레이 */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-40">
          <div className="bg-white p-4 rounded-lg flex items-center">
            <RefreshCw className="w-5 h-5 animate-spin mr-2" />
            처리 중...
          </div>
        </div>
      )}
    </div>
  )
}