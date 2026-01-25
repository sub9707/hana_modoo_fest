import { Metadata } from 'next'
import ForgotPasswordForm from '@/components/forms/ForgotPasswordForm'
import PageLayout from '@/components/layout/PageLayout'
import { PAGE_SEO, createPageMetadata } from '@/constants'

export const metadata: Metadata = createPageMetadata(
  PAGE_SEO.forgotPassword.title,
  PAGE_SEO.forgotPassword.description,
  { noIndex: true }
)

export default function ForgotPasswordPage() {
  return (
    <PageLayout variant="gray" className="flex items-center justify-center py-8 px-4">
      <ForgotPasswordForm />
    </PageLayout>
  )
}