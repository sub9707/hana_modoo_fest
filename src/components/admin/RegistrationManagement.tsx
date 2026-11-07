'use client'

import React, { useState } from 'react'
import { Download, Search, Filter, Calendar } from 'lucide-react'
import { Registration, RegistrationStatus } from '@/types/admin'
import { sampleRegistrations } from '@/data/sampleData'
import { exportToExcel } from '@/lib/utils'

export default function RegistrationManagement() {
  const [registrations] = useState<Registration[]>(sampleRegistrations)
  const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatus>('active')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProgram, setSelectedProgram] = useState('전체')

  // 접수 상태 관련 설정
  const statusLabels = {
    preparing: '접수 준비 중',
    active: '접수 중',
    closed: '접수 마감'
  }

  const statusColors = {
    preparing: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    closed: 'bg-red-100 text-red-800'
  }

  // 프로그램 목록 추출
  const allPrograms = ['전체', ...new Set(registrations.flatMap(reg => reg.programs))]

  // 필터링된 등록자 목록
  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = registration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         registration.phone.includes(searchTerm)
    
    const matchesProgram = selectedProgram === '전체' || 
                          registration.programs.includes(selectedProgram)
    
    return matchesSearch && matchesProgram
  })

  // 통계 계산
  const totalParticipants = registrations.reduce((sum, reg) => sum + reg.companions + 1, 0)

  // 엑셀 다운로드 핸들러
  const handleExportExcel = () => {

    const data = filteredRegistrations.map(reg => ({
      이름: reg.name,
      연락처: reg.phone,
      동반인원: reg.companions,
      총참가인원: reg.companions + 1,
      관심프로그램: reg.programs.join(', '),
      접수일: reg.registeredAt
    }))
    exportToExcel(data, '사전접수자_목록.xlsx')
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">사전접수 관리</h2>
        <div className="flex flex-wrap gap-3">
          {/* 접수 상태 변경 */}
          <select
            value={registrationStatus}
            onChange={(e) => setRegistrationStatus(e.target.value as RegistrationStatus)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            <option value="preparing">접수 준비 중</option>
            <option value="active">접수 중</option>
            <option value="closed">접수 마감</option>
          </select>
          
          {/* 엑셀 추출 버튼 */}
          <button 
            onClick={handleExportExcel}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            엑셀 추출
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">접수 상태</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[registrationStatus]}`}>
            {statusLabels[registrationStatus]}
          </span>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">총 접수자</h3>
          <p className="text-3xl font-bold text-orange-600">{filteredRegistrations.length}</p>
          <p className="text-sm text-gray-500 mt-1">전체 {registrations.length}명</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">총 참가인원</h3>
          <p className="text-3xl font-bold text-green-600">{totalParticipants}</p>
          <p className="text-sm text-gray-500 mt-1">동반인원 포함</p>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* 검색창 */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="이름, 이메일, 연락처로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
          
          {/* 프로그램 필터 */}
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400 w-4 h-4" />
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              {allPrograms.map(program => (
                <option key={program} value={program}>{program}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 접수자 목록 테이블 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            접수자 목록 ({filteredRegistrations.length}명)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이름
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이메일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  연락처
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  동반인원
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관심프로그램
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  접수일
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRegistrations.map((registration) => (
                <tr key={registration.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {registration.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {registration.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                      {registration.companions}명
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex flex-wrap gap-1">
                      {registration.programs.map((program, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {program}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {registration.registeredAt}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* 결과 없음 메시지 */}
        {filteredRegistrations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">검색 조건에 맞는 접수자가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}