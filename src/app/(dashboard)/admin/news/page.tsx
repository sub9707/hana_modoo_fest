import { Suspense } from 'react'
import { requireRole } from '@/lib/mysql/server'
import { NewsListParams } from '@/types/Board'
import { getNewsCategories, getNewsList } from '@/lib/actions/admin/news/data'
import { NewsManagement } from '@/components/admin/NewsManagement/NewsManagement'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// NextJS 15: 메타데이터 생성
export async function generateMetadata() {
  return {
    title: '공지사항 관리 | 관리자',
    description: '공지사항을 작성, 수정, 삭제할 수 있는 관리 페이지입니다.',
    robots: {
      index: false,
      follow: false,
    }
  }
}

async function NewsData({ params }: { params: NewsListParams }) {
  const [newsData, categories] = await Promise.all([
    getNewsList(params),
    getNewsCategories()
  ])

  return (
    <NewsManagement
      initialData={newsData}
      categories={categories}
      initialParams={params}
    />
  )
}

export default async function NewsAdminPage({ searchParams }: PageProps) {
  await requireRole('editor')

  const resolvedSearchParams = await searchParams
  const params: NewsListParams = {
    page: Number(resolvedSearchParams.page) || 1,
    limit: Number(resolvedSearchParams.limit) || 10,
    category: resolvedSearchParams.category as string,
    search: resolvedSearchParams.search as string,
    important: resolvedSearchParams.important === 'true' ? true :
      resolvedSearchParams.important === 'false' ? false : undefined
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">공지사항 관리</h1>

      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }>
        <NewsData params={params} />
      </Suspense>
    </div>
  )
}