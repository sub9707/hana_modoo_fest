// app/admin/users/page.tsx
import React from 'react'
import { redirect } from 'next/navigation'
import { requireAuth, requireRole } from '@/lib/mysql/server'
import UserStats from '@/components/admin/UserManagement/UserStats'
import UsersManagementClient from '@/components/admin/UserManagement/UserManagementClient'
import { getAllUsers, getUserStats } from '@/lib/services/users-service'

export default async function UsersPage() {
  try {
    // 인증 및 권한 확인
    const currentUser = await requireAuth()
    await requireRole('admin') // 관리자만 접근 가능
    
    // 서버에서 데이터 가져오기
    const [users, stats] = await Promise.all([
      getAllUsers(),
      getUserStats()
    ])

    return (
      <div className="space-y-6">
        {/* 헤더 */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">회원 관리</h1>
            <p className="mt-1 text-sm text-gray-600">
              축제 참가자 및 운영진의 정보를 관리하고 권한을 설정하세요
            </p>
          </div>
        </div>

        {/* 통계 카드 (서버 컴포넌트) */}
        <UserStats stats={stats} />

        {/* 클라이언트 컴포넌트로 위임 */}
        <UsersManagementClient initialUsers={users} initialStats={stats} />
      </div>
    )
  } catch (error) {
    console.error('Admin users page error:', error)
    
    // 권한 없음 또는 인증 실패 시 리다이렉트
    if (error instanceof Error) {
      if (error.message === 'Authentication required') {
        redirect('/login')
      } else if (error.message === 'Insufficient permissions') {
        redirect('/dashboard')
      }
    }
    
    // 기타 에러
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">오류 발생</h1>
          <p className="text-gray-600">
            {error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'}
          </p>
        </div>
      </div>
    )
  }
}