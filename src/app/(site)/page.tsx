import { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import Introduction from '@/components/home/Introduction'
import ProgramCardSection from '@/components/home/ProgramCardSection'
import CampaignOverview from '@/components/home/CampaignOverview'
import JoinCampaignsSection from '@/components/home/JoinCampaignsSection'
import CampaignSection from '@/components/home/CampaignSection'


export const metadata: Metadata = {
  title: '모두하나대축제 2025 | 서울시 대표 가족축제',
  description: '서울특별시가 주최하는 모두하나대축제 2025. 가족다양성을 존중하고 시민이 함께 즐기는 연대의 장.',
  openGraph: {
    title: '모두하나대축제 2025 | 서울시 대표 가족축제',
    description: '서울특별시가 주최하는 모두하나대축제 2025. 가족다양성을 존중하고 시민이 함께 즐기는 연대의 장.',
    url: 'https://모두하나대축제.com',
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


export default async function HomePage() {

  return (
    <div className='font-paper'>
      <div className="min-h-screen">
        {/* 히어로 섹션 */}
        <HeroSection />
      </div>
      <div className="min-h-80">
        <Introduction />
      </div>
      <div>
        <ProgramCardSection />
      </div>
      <div>
        <CampaignOverview />
      </div>
      <div>
        <JoinCampaignsSection />
      </div>
      <div>
        <CampaignSection />
      </div>
    </div>
  )
}