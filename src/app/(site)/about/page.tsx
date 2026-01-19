import { Metadata } from 'next'
import FestivalHero from '@/components/about/FestivalHero'
import FestivalOverview from '@/components/about/FestivalOverview'
import FestivalInfo from '@/components/about/FestivalInfo'
import CoreValues from '@/components/about/CoreValues'
import FestivalPrograms from '@/components/about/FestivalPrograms'
import FestivalJoinGuide from '@/components/about/FestivalJoinGuide';
import JoinFestival from '@/components/about/JoinFestival';
import PageLayout from '@/components/layout/PageLayout'
import { PAGE_SEO, createPageMetadata } from '@/constants'

export const metadata: Metadata = createPageMetadata(
  PAGE_SEO.about.title,
  PAGE_SEO.about.description
)


export default async function AboutPage() {
  return (
    <PageLayout variant="white">
      {/* 히어로 섹션 */}
      <FestivalHero />

      {/* 핵심 가치 섹션 */}
      <CoreValues />

      {/* 축제 개요 섹션 */}
      <FestivalOverview />

      {/* 축제 정보 섹션 */}
      <FestivalInfo />

      {/* 주요 프로그램 섹션 */}
      <FestivalPrograms />

      {/* 참여방법 섹션 */}
      <FestivalJoinGuide />

      {/* 참여유도 섹션 */}
      <JoinFestival />
    </PageLayout>
  )
}