import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordForm() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-paper">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* 헤더 */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  비밀번호 찾기
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  비밀번호 변경을 위해 담당자에게 문의바랍니다. < br />
                </p>
                <div className="space-y-2 text-sm text-slate-600 mt-6">
                  <p>
                    <span className="font-medium">전화:</span>
                    <Link href="tel:02-861-3020" className="text-blue-600 hover:text-blue-700 ml-1">
                      02-861-3020
                    </Link>
                  </p>
                  <p>
                    <span className="font-medium">이메일:</span>
                    <Link href="mailto:hanbumo1@seoul.go.kr" className="text-blue-600 hover:text-blue-700 ml-1">
                      hanbumo1@seoul.go.kr
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}