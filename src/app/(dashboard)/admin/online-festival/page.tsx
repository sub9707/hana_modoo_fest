import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { requireRole } from '@/lib/mysql/server'
import { TabLoadingSpinner } from '@/components/admin/ui/LoadingSpinner'
import { OnlineFestivalTabs } from './OnlineFestivalTabs'

const RegistrationTab = dynamic(
  () => import('@/components/admin/online-festival/RegistrationTab').then(m => ({ default: m.RegistrationTab })),
  { loading: () => <TabLoadingSpinner /> }
)

const QuizTab = dynamic(
  () => import('@/components/admin/online-festival/QuizTab').then(m => ({ default: m.QuizTab })),
  { loading: () => <TabLoadingSpinner /> }
)

const SupportCommentsTab = dynamic(
  () => import('@/components/admin/online-festival/SupportCommentsTab').then(m => ({ default: m.SupportCommentsTab })),
  { loading: () => <TabLoadingSpinner /> }
)

const WinnersTab = dynamic(
  () => import('@/components/admin/online-festival/WinnersTab').then(m => ({ default: m.WinnersTab })),
  { loading: () => <TabLoadingSpinner /> }
)

const WritingTab = dynamic(
  () => import('@/components/admin/online-festival/WritingTab'),
  { loading: () => <TabLoadingSpinner /> }
)

export const metadata = {
  title: '온라인 축제 관리 | 관리자',
  description: '온라인 축제 이벤트를 관리합니다.'
}

export default async function OnlineFestivalPage() {
  await requireRole('admin')

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            온라인 축제 관리
          </h1>
          <p className="text-gray-600">
            사전접수, 퀴즈 이벤트, 응원댓글, 가족주제글짓기, 랜덤이벤트를 관리합니다.
          </p>
        </div>

        <OnlineFestivalTabs>
          <Suspense fallback={<TabLoadingSpinner />}>
            <RegistrationTab />
          </Suspense>
          <Suspense fallback={<TabLoadingSpinner />}>
            <QuizTab />
          </Suspense>
          <Suspense fallback={<TabLoadingSpinner />}>
            <SupportCommentsTab />
          </Suspense>
          <Suspense fallback={<TabLoadingSpinner />}>
            <WritingTab />
          </Suspense>
          <Suspense fallback={<TabLoadingSpinner />}>
            <WinnersTab />
          </Suspense>
        </OnlineFestivalTabs>
      </div>
    </div>
  )
}
