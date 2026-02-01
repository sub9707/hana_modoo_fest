import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import HeroSection from '@/components/home/HeroSection'
import Introduction from '@/components/home/Introduction'
import ProgramCardSection from '@/components/home/ProgramCardSection'
import CampaignOverview from '@/components/home/CampaignOverview'
import JoinCampaignsSection from '@/components/home/JoinCampaignsSection'
import PageLayout from '@/components/layout/PageLayout'
import { PAGE_SEO, createPageMetadata } from '@/constants'

// CampaignSection은 클라이언트 컴포넌트이므로 dynamic import 유지
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