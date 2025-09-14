'use client'

import React from 'react'
import { Download, TrendingUp, BarChart3, Users, Gift } from 'lucide-react'

// 통계 카드 컴포넌트
interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<any>
  iconColor: string
}

function StatsCard({ title, value, icon: Icon, iconColor }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
        </div>
        <Icon className={`w-8 h-8 ${iconColor}`} />
      </div>
    </div>
  )
}

export default function Dashboard() {
  // GA4 통계 데이터 (실제로는 API에서 가져옴)
  const stats = {
    totalVisitors: 12543,
    pageViews: 28392,
    registrations: 1234,
    campaignParticipants: 892
  }

  const handleExportExcel = () => {
    // 엑셀 파일 다운로드 로직
    console.log('GA4 데이터 엑셀 추출 시작...')
    // 실제로는 API 호출하여 엑셀 파일 생성 후 다운로드
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">GA4 통계</h2>
        <button 
          onClick={handleExportExcel}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          엑셀 추출
        </button>
      </div>

      {/* 통계 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="총 방문자"
          value={stats.totalVisitors}
          icon={TrendingUp}
          iconColor="text-green-500"
        />
        <StatsCard
          title="페이지뷰"
          value={stats.pageViews}
          icon={BarChart3}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="사전접수"
          value={stats.registrations}
          icon={Users}
          iconColor="text-purple-500"
        />
        <StatsCard
          title="캠페인 참여"
          value={stats.campaignParticipants}
          icon={Gift}
          iconColor="text-orange-500"
        />
      </div>

      {/* 주요 지표 트렌드 차트 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">주요 지표 트렌드</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">차트 영역</p>
            <p className="text-sm text-gray-400">Chart.js 또는 Recharts 연동</p>
          </div>
        </div>
      </div>

      {/* 상세 분석 테이블 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">페이지별 방문 통계</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  페이지
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  방문자 수
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  페이지뷰
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  평균 체류시간
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  이탈률
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">홈페이지</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5,234</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8,921</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2분 34초</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">45.2%</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">프로그램</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3,156</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">6,432</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3분 12초</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">38.7%</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">사전참가신청</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2,891</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4,567</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4분 23초</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">22.1%</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">온라인축제</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1,876</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3,421</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5분 17초</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">31.5%</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">갤러리</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1,432</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2,876</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2분 58초</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">52.3%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}