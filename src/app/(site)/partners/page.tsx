import { Metadata } from 'next'
import partnersData from '@/data/Partners.json'
import PartnerHero from '@/components/partners/PartnerHero'
import PartnerSection from '@/components/partners/PartnerSection'
import { PartnersData } from '@/types/partners'
import Link from 'next/link'

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

  // 서버에서 파트너 통계 계산
  const totalPartners = partners.organizers.length +
    partners.sponsors.length +
    partners.operators.length +
    partners.participants.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 font-paper">
      {/* 히어로 섹션 */}
      <PartnerHero partnersData={partners} />

      {/* 메인 콘텐츠 */}
      <div className="relative">
        {/* 주최/주관 섹션 */}
        <PartnerSection
          title="주최 · 주관"
          subtitle="축제를 이끌어가는"
          description="모두하나대축제 2025의 성공적인 개최를 위해 주도적인 역할을 하는 핵심 기관들입니다"
          partners={partners.organizers}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          gradient="from-purple-600 to-indigo-600"
          bgGradient="bg-gradient-to-br from-indigo-50 via-white to-indigo-50"
          cardSize="large"
        />

        {/* 운영법인 섹션 */}
        <PartnerSection
          title="운영법인"
          subtitle="전문적인 운영으로"
          description="축제의 원활한 진행과 전문적인 운영을 담당하는 신뢰할 수 있는 파트너입니다"
          partners={partners.operators}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          gradient="from-cyan-600 to-indigo-300"
          bgGradient="bg-gradient-to-br from-white via-indigo-50 to-white"
          cardSize="large"
        />

        {/* 후원 섹션 */}
        <PartnerSection
          title="후원"
          subtitle="든든한 지원으로"
          description="축제의 가치에 공감하며 재정적, 물질적 지원으로 함께해주시는 소중한 파트너입니다"
          partners={partners.sponsors}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          }
          gradient="from-orange-400 to-pink-500"
          bgGradient="bg-gradient-to-br from-indigo-50 via-white to-indigo-50"
          cardSize="large"
        />



        {/* 참여기관 섹션 - 가장 큰 섹션 */}
        <PartnerSection
          title="참여기관"
          subtitle="활동으로 참여하는"
          description="현장에서 직접 부스를 운영하고 프로그램을 진행하며 축제에 활력을 불어넣는 다양한 기관들입니다"
          partners={partners.participants}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          }
          gradient="from-purple-400 to-pink-400"
          bgGradient="bg-gradient-to-br from-white via-indigo-50 to-indigo-50"
          cardSize="medium"
          showViewMore={true}
          initialDisplay={16}
        />

        {/* 통계 및 감사 섹션 */}
        <section className="py-20 bg-gradient-to-b from-indigo-50 via-white to-purple-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* 전체 통계 */}
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                    {totalPartners}&nbsp;
                  </span>
                  개 기관과 함께
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  모두하나대축제 2025는 다양한 분야의 파트너들과 함께
                  더 큰 가치를 만들어가고 있습니다
                </p>
              </div>

              {/* 파트너십 카테고리 통계 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                {[
                  { label: '주최·주관', count: partners.organizers.length, gradient: 'from-purple-500 to-indigo-500' },
                  { label: '후원', count: partners.sponsors.length, gradient: 'from-indigo-500 to-cyan-500' },
                  { label: '운영법인', count: partners.operators.length, gradient: 'from-cyan-500 to-purple-500' },
                  { label: '참여기관', count: partners.participants.length, gradient: 'from-purple-400 to-cyan-400' }
                ].map((stat, index) => (
                  <div
                    key={stat.label}
                    className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/40 hover:bg-white/80 transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                      {stat.count}
                    </div>
                    <div className="text-gray-700 text-sm font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* 감사 메시지 */}
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/50 text-center shadow-lg">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  함께해주셔서 감사합니다
                </h3>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                  모든 파트너 기관들의 소중한 참여와 지원으로
                  모두하나대축제 2025가 더욱 의미 있는 행사가 될 수 있습니다
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-indigo-700"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    파트너십 문의
                  </Link>
                  <Link
                    href="/programs"
                    className="inline-flex items-center px-8 py-4 bg-white border-2 border-purple-300 text-purple-600 font-semibold rounded-full hover:bg-purple-50 hover:border-purple-400 transition-all duration-300 hover:scale-105"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    참여 프로그램 보기
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}