import Link from 'next/link'
import { ShieldX, ArrowLeft } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '접근 권한 없음 | 모두하나대축제 2025',
  description: '접근 권한이 없는 페이지입니다.',
}

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <ShieldX className="mx-auto h-16 w-16 text-red-500" />
            <h2 className="mt-4 text-3xl font-bold text-gray-900">
              접근 권한 없음
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              이 페이지에 접근할 권한이 없습니다.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              필요한 권한이 있는지 확인하거나 관리자에게 문의하세요.
            </p>
          </div>

          <div className="mt-8">
            <Link
              href="/dashboard"
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              대시보드로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}