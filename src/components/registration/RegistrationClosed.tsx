import { AlertCircle, Calendar, MapPin } from 'lucide-react'
import Link from 'next/link'
import { getFormattedDeadline } from '@/lib/utils/registration-deadline'

export default function RegistrationClosed() {
  const formattedDeadline = getFormattedDeadline()

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-gray-400 to-gray-600 text-white p-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <AlertCircle className="w-8 h-8" />
          <h2 className="text-2xl font-bold">사전 접수 마감</h2>
        </div>
        <p className="text-center opacity-90">
          사전 접수가 마감되었습니다
        </p>
      </div>

      <div className="p-8">
        <div className="text-center pt-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-pink-700 transition-all duration-200 hover:shadow-lg transform hover:scale-105"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}