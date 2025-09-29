import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/mysql/server'
import RegistrationHero from '@/components/registration/RegistrationHero'
import RegistrationForm from '@/components/forms/RegistrationForm'
import ExistingRegistration from '@/components/registration/ExisitingRegistration'
import type { Registration } from '@/types/registration'

export const metadata: Metadata = {
  title: '사전참가 신청',
  description: '모두하나대축제 2025 사전참가 신청을 해주세요. 원활한 축제 참여를 위해 사전신청을 권장합니다.',
  openGraph: {
    title: '사전참가 신청 | 모두하나대축제 2025',
    description: '축제 참가 신청을 통해 더 많은 혜택을 받으세요.',
    images: [
      {
        url: '/images/modoo_hana_image.png',
        width: 332,
        height: 265,
        alt: '모두하나대축제 2025 로고',
      },
    ],
  },
}

export default async function RegistrationPage() {
  // 서버에서 현재 사용자 정보 가져오기
  const user = await getCurrentUser()

  // 로그인하지 않은 사용자는 리다이렉트
  if (!user) {
    redirect('/login?callbackUrl=/registration')
  }

  // 기존 참가신청 조회 (서버사이드에서 직접 DB 조회)
  const { queryOne } = await import('@/lib/mysql/connection')
  const existingRegistration = await queryOne(
    `SELECT r.*, u.name as user_name, u.phone as user_phone 
     FROM registrations r 
     JOIN users u ON r.user_id = u.id 
     WHERE r.user_id = ? AND r.status != 'cancelled'`,
    [user.id]
  )

  const registration = existingRegistration ? {
    id: existingRegistration.id,
    user_id: existingRegistration.user_id,
    registration_number: existingRegistration.registration_number,
    participant_type: existingRegistration.participant_type,
    companions: existingRegistration.companions,
    companion_details: existingRegistration.companion_details,
    address: existingRegistration.address,
    address_detail: existingRegistration.address_detail,
    zip_code: existingRegistration.zip_code,
    special_requests: existingRegistration.special_requests,
    marketing_consent: existingRegistration.marketing_consent === 1,
    privacy_consent: existingRegistration.privacy_consent === 1,
    status: existingRegistration.status,
    created_at: existingRegistration.created_at,
    updated_at: existingRegistration.updated_at,
    user_name: existingRegistration.user_name,
    user_phone: existingRegistration.user_phone
  } as Registration & { user_name: string; user_phone: string } : null

  return (
    <div className="min-h-screen bg-gray-50 font-paper">
      {/* 히어로 섹션 */}
      <RegistrationHero />

      {/* 메인 콘텐츠 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {registration ? (
            // 이미 신청한 경우 - 기존 신청 정보 표시
            <>
              <div className="bg-gradient-to-r from-orange-400 to-pink-500 text-white p-6">
                <h2 className="text-2xl font-bold mb-2">참가신청 완료</h2>
                <p className="opacity-90">
                  이미 사전참가 신청을 완료하셨습니다.
                </p>
              </div>

              <div className="p-6">
                <ExistingRegistration
                  user={user}
                  registration={registration}
                />
              </div>
            </>
          ) : (
            // 아직 신청하지 않은 경우 - 신청 폼 표시
            <>
              <div className="bg-gradient-to-r from-orange-400 to-pink-500 text-white p-6">
                <h2 className="text-2xl font-bold mb-2">사전참가 신청서</h2>
                <p className="opacity-90">
                  축제 당일 원활한 참여를 위해 사전신청을 해주세요.
                </p>
              </div>

              <div className="p-6">
                <RegistrationForm user={user} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}