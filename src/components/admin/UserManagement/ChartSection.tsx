import React from 'react'

export default function ChartSection() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">일별 가입 추이</h3>
      <div className="h-48 flex items-center justify-center bg-gray-50 rounded-md">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-gray-500">차트 영역</p>
          <p className="text-sm text-gray-400">Chart.js 또는 Recharts 연동</p>
        </div>
      </div>
    </div>
  )
}