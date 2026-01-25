import { Metadata } from 'next'
import PrivacyPolicyContent from '@/components/legal/PrivacyPolicyContent'
import PageLayout from '@/components/layout/PageLayout'
import { PAGE_SEO, createPageMetadata, CONTACT } from '@/constants'

export const metadata: Metadata = createPageMetadata(
  PAGE_SEO.privacyPolicy.title,
  PAGE_SEO.privacyPolicy.description,
  { noIndex: true }
)

export default function PrivacyPolicyPage() {
  return (
    <PageLayout variant="gradient-blue-purple">
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
                <p><strong>이메일:</strong> {CONTACT.email}</p>
                <p><strong>전화:</strong> {CONTACT.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}