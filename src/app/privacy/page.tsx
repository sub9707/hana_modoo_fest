import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '개인정보처리방침',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">개인정보처리방침</h1>
        <div className="prose prose-slate max-w-none">
          <p>서울특별시한부모가족지원센터는 개인정보보호법에 따라 이용자의 개인정보 보호 및 권익을 보호하고자 다음과 같은 처리방침을 두고 있습니다.</p>
          {/* 개인정보처리방침 내용... */}
        </div>
      </div>
    </div>
  )
}