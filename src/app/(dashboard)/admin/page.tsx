import React from 'react'
import { 
  TrendingUp,
  Clock,
  Shield,
  Sparkles
} from 'lucide-react'

export default function AdminPage() {

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* 헤더 섹션 */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            모두하나대축제
            <span className="block text-3xl text-blue-600 mt-2">백오피스 관리 시스템</span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            모두하나대축제를 효율적으로 관리할 수 있는 통합 관리 시스템입니다. <br/>
          </p>

          <div className="flex flex-col justify-center items-center space-x-6 text-sm text-gray-500 gap-2">
            문제 발생 시 아래로 연락주세요.
            <span className="mx-2">(주)하우두유두 | +82 2-322-9775</span>
            <span className="mx-2">개발인원 | 010-9404-3714</span>
          </div>
        </div>

        {/* 푸터 */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            © 2025모두하나대축제. 관리자 전용 시스템입니다.
          </p>
        </div>
      </div>
    </div>
  )
}