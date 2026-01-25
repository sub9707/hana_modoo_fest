import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import HeroSection from '@/components/home/HeroSection'
import PageLayout from '@/components/layout/PageLayout'
import { PAGE_SEO, createPageMetadata } from '@/constants'

// 뷰포트 밖이라 Lazy load 필요
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

export const metadata: Metadata = createPageMetadata(
  PAGE_SEO.home.title,
  PAGE_SEO.home.description
)


export default async function HomePage() {
  return (
    <PageLayout>
      <div className="min-h-screen">
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
    </PageLayout>
  )
}