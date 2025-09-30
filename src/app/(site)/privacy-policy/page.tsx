import { Metadata } from 'next'
import PrivacyPolicyContent from '@/components/legal/PrivacyPolicyContent'

// NextJS 15 메타데이터 API 활용 - SEO 최적화
export const metadata: Metadata = {
  title: '개인정보 처리방침 | 모두하나대축제 2025',
  description: '모두하나대축제 2025의 개인정보 처리방침입니다. 개인정보 수집, 이용, 보관, 파기에 대한 상세한 내용을 확인하세요.',
  keywords: '개인정보처리방침, 개인정보보호, 모두하나대축제, 카카오로그인',
  robots: {
    follow: false,
    index: false
  },
  openGraph: {
    title: '개인정보 처리방침 | 모두하나대축제 2025',
    description: '모두하나대축제 2025의 개인정보 처리방침',
    type: 'website',
    locale: 'ko_KR',
    images: [
      {
        url: '/images/modoo_hana_image.png',
        width: 332,
        height: 265,
        alt: '모두하나대축제 2025 로고',
      },
    ],
  },
  alternates: {
    canonical: '/privacy-policy'
  },
  icons: {
    icon: '/favicon.ico',
  },
}

// NextJS 15 Server Component 활용
export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-paper">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* 헤더 */}
          <div className="bg-gradient-to-r from-orange-600 to-yellow-600 text-white p-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              개인정보 처리방침
            </h1>
            <p className="text-blue-100 text-lg">
              모두하나대축제 2025 개인정보 보호 정책
            </p>
            <div className="mt-4 text-sm text-blue-200">
              최종 수정일: {new Date().toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          {/* 컨텐츠 */}
          <div className="p-8">
            <PrivacyPolicyContent />
          </div>

          {/* 푸터 */}
          <div className="bg-gray-50 border-t border-gray-200 p-6">
            <div className="text-center text-sm text-gray-600">
              <p className="mb-2">
                개인정보 처리방침에 대한 문의사항이 있으시면 아래로 연락주세요.
              </p>
              <div className="space-y-1">
                <p><strong>이메일:</strong> hanbumo1@seoul.go.kr</p>
                <p><strong>전화:</strong> 02-861-3020</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}