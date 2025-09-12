import { Metadata } from 'next'
import RegistrationSuccess from '@/components/registration/RegistrationSuccess'
import type { User } from '@/types/auth'

export const metadata: Metadata = {
  title: '신청 완료',
  description: '모두하나대축제 2025 사전참가 신청이 완료되었습니다.',
}

interface PageProps {
  searchParams: { id?: string }
}

export default async function RegistrationSuccessPage({ searchParams }: PageProps) {
  // 디자인 확인을 위한 더미 데이터
  const dummyUser: User = {
    id: 'dummy-user-123',
    name: '김한부모',
    username: 'kimhanbumo',
    gender: 'female',
    birth_date: '1985-03-15',
    phone: '010-1234-5678',
    role: 'user',
    created_at: '2025-01-01T00:00:00Z',
    last_login_at: '2025-09-12T10:00:00Z',
    last_activity_at: '2025-09-12T14:30:00Z'
  }

  const dummyRegistration = {
    // id: searchParams.id || 'dummy-reg-123',
    id: 'dummy-reg-123',
    registrationNumber: 'MH2025-A1B2C3D4',
    createdAt: '2025-09-12T14:30:00Z',
    status: 'confirmed',
    participantType: 'single-parent',
    companions: 2,
    selectedPrograms: ['opening', 'concert', 'photo'],
    email: 'user@example.com',
    smsConsent: true,
    marketingConsent: true
  }

  return (
    <RegistrationSuccess 
      user={dummyUser}
      registration={dummyRegistration}
    />
  )
}