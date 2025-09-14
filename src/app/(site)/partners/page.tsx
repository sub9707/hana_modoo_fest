import { Metadata } from 'next'
import partnersData from '@/data/Partners.json'
import PartnerCard from '@/components/partners/PartnerCard'
import PartnerHero from '@/components/partners/PartnerHero'
import { PartnersData } from '@/types/partners'

export const metadata: Metadata = {
  title: '함께하는 기관',
  description: '모두하나대축제 2025와 함께하는 주최, 후원, 협력, 참여기관을 소개합니다.',
  openGraph: {
    title: '함께하는 기관 | 모두하나대축제 2025',
    description: '모두하나대축제 2025와 함께하는 주최, 후원, 협력, 참여기관을 소개합니다.',
    images: [
      {
        url: '/images/partners/partners-og.jpg',
        width: 1200,
        height: 630,
        alt: '모두하나대축제 2025 함께하는 기관',
      },
    ],
  },
}

export default async function PartnersPage() {
  const partners = partnersData as PartnersData

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* 히어로 섹션 */}
      <PartnerHero />

      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 py-16 space-y-20">
        {/* 주최/주관 섹션 */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-full shadow-lg">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              주최 · 주관
            </div>
            <h2 className="text-3xl font-bold text-gray-900">축제를 이끌어가는</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              모두하나대축제 2025의 성공적인 개최를 위해 주도적인 역할을 하는 기관들입니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {partners.organizers.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
        </section>

        {/* 후원/협력 섹션 */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium rounded-full shadow-lg">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              후원 · 협력
            </div>
            <h2 className="text-3xl font-bold text-gray-900">함께 만들어가는</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              축제의 가치에 공감하며 다양한 지원으로 함께해주시는 소중한 파트너들입니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partners.sponsors.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
        </section>

        {/* 참여기관 섹션 */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-full shadow-lg">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              참여기관
            </div>
            <h2 className="text-3xl font-bold text-gray-900">활동으로 참여하는</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              현장에서 직접 부스를 운영하고 프로그램을 진행하며 축제에 활력을 불어넣는 기관들입니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.participants.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
        </section>

        {/* CTA 섹션 */}
        <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
          <div className="relative z-10 space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">함께하고 싶으신가요?</h2>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              모두하나대축제와 파트너십을 맺고 함께 의미 있는 축제를 만들어가세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                파트너십 문의
              </a>
              <a
                href="/programs"
                className="inline-flex items-center px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                참여 프로그램 보기
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}