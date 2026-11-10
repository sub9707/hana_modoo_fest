import { DeleteAccountForm } from '@/components/forms/DeleteAccountForm'
import { ClientWrapper } from '@/components/my-page/ClientWrapper'
import { Metadata } from 'next'
import PageLayout from '@/components/layout/PageLayout'
import { PAGE_SEO, createPageMetadata } from '@/constants'

export const metadata: Metadata = createPageMetadata(
  PAGE_SEO.deleteAccount.title,
  PAGE_SEO.deleteAccount.description,
  { noIndex: true }
)

export const dynamic = 'force-dynamic'

export default function DeleteAccountPage() {
  return (
    <PageLayout variant="gray" className="py-8 px-4 sm:px-6 lg:px-8">
      <ClientWrapper>
        <div className="max-w-2xl mx-auto">
          <DeleteAccountForm />
        </div>
      </ClientWrapper>
    </PageLayout>
  )
}