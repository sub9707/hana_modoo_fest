import { Metadata } from 'next'
import OnlineFestivalTabs from '@/components/online-festival/OnlineFestivalTabs'
import OnelineFestivalHero from '@/components/online-festival/OnlineFestivalHero'
import PageLayout from '@/components/layout/PageLayout'
import { PAGE_SEO, createPageMetadata, SITE } from '@/constants'

export const metadata: Metadata = createPageMetadata(
  `${PAGE_SEO.onlineFestival.title} | ${SITE.fullName}`,
  `${SITE.fullName} 온라인 축제에 참여하세요. 퀴즈, 응원 댓글, 가족 글짓기, 랜덤 이벤트 등 다양한 온라인 활동으로 축제의 즐거움을 함께 나눠요.`
)

export default function OnlineFestivalPage() {
  return (
    <PageLayout variant="gradient-purple">
      {/* 히어로 영역 */}
      <OnelineFestivalHero />

      {/* 메인 콘텐츠 - 탭 섹션 */}
      <section className="relative pb-20">
        <div className="container mx-auto px-4">
          <OnlineFestivalTabs />
        </div>
      </section>
    </PageLayout>
  )
}