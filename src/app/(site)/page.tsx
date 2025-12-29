import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import HeroSection from '@/components/home/HeroSection'

// 뷰포트 밖의 섹션들은 lazy load
const Introduction = dynamic(() => import('@/components/home/Introduction'), {
  loading: () => <div className="min-h-80 bg-[#885ef9]" />
})
const ProgramCardSection = dynamic(() => import('@/components/home/ProgramCardSection'), {
  loading: () => <div className="min-h-screen/3" />
})
const CampaignOverview = dynamic(() => import('@/components/home/CampaignOverview'), {
  loading: () => <div className="min-h-screen/2" />
})
const JoinCampaignsSection = dynamic(() => import('@/components/home/JoinCampaignsSection'), {
  loading: () => <div className="min-h-screen/2" />
})
const CampaignSection = dynamic(() => import('@/components/home/CampaignSection'), {
  loading: () => <div className="min-h-screen/2" />
})


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