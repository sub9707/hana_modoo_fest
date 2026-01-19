import { Metadata } from 'next'
import TermsOfServiceContent from '@/components/legal/TermOfServiceContent'
import { PAGE_SEO, SITE, CONTACT } from '@/constants'

export const metadata: Metadata = {
  title: `${PAGE_SEO.termsOfService.title} | ${SITE.fullName}`,
  description: `${SITE.fullName} 서비스 이용약관`,
  robots: {
    follow: false,
    index: false
  },
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-paper">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* 헤더 */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              서비스 이용약관
            </h1>
            <p className="text-blue-100 text-lg">
              모두하나대축제 2025 서비스 이용 약관
            </p>
            <div className="mt-4 text-sm text-blue-200">
              시행일자: 2025년 {new Date().getMonth() + 1}월 {new Date().getDate()}일
            </div>
          </div>

          {/* 컨텐츠 */}
          <div className="p-8">
            <TermsOfServiceContent />
          </div>

          {/* 푸터 */}
          <div className="bg-gray-50 border-t border-gray-200 p-6">
            <div className="text-center text-sm text-gray-600">
              <p className="mb-2">
                이용약관에 대한 문의사항이 있으시면 아래로 연락주세요.
              </p>
              <div className="space-y-1">
                <p><strong>이메일:</strong> {CONTACT.email}</p>
                <p><strong>전화:</strong> {CONTACT.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}