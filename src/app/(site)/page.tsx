import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import HeroSection from '@/components/home/HeroSection'
import { SITE, DEFAULT_SEO } from '@/constants'

// 뷰포트 밖이라 Lazy load 필요..
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
  title: DEFAULT_SEO.title,
  description: DEFAULT_SEO.description,
  openGraph: {
    title: DEFAULT_SEO.title,
    description: DEFAULT_SEO.description,
    url: SITE.url,
    images: [
      {
        url: DEFAULT_SEO.ogImage,
        width: DEFAULT_SEO.ogImageWidth,
        height: DEFAULT_SEO.ogImageHeight,
        alt: DEFAULT_SEO.ogImageAlt,
      },
    ],
  },
  icons: {
    icon: DEFAULT_SEO.favicon,
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