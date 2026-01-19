import { Metadata } from 'next'
import ProgramHero from '@/components/programs/ProgramHero'
import ProgramTabs from '@/components/programs/ProgramTabs'
import PageLayout from '@/components/layout/PageLayout'
import { PAGE_SEO, createPageMetadata, SITE } from '@/constants'

export const metadata: Metadata = createPageMetadata(
  PAGE_SEO.programs.title,
  `${SITE.fullName} 행사 프로그램 안내. 행사 일정, 전체행사안내, 행사장 안내도를 확인하세요.`
)

export default function ProgramPage() {
  return (
    <PageLayout variant="gradient-purple">
      {/* 히어로 섹션 */}
      <ProgramHero />

      {/* 탭 및 컨텐츠 섹션 */}
      <ProgramTabs />
    </PageLayout>
  )
}