import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { getCurrentUser } from '@/lib/mysql/server'
import RegistrationHero from '@/components/registration/RegistrationHero'
import RegistrationForm from '@/components/forms/RegistrationForm'
import ExistingRegistration from '@/components/registration/ExisitingRegistration'
import RegistrationClosed from '@/components/registration/RegistrationClosed'
import type { Registration } from '@/types/registration'
import { Loader2 } from 'lucide-react'
import { isRegistrationClosed } from '@/lib/utils/registration-deadline'
import PageLayout from '@/components/layout/PageLayout'
import { PAGE_SEO, SITE, ROUTES } from '@/constants'

export const metadata: Metadata = {
  title: PAGE_SEO.registration.title,
  description: `${SITE.fullName} 사전참가 신청을 해주세요. 원활한 축제 참여를 위해 사전신청을 권장합니다.`,
  robots: {
    index: false,
    follow: false
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

function RegistrationLoading() {
  return (
    <PageLayout variant="gray">
      <RegistrationHero />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden p-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
            <p className="text-gray-600 text-lg">사전참가 신청 페이지를 로딩 중입니다...</p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

async function RegistrationContent() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(`${ROUTES.login}?callbackUrl=${ROUTES.registration}&message=` +
      encodeURIComponent('사전참가 신청은 로그인이 필요합니다.'))
  }

  if (!user.phone || !user.name) {
    redirect(`${ROUTES.myPage}?message=` +
      encodeURIComponent('프로필 정보를 먼저 입력해주세요.'))
  }

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

  // 테스트 앱: 마감 체크 제거 - 항상 접수 가능
  const isClosed = false

  return (
    <>
      <RegistrationHero />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isClosed && !registration ? (
          <RegistrationClosed />
        ) : (
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
        )}
      </div>
    </>
  )
}

export default function RegistrationPage() {
  return (
    <PageLayout variant="gray">
      <Suspense fallback={<RegistrationLoading />}>
        <RegistrationContent />
      </Suspense>
    </PageLayout>
  )
}