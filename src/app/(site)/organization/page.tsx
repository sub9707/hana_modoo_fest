import { Metadata } from 'next'
import OrganizationHero from '@/components/organization/OrganizationHero'
import VisionSection from '@/components/organization/VisionSection'
import BusinessSection from '@/components/organization/BusinessSection'
import OrganizationBanner from '@/components/organization/OrganizationBanner'
import { organizationData } from '@/data/Organization'

export const metadata: Metadata = {
  title: '기관 소개',
  description: '서울특별시한부모가족지원센터를 소개합니다. 돌봄, 소통, 혁신의 가치로 한부모가족의 자립과 복지 증진을 위해 노력합니다.',
  openGraph: {
    title: '기관 소개 | 모두하나대축제 2025',
    description: '서울특별시한부모가족지원센터를 소개합니다. 돌봄, 소통, 혁신의 가치로 한부모가족의 자립과 복지 증진을 위해 노력합니다.',
    images: [
      {
        url: '/images/modoo_hana_image.png',
        width: 332,
        height: 265,
        alt: '모두하나대축제 2025 로고',
      },
    ],
  },
  icons: {
    icon: '/favicon.ico',
  }
}


export default async function OrganizationPage() {
  return (
    <div className="min-h-screen font-paper">
      {/* 히어로 섹션 */}
      <OrganizationHero organizationData={organizationData} />

      {/* 비전과 가치 섹션 */}
      <VisionSection />

      {/*배너 기관 배너 */}
      <OrganizationBanner />

    </div>
  )
}