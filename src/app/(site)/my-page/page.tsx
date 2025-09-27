import { getCurrentUser } from '@/lib/mysql/server'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import { MyPageContent } from '@/components/my-page/MyPageContent'
import { ClientWrapper } from '@/components/my-page/ClientWrapper'

export const metadata: Metadata = {
  title: '마이페이지 | 모두하나대축제',
  description: '내 정보를 확인하고 관리하세요',
}

// NextJS 15: 동적 렌더링으로 항상 최신 데이터 보장
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function MyPage({ searchParams }: PageProps) {
  try {
    // 서버에서 사용자 정보 조회 (기존 함수 활용)
    const user = await getCurrentUser()

    if (!user) {
      // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
      const message = encodeURIComponent('로그인이 필요한 서비스입니다.')
      redirect(`/login?callbackUrl=${encodeURIComponent('/my-page')}&message=${message}`)
    }

    return (
      <ClientWrapper>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <MyPageContent user={user} />
          </div>
        </div>
      </ClientWrapper>
    )

  } catch (error) {
    console.error('MyPage error:', error)
    
    // 에러 발생 시 로그인 페이지로 리다이렉트
    const message = encodeURIComponent('오류가 발생했습니다. 다시 로그인해주세요.')
    redirect(`/login?callbackUrl=${encodeURIComponent('/my-page')}&message=${message}`)
  }
}