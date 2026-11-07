'use client'

import React from 'react'
import { Search, Filter } from 'lucide-react'

interface SearchAndFiltersProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  roleFilter: string
  setRoleFilter: (value: string) => void
  dateFilter: string
  setDateFilter: (value: string) => void
}

export default function SearchAndFilters({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  dateFilter,
  setDateFilter
}: SearchAndFiltersProps) {
  const roleOptions = ['전체', '관리자', '편집자', '일반회원']
  const dateOptions = ['전체', '최근 1주일', '최근 1개월', '최근 3개월']

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* 검색창 */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="이름, 사용자명, 회사, 연락처로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>
        
        {/* 권한 필터 */}
        <div className="flex items-center space-x-2">
          <Filter className="text-gray-400 w-4 h-4" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            {roleOptions.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
        
        {/* 가입일 필터 */}
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
        >
          {dateOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  )
}