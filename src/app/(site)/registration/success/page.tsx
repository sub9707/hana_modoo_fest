import { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import { getCurrentUser } from '@/lib/mysql/server'
import { queryOne } from '@/lib/mysql/connection'
import RegistrationSuccess from '@/components/registration/RegistrationSuccess'
import type { Registration } from '@/types/registration'

export const metadata: Metadata = {
  title: '신청 완료',
  description: '모두하나대축제 2025 사전참가 신청이 완료되었습니다.',
  robots:{
    index:false,
    follow:false
  }
}

interface PageProps {
  searchParams: { id?: string }
}

export default async function RegistrationSuccessPage({ searchParams }: PageProps) {
  // 현재 사용자 확인
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login?callbackUrl=/registration')
  }

  const params = await searchParams

  // 등록 ID가 제공되지 않은 경우 사용자의 최신 등록 조회
  let registrationId = params.id
  
  if (!registrationId) {
    const latestRegistration = await queryOne(
      'SELECT id FROM registrations WHERE user_id = ? AND status != "cancelled" ORDER BY created_at DESC LIMIT 1',
      [user.id]
    )
    
    if (latestRegistration) {
      registrationId = latestRegistration.id
    } else {
      // 등록이 없으면 등록 페이지로 리다이렉트
      redirect('/registration')
    }
  }

  // 등록 정보 조회
  const registrationData = await queryOne(
    `SELECT r.*, u.name as user_name, u.phone as user_phone 
     FROM registrations r 
     JOIN users u ON r.user_id = u.id 
     WHERE r.id = ? AND r.user_id = ? AND r.status != 'cancelled'`,
    [registrationId, user.id]
  )

  if (!registrationData) {
    notFound()
  }

  const registration = {
    id: registrationData.id,
    registration_number: registrationData.registration_number,
    participant_type: registrationData.participant_type,
    companions: registrationData.companions,
    companion_details: registrationData.companion_details,
    address: registrationData.address,
    address_detail: registrationData.address_detail,
    zip_code: registrationData.zip_code,
    special_requests: registrationData.special_requests,
    marketing_consent: registrationData.marketing_consent === 1,
    privacy_consent: registrationData.privacy_consent === 1,
    status: registrationData.status,
    created_at: registrationData.created_at,
    updated_at: registrationData.updated_at
  } as Registration

  return (
    <RegistrationSuccess 
      user={user}
      registration={registration}
    />
  )
}