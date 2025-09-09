import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '이용약관',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">이용약관</h1>
        <div className="prose prose-slate max-w-none">
          <p>모두하나대축제 홈페이지 이용약관입니다.</p>
          {/* 이용약관 내용... */}
        </div>
      </div>
    </div>
  )
}