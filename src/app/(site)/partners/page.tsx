import { Metadata } from 'next'
import partnersData from '@/data/Partners.json'
import PartnerHero from '@/components/partners/PartnerHero'
import PartnerSection from '@/components/partners/PartnerSection'
import PartnerStatsSection from '@/components/partners/PartnerStatsSection'
import { PartnersData } from '@/types/partners'
import PageLayout from '@/components/layout/PageLayout'
import { PAGE_SEO, createPageMetadata, SITE } from '@/constants'

export const metadata: Metadata = createPageMetadata(
  PAGE_SEO.partners.title,
  `${SITE.fullName}와 함께하는 주최, 후원, 협력, 참여기관을 소개합니다.`
)

export default async function PartnersPage() {
  const partners = partnersData as PartnersData

  return (
    <PageLayout variant="gradient-partners">
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

        {/* 참여기관 섹션 */}
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
        <PartnerStatsSection
          stats={{
            organizers: partners.organizers.length,
            sponsors: partners.sponsors.length,
            operators: partners.operators.length,
            participants: partners.participants.length,
          }}
        />
      </div>
    </PageLayout>
  )
}
