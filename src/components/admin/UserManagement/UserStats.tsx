import React from 'react'

interface UserStatsProps {
  stats: {
    total: number
    admin: number
    editor: number
    user: number
    newThisMonth: number
  }
}

export default function UserStats({ stats }: UserStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">전체 회원</h3>
        <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">관리자</h3>
        <p className="text-3xl font-bold text-red-600">{stats.admin}</p>
        <p className="text-sm text-gray-500 mt-1">
          {stats.total > 0 ? Math.round((stats.admin / stats.total) * 100) : 0}%
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">편집자</h3>
        <p className="text-3xl font-bold text-orange-600">{stats.editor}</p>
        <p className="text-sm text-gray-500 mt-1">
          {stats.total > 0 ? Math.round((stats.editor / stats.total) * 100) : 0}%
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">일반회원</h3>
        <p className="text-3xl font-bold text-green-600">{stats.user}</p>
        <p className="text-sm text-gray-500 mt-1">
          {stats.total > 0 ? Math.round((stats.user / stats.total) * 100) : 0}%
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">신규 가입</h3>
        <p className="text-3xl font-bold text-purple-600">{stats.newThisMonth}</p>
        <p className="text-sm text-gray-500 mt-1">최근 1개월</p>
      </div>
    </div>
  )
}