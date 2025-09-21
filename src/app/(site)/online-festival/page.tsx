import { Metadata } from 'next'
import OnlineFestivalTabs from '@/components/online-festival/OnlineFestivalTabs'
import OnelineFestivalHero from '@/components/online-festival/OnlineFestivalHero'

export const metadata: Metadata = {
  title: '온라인 축제 | 모두하나대축제 2025',
  description: '모두하나대축제 2025 온라인 축제에 참여하세요. 퀴즈, 응원 댓글, 가족 글짓기, 랜덤 이벤트 등 다양한 온라인 활동으로 축제의 즐거움을 함께 나눠요.',
  openGraph: {
    title: '온라인 축제 | 모두하나대축제 2025',
    description: '모두하나대축제 2025 온라인 축제에 참여하세요. 퀴즈, 응원 댓글, 가족 글짓기, 랜덤 이벤트 등 다양한 온라인 활동으로 축제의 즐거움을 함께 나눠요.',
    url: 'https://moduhana2025.seoul.kr/online-festival',
  },
}

export default function OnlineFestivalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 font-paper">
      {/* 히어로 영역 */}
      <OnelineFestivalHero/>

      {/* 메인 콘텐츠 - 탭 섹션 */}
      <section className="relative pb-20">
        <div className="container mx-auto px-4">
          <OnlineFestivalTabs />
        </div>
      </section>
    </div>
  )
}