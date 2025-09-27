// src/app/(site)/my-page/delete-account/page.tsx
import { DeleteAccountForm } from '@/components/forms/DeleteAccountForm'
import { ClientWrapper } from '@/components/my-page/ClientWrapper'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '회원탈퇴 | 모두하나대축제',
  description: '회원탈퇴를 진행하세요',
}

// NextJS 15: 동적 렌더링
export const dynamic = 'force-dynamic'

export default function DeleteAccountPage() {
  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <DeleteAccountForm />
        </div>
      </div>
    </ClientWrapper>
  )
}