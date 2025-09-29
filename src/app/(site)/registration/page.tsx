import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { getCurrentUser } from '@/lib/mysql/server'
import RegistrationHero from '@/components/registration/RegistrationHero'
import RegistrationForm from '@/components/forms/RegistrationForm'
import ExistingRegistration from '@/components/registration/ExisitingRegistration'
import type { Registration } from '@/types/registration'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: '사전참가 신청',
  description: '모두하나대축제 2025 사전참가 신청을 해주세요. 원활한 축제 참여를 위해 사전신청을 권장합니다.',
}

// ✅ NextJS 15: 캐시 무효화 설정 추가
export const dynamic = 'force-dynamic'
export const revalidate = 0

// 로딩 컴포넌트
function RegistrationLoading() {
  return (
    <div className="min-h-screen bg-gray-50 font-paper">
      <RegistrationHero />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
            <p className="text-gray-600 text-lg">사전참가 신청 페이지를 로딩 중입니다...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// 실제 컨텐츠 컴포넌트
async function RegistrationContent() {
  console.log('[RegistrationContent] 렌더링 시작')
  
  // 서버에서 현재 사용자 정보 가져오기
  const user = await getCurrentUser()
  
  console.log('[RegistrationContent] 사용자 조회 결과:', user ? `${user.name}(${user.id})` : 'null')

  // 로그인하지 않은 사용자는 리다이렉트
  if (!user) {
    console.log('[RegistrationContent] 로그인되지 않음 - 리다이렉트')
    redirect('/login?callbackUrl=/registration&message=' +
      encodeURIComponent('사전참가 신청은 로그인이 필요합니다.'))
  }

  // 사용자 정보 필수 필드 검증
  if (!user.phone || !user.name) {
    console.log('[RegistrationContent] 프로필 정보 불완전 - 리다이렉트')
    redirect('/my-page?message=' +
      encodeURIComponent('프로필 정보를 먼저 입력해주세요.'))
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

  console.log('[RegistrationContent] 기존 신청 조회:', existingRegistration ? '있음' : '없음')

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
    <>
      <RegistrationHero />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {registration ? (
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
    </>
  )
}

// 메인 페이지 컴포넌트
export default function RegistrationPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-paper">
      <Suspense fallback={<RegistrationLoading />}>
        <RegistrationContent />
      </Suspense>
    </div>
  )
}