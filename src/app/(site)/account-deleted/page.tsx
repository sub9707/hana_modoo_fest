import { Metadata } from 'next'
import { Suspense } from 'react'
import PageLayout from '@/components/layout/PageLayout'
import AccountDeletedContent from '@/components/auth/AccountDeletedContent'
import { PAGE_SEO, createPageMetadata } from '@/constants'

export const metadata: Metadata = createPageMetadata(
  PAGE_SEO.accountDeleted.title,
  PAGE_SEO.accountDeleted.description,
  { noIndex: true }
)

export default function AccountDeletedPage() {
  return (
    <PageLayout variant="gray">
      <Suspense fallback={
        <div className="flex items-center justify-center py-8 px-4">
          <div className="text-center">
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      }>
        <AccountDeletedContent />
      </Suspense>
    </PageLayout>
  )
}
