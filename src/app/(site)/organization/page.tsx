import { Metadata } from 'next'
import OrganizationHero from '@/components/organization/OrganizationHero'
import VisionSection from '@/components/organization/VisionSection'
import OrganizationBanner from '@/components/organization/OrganizationBanner'
import { organizationData } from '@/data/Organization'
import PageLayout from '@/components/layout/PageLayout'
import { PAGE_SEO, createPageMetadata } from '@/constants'

export const metadata: Metadata = createPageMetadata(
  PAGE_SEO.organization.title,
  '서울특별시한부모가족지원센터를 소개합니다. 돌봄, 소통, 혁신의 가치로 한부모가족의 자립과 복지 증진을 위해 노력합니다.'
)


export default async function OrganizationPage() {
  return (
    <PageLayout variant="white">
      {/* 히어로 섹션 */}
      <OrganizationHero organizationData={organizationData} />

      {/* 비전과 가치 섹션 */}
      <VisionSection />

      {/*배너 기관 배너 */}
      <OrganizationBanner />
    </PageLayout>
  )
}