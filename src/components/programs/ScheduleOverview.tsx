'use client'

import { useState, useEffect } from 'react'
import { BoothData } from '@/types/booth'

export default function ScheduleOverview() {
  const [boothData, setBoothData] = useState<BoothData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadBoothData() {
      try {
        const data = await import('@/data/BoothData.json')
        setBoothData(data.default)
      } catch (error) {
        console.error('부스 데이터를 불러오는데 실패했습니다:', error)
        setBoothData([])
      } finally {
        setLoading(false)
      }
    }

    loadBoothData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">일정을 불러오는 중...</div>
      </div>
    )
  }

  // 구역별로 그룹화
  const zoneGroups = boothData.reduce((acc, booth) => {
    if (!acc[booth.zone]) {
      acc[booth.zone] = []
    }
    acc[booth.zone].push(booth)
    return acc
  }, {} as Record<string, BoothData[]>)

  return (
    <div className="space-y-8">
      {/* 타이틀 */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent orange-gradient mb-4">
          행사 일정
        </h2>
        <p className="text-gray-600 text-lg md:text-xl">
          구역별 부스 운영 일정을 확인하세요
        </p>
      </div>

      {/* 구분선 */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-6 bg-white text-gray-500 font-medium">구역별 부스 일정</span>
        </div>
      </div>

      {/* 구역별 일정 */}
      <div className="space-y-8">
        {Object.entries(zoneGroups).map(([zone, booths]) => (
          <div key={zone} className="bg-white border border-gray-200 overflow-hidden">
            {/* 구역 헤더 */}
            <div className="orange-gradient px-6 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h3 className="text-xl font-bold text-white">{zone} 구역</h3>
                <span className="text-white text-sm bg-white/20 px-3 py-1 w-fit">
                  {booths.length}개 부스 운영
                </span>
              </div>
            </div>

            {/* 부스 목록 */}
            <div className="p-6">
              <div className="grid gap-4 md:gap-6">
                {booths.map((booth, index) => (
                  <div 
                    key={booth.id} 
                    className="border border-gray-200 bg-gray-50 p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* 부스 번호 */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-400 text-white font-bold text-lg flex items-center justify-center">
                          {booth.id}
                        </div>
                      </div>

                      {/* 부스 정보 */}
                      <div className="flex-1 grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">기관명</span>
                            <p className="text-sm font-semibold text-gray-900">{booth.organization}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">그룹명</span>
                            <p className="text-sm text-gray-700">{booth.group}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">부스 활동</span>
                            <p className="text-sm font-semibold text-orange-600">{booth.booth_activity}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">배너 제목</span>
                            <p className="text-sm text-gray-700 leading-tight">{booth.banner_title}</p>
                          </div>
                        </div>
                      </div>

                      {/* 상태 표시 */}
                      <div className="flex-shrink-0">
                        <div className="text-center">
                          <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-1"></div>
                          <span className="text-xs text-gray-500">운영중</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 구역 요약 */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-600">
                <span>총 {booths.length}개 부스가 이 구역에서 운영됩니다.</span>
                <span className="text-xs">운영시간: 10:00 ~ 17:00</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 전체 요약 정보 */}
      <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200">
        <div className="text-center space-y-3">
          <h4 className="text-lg font-bold text-gray-900">전체 부스 현황</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-3 border border-gray-200">
              <div className="font-semibold text-gray-900">총 부스 수</div>
              <div className="text-2xl font-bold text-orange-600">{boothData.length}개</div>
            </div>
            <div className="bg-white p-3 border border-gray-200">
              <div className="font-semibold text-gray-900">운영 구역</div>
              <div className="text-2xl font-bold text-pink-600">{Object.keys(zoneGroups).length}개</div>
            </div>
            <div className="bg-white p-3 border border-gray-200">
              <div className="font-semibold text-gray-900">참여 기관</div>
              <div className="text-2xl font-bold text-orange-600">
                {new Set(boothData.map(booth => booth.organization)).size}개
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            모든 부스는 축제 당일 동시에 운영됩니다.
          </p>
        </div>
      </div>
    </div>
  )
}