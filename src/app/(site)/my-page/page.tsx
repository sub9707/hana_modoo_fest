import { Metadata } from 'next'
import PageLayout from '@/components/layout/PageLayout'
import MyPageClient from '@/components/my-page/MyPageClient'
import { PAGE_SEO, createPageMetadata } from '@/constants'

export const metadata: Metadata = createPageMetadata(
  PAGE_SEO.myPage.title,
  PAGE_SEO.myPage.description,
  { noIndex: true }
)

export const dynamic = 'force-dynamic'

export default function MyPage() {
  return (
    <PageLayout variant="gray">
      <MyPageClient />
    </PageLayout>
  )
}
