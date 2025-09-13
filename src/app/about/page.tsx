import { Metadata } from 'next'
import FestivalHero from '@/components/about/FestivalHero'
import FestivalOverview from '@/components/about/FestivalOverview'
import FestivalInfo from '@/components/about/FestivalInfo'
import ParticipationSection from '@/components/about/ParticipationSection'
import festivalData from '@/data/FestivalData.json';

export const metadata: Metadata = {
  title: '축제 소개',
  description: '서울시 대표 가족축제 모두하나대축제 2025. 가족다양성을 존중하고 시민이 함께 즐기는 연대의 장. 2025년 10월 18일 여의도공원에서 만나요.',
  openGraph: {
    title: '축제 소개 | 모두하나대축제 2025',
    description: '서울시 대표 가족축제 모두하나대축제 2025. 가족다양성을 존중하고 시민이 함께 즐기는 연대의 장.',
    images: [
      {
        url: '/images/festival/festival-og.jpg',
        width: 1200,
        height: 630,
        alt: '모두하나대축제 2025 포스터',
      },
    ],
  },
}


export default async function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* 히어로 섹션 */}
      <FestivalHero festivalData={festivalData} />
      
      {/* 축제 개요 섹션 */}
      <FestivalOverview 
        coreValues={festivalData.coreValues} 
        purpose={festivalData.purpose}
        significance={festivalData.significance}
      />
      
      {/* 축제 정보 섹션 */}
      <FestivalInfo 
        basicInfo={{
          date: festivalData.date,
          time: festivalData.time,
          location: festivalData.location,
          organizer: festivalData.organizer,
          host: festivalData.host
        }}
        programs={festivalData.mainPrograms}
        onlineCampaign={festivalData.onlineCampaign}
      />
      
      {/* 참여 방법 섹션 */}
      <ParticipationSection targets={festivalData.targets} />
    </div>
  )
}