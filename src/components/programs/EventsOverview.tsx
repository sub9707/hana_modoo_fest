'use client'

import { useState, useEffect } from 'react'
import BoothTable from './BoothTable'
import { BoothData } from '@/types/booth'

export default function EventsOverview() {
  const [boothData, setBoothData] = useState<BoothData[]>([])
  const [filteredData, setFilteredData] = useState<BoothData[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadBoothData() {
      try {
        // 부스 데이터 임포트 ==> 정적 데이터로 저장해서 동적으로 불러오기~
        const data = await import('@/data/BoothData.json')
        setBoothData(data.default)
        setFilteredData(data.default)
      } catch (error) {
        console.error('부스 데이터를 불러오는데 실패했습니다:', error)
        setBoothData([])
        setFilteredData([])
      } finally {
        setLoading(false)
      }
    }

    loadBoothData()
  }, [])

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(boothData)
      return
    }

    const filtered = boothData.filter(booth =>
      booth.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booth.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booth.banner_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booth.booth_activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booth.zone.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredData(filtered)
  }, [searchTerm, boothData])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const clearSearch = () => {
    setSearchTerm('')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">데이터를 불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 검색창 */}
      <div className="space-y-4">
        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="기관명, 그룹명, 활동명으로 검색"
            className="block w-full pl-10 pr-10 py-3 border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="text-center text-sm text-gray-600">
            <span className="font-medium">"{searchTerm}"</span> 검색 결과: {filteredData.length}개
          </p>
        )}
      </div>

      {/* 구분선 */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-6 bg-white text-gray-500 font-medium"></span>
        </div>
      </div>

      {/* 부스 테이블 */}
      <BoothTable data={filteredData} />
    </div>
  )
}