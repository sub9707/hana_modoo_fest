// app/admin/users/page.tsx
import React from 'react'
import { User } from '@/types/auth'
import UserStats from '@/components/admin/UserManagement/UserStats'
import UsersManagementClient from '@/components/admin/UserManagement/UserManagementClient'


// DDL 구조에 맞는 샘플 데이터
const sampleUsers: User[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: '김관리',
    username: 'admin_kim',
    company: '모두하나대축제 운영위원회',
    gender: 'male',
    birth_date: '1985-03-15',
    phone: '010-1234-5678',
    role: 'admin',
    last_login_at: '2024-12-28 09:30:00',
    last_activity_at: '2024-12-28 14:25:00',
    created_at: '2024-01-15 10:00:00',
    updated_at: '2024-12-28 14:25:00'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: '이편집',
    username: 'editor_lee',
    company: '축제콘텐츠팀',
    gender: 'female',
    birth_date: '1990-07-22',
    phone: '010-2345-6789',
    role: 'editor',
    last_login_at: '2024-12-27 16:45:00',
    last_activity_at: '2024-12-27 18:20:00',
    created_at: '2024-02-20 14:30:00',
    updated_at: '2024-12-27 18:20:00'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: '박참가',
    username: 'user_park',
    company: '한국대학교',
    gender: 'male',
    birth_date: '1995-11-08',
    phone: '010-3456-7890',
    role: 'user',
    last_login_at: '2024-12-28 08:15:00',
    last_activity_at: '2024-12-28 12:40:00',
    created_at: '2024-03-10 11:20:00',
    updated_at: '2024-12-28 12:40:00'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: '정수연',
    username: 'suyeon_jung',
    company: '서울시립대학교',
    gender: 'female',
    birth_date: '1998-05-14',
    phone: '010-4567-8901',
    role: 'user',
    last_login_at: '2024-12-26 20:30:00',
    last_activity_at: '2024-12-26 21:15:00',
    created_at: '2024-03-25 09:45:00',
    updated_at: '2024-12-26 21:15:00'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: '홍길동',
    username: 'gildong_hong',
    company: '연세대학교',
    gender: 'male',
    birth_date: '1996-12-03',
    phone: '010-5678-9012',
    role: 'user',
    last_login_at: '2024-12-25 14:20:00',
    last_activity_at: '2024-12-25 15:30:00',
    created_at: '2024-04-05 16:10:00',
    updated_at: '2024-12-25 15:30:00'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    name: '안지혜',
    username: 'jihye_ahn',
    company: '고려대학교',
    gender: 'female',
    birth_date: '1997-09-18',
    phone: '010-6789-0123',
    role: 'editor',
    last_login_at: '2024-12-28 11:00:00',
    last_activity_at: '2024-12-28 13:45:00',
    created_at: '2024-04-15 13:25:00',
    updated_at: '2024-12-28 13:45:00'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    name: '최민호',
    username: 'minho_choi',
    company: '부산대학교',
    gender: 'male',
    birth_date: '1994-01-27',
    phone: '010-7890-1234',
    role: 'user',
    last_login_at: '2024-12-24 09:10:00',
    last_activity_at: '2024-12-24 10:25:00',
    created_at: '2024-05-01 10:40:00',
    updated_at: '2024-12-24 10:25:00'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440008',
    name: '강소영',
    username: 'soyoung_kang',
    company: '이화여자대학교',
    gender: 'female',
    birth_date: '1999-04-11',
    phone: '010-8901-2345',
    role: 'user',
    last_login_at: '2024-12-28 07:30:00',
    last_activity_at: '2024-12-28 09:15:00',
    created_at: '2024-05-10 15:55:00',
    updated_at: '2024-12-28 09:15:00'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440009',
    name: '윤현수',
    username: 'hyunsu_yoon',
    company: '중앙대학교',
    gender: 'male',
    birth_date: '1993-08-25',
    phone: '010-9012-3456',
    role: 'admin',
    last_login_at: '2024-12-28 13:20:00',
    last_activity_at: '2024-12-28 15:10:00',
    created_at: '2024-06-01 12:15:00',
    updated_at: '2024-12-28 15:10:00'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440010',
    name: '조미라',
    username: 'mira_jo',
    company: '동국대학교',
    gender: 'female',
    birth_date: '1996-10-07',
    phone: '010-0123-4567',
    role: 'editor',
    last_login_at: '2024-12-27 19:45:00',
    last_activity_at: '2024-12-27 20:30:00',
    created_at: '2024-06-15 08:30:00',
    updated_at: '2024-12-27 20:30:00'
  }
]

// 서버에서 사용자 데이터를 가져오는 함수
async function getUsers(): Promise<User[]> {
  // 실제 환경에서는 데이터베이스나 API에서 데이터를 가져옵니다
  // const users = await fetch('/api/users').then(res => res.json())
  return sampleUsers
}

// 통계 계산 함수 (서버에서 실행)
function calculateStats(users: User[]) {
  const now = new Date()
  
  return {
    total: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    editor: users.filter(u => u.role === 'editor').length,
    user: users.filter(u => u.role === 'user').length,
    newThisMonth: users.filter(user => {
      const userDate = new Date(user.created_at)
      return (now.getTime() - userDate.getTime()) <= (30 * 24 * 60 * 60 * 1000)
    }).length
  }
}

export default async function UsersPage() {
  // 서버에서 데이터 가져오기
  const users = await getUsers()
  const stats = calculateStats(users)

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
}