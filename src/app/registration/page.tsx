import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/mysql/server'
import RegistrationHero from '@/components/registration/RegistrationHero'
import RegistrationForm from '@/components/forms/RegistrationForm'

export const metadata: Metadata = {
  title: '사전참가 신청',
  description: '모두하나대축제 2025 사전참가 신청을 해주세요. 원활한 축제 참여를 위해 사전신청을 권장합니다.',
  openGraph: {
    title: '사전참가 신청 | 모두하나대축제 2025',
    description: '축제 참가 신청을 통해 더 많은 혜택을 받으세요.',
  },
}

// 프로그램 데이터 가져오기 (실제로는 DB에서)
async function getProgramsData() {
  return {
    programs: [
      { id: 'opening', name: '개막식', category: '공식행사', time: '11:00-12:00' },
      { id: 'concert', name: '가족 음악회', category: '공연', time: '13:00-14:00' },
      { id: 'cooking', name: '요리 체험', category: '체험', time: '14:00-15:00' },
      { id: 'craft', name: '만들기 체험', category: '체험', time: '14:30-15:30' },
      { id: 'photo', name: '가족사진 촬영', category: '체험', time: '11:00-16:00' },
      { id: 'single-parent', name: '한부모가족 모임', category: '자조모임', time: '12:00-13:00' },
      { id: 'youth-parent', name: '청소년부모 모임', category: '자조모임', time: '13:30-14:30' },
      { id: 'support', name: '가족지원 상담', category: '연대부스', time: '11:00-16:00' },
      { id: 'welfare', name: '복지 정보 안내', category: '연대부스', time: '11:00-16:00' },
    ]
  }
}

export default async function RegistrationPage() {
  // 서버에서 현재 사용자 정보 가져오기
  const user = await getCurrentUser()
  
  // 로그인하지 않은 사용자는 리다이렉트 (middleware에서도 처리하지만 이중 체크)
  if (!user) {
    redirect('/login?callbackUrl=/registration')
  }

  // 프로그램 데이터 가져오기
  const { programs } = await getProgramsData()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 히어로 섹션 */}
      <RegistrationHero />
      
      {/* 메인 콘텐츠 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* 폼 헤더 */}
          <div className="bg-gradient-to-r from-festival-blue to-festival-purple text-white p-6">
            <h2 className="text-2xl font-bold mb-2">사전참가 신청서</h2>
            <p className="opacity-90">
              축제 당일 원활한 참여를 위해 사전신청을 해주세요. 
              모든 정보는 안전하게 보호됩니다.
            </p>
          </div>
          
          {/* 폼 컴포넌트 */}
          <div className="p-6">
            <RegistrationForm 
              user={user} 
              programs={programs}
            />
          </div>
        </div>
      </div>
    </div>
  )
}