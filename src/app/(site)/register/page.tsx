import { Metadata } from 'next'
import { Suspense } from 'react'
import PageLayout from '@/components/layout/PageLayout'
import RegisterClient from '@/components/auth/RegisterClient'
import { PAGE_SEO, createPageMetadata } from '@/constants'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = createPageMetadata(
  PAGE_SEO.register.title,
  PAGE_SEO.register.description,
  { noIndex: true }
)

function RegisterLoading() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="text-gray-600">로딩 중...</p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <PageLayout variant="gray">
      <Suspense fallback={<RegisterLoading />}>
        <RegisterClient />
      </Suspense>
    </PageLayout>
  )
}
