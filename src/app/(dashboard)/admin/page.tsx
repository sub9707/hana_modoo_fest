import React from 'react'
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Camera, 
  TrendingUp,
  Clock,
  Shield,
  Sparkles
} from 'lucide-react'

export default function AdminPage() {
  const features = [
    {
      icon: LayoutDashboard,
      title: '대시보드',
      description: '전체 시스템 현황을 한눈에 확인하고 주요 지표를 모니터링하세요.',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: Users,
      title: '회원 관리',
      description: '축제 참가자들의 정보를 관리하고 활동 현황을 추적하세요.',
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: Calendar,
      title: '축제 관리',
      description: '축제 일정을 등록하고 관리하며 참가자 현황을 확인하세요.',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      icon: Camera,
      title: '갤러리 관리',
      description: '축제 사진과 동영상을 업로드하고 갤러리를 관리하세요.',
      color: 'text-orange-600 bg-orange-100'
    }
  ]

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
            축제의 모든 것을 효율적으로 관리할 수 있는 통합 관리 시스템입니다. <br/>
            회원부터 축제, 갤러리까지 한 번에 관리하세요.
          </p>

          <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              보안 인증
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              실시간 모니터링
            </div>
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              데이터 분석
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            © 2024 모두하나대축제. 관리자 전용 시스템입니다.
          </p>
        </div>
      </div>
    </div>
  )
}