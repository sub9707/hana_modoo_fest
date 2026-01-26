import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { requireAuth, requireRole } from '@/lib/mysql/server'
import UserStats from '@/components/admin/UserManagement/UserStats'
import UserSignupChart from '@/components/admin/UserManagement/UserSignUpChart'
import UsersManagementClient from '@/components/admin/UserManagement/UserManagementClient'
import { getAllUsers, getUserStatsExtended } from '@/lib/services/users-service'
import { PageLoadingSpinner } from '@/components/admin/ui/LoadingSpinner'

export const dynamic = 'force-dynamic'

async function UsersContent() {
  const [users, extendedStats] = await Promise.all([
    getAllUsers(),
    getUserStatsExtended()
  ])

  const { dailySignups, ...basicStats } = extendedStats

  return (
    <>
      <UserStats stats={basicStats} />
      <UserSignupChart data={dailySignups} />
      <UsersManagementClient initialUsers={users} initialStats={basicStats} />
    </>
  )
}

export default async function UsersPage() {
  try {
    await requireAuth()
    await requireRole('admin')

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">회원 관리</h1>
            <p className="mt-1 text-sm text-gray-600">
              축제 참가자 및 운영진의 정보를 관리하고 권한을 설정하세요
            </p>
          </div>
        </div>

        <Suspense fallback={<PageLoadingSpinner text="회원 정보를 불러오는 중..." />}>
          <UsersContent />
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error('Admin users page error:', error)

    if (error instanceof Error) {
      if (error.message === 'Authentication required') {
        redirect('/login')
      } else if (error.message === 'Insufficient permissions') {
        redirect('/')
      }
    }

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
