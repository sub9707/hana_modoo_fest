import { getCurrentUser } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import LogoutButton from '@/components/auth/LogoutButton'

export const metadata: Metadata = {
  title: '대시보드 | 모두하나대축제 2025',
  description: '모두하나대축제 2025 대시보드입니다.',
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'editor':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'user':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return '관리자'
      case 'editor':
        return '편집자'
      case 'user':
        return '일반 사용자'
      default:
        return role
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                대시보드
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                모두하나대축제 2025에 오신 것을 환영합니다
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* 사용자 정보 카드 */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                사용자 정보
              </h3>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">이름</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">사용자명</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.username}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">권한</dt>
                  <dd className="mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                        user.role
                      )}`}
                    >
                      {getRoleLabel(user.role)}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">가입일</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(user.created_at).toLocaleDateString('ko-KR')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">성별</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user.gender === 'male' ? '남성' : user.gender === 'female' ? '여성' : '기타'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">생년월일</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(user.birth_date).toLocaleDateString('ko-KR')}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* 권한별 메뉴 */}
          <div className="mt-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  이용 가능한 메뉴
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {/* 모든 사용자 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900">기본 메뉴</h4>
                    <ul className="mt-2 text-sm text-gray-600 space-y-1">
                      <li>• 프로필 관리</li>
                      <li>• 이벤트 조회</li>
                      <li>• 공지사항</li>
                    </ul>
                  </div>

                  {/* 편집자 이상 */}
                  {(user.role === 'editor' || user.role === 'admin') && (
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900">편집자 메뉴</h4>
                      <ul className="mt-2 text-sm text-gray-600 space-y-1">
                        <li>• 콘텐츠 편집</li>
                        <li>• 이벤트 관리</li>
                        <li>• 게시물 작성</li>
                      </ul>
                    </div>
                  )}

                  {/* 관리자만 */}
                  {user.role === 'admin' && (
                    <div className="bg-red-50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900">관리자 메뉴</h4>
                      <ul className="mt-2 text-sm text-gray-600 space-y-1">
                        <li>• 사용자 관리</li>
                        <li>• 시스템 설정</li>
                        <li>• 통계 조회</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}