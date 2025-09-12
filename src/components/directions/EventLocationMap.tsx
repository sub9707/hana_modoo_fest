'use client'

import { useState } from 'react'

export default function EventLocationMap() {
  const [selectedArea, setSelectedArea] = useState<string | null>(null)

  const areas = [
    { id: 'main-stage', name: '메인무대', color: 'bg-red-500', description: '개막식 및 주요 공연' },
    { id: 'booths', name: '체험부스', color: 'bg-blue-500', description: '다양한 체험 프로그램' },
    { id: 'food', name: '푸드존', color: 'bg-green-500', description: '먹거리 부스' },
    { id: 'rest', name: '쉼터', color: 'bg-yellow-500', description: '휴게공간 및 수유실' },
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-festival-blue to-festival-purple text-white">
        <h2 className="text-2xl font-bold mb-2">행사장 안내도</h2>
        <p className="opacity-90">여의도공원 문화의마당 구역별 안내</p>
      </div>
      
      <div className="p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* 지도 영역 */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg p-4 relative overflow-hidden">
              <div className="absolute inset-4 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg">
                {/* 간단한 행사장 레이아웃 표시 */}
                <div className="relative h-full">
                  {/* 메인 무대 */}
                  <div 
                    className={`absolute top-4 left-1/2 transform -translate-x-1/2 w-24 h-12 ${areas[0].color} rounded cursor-pointer transition-all hover:scale-105 ${selectedArea === 'main-stage' ? 'ring-4 ring-orange-400' : ''}`}
                    onClick={() => setSelectedArea('main-stage')}
                  >
                    <div className="text-xs text-white font-bold text-center pt-3">메인무대</div>
                  </div>
                  
                  {/* 체험부스 */}
                  <div 
                    className={`absolute top-20 left-4 w-20 h-20 ${areas[1].color} rounded cursor-pointer transition-all hover:scale-105 ${selectedArea === 'booths' ? 'ring-4 ring-orange-400' : ''}`}
                    onClick={() => setSelectedArea('booths')}
                  >
                    <div className="text-xs text-white font-bold text-center pt-6">체험부스</div>
                  </div>
                  
                  {/* 푸드존 */}
                  <div 
                    className={`absolute top-20 right-4 w-20 h-20 ${areas[2].color} rounded cursor-pointer transition-all hover:scale-105 ${selectedArea === 'food' ? 'ring-4 ring-orange-400' : ''}`}
                    onClick={() => setSelectedArea('food')}
                  >
                    <div className="text-xs text-white font-bold text-center pt-6">푸드존</div>
                  </div>
                  
                  {/* 쉼터 */}
                  <div 
                    className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-12 ${areas[3].color} rounded cursor-pointer transition-all hover:scale-105 ${selectedArea === 'rest' ? 'ring-4 ring-orange-400' : ''}`}
                    onClick={() => setSelectedArea('rest')}
                  >
                    <div className="text-xs text-white font-bold text-center pt-3">쉼터</div>
                  </div>
                  
                  {/* 입구 표시 */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 text-sm font-bold text-gray-600">
                    🚪 입구
                  </div>
                </div>
              </div>
            </div>
            
            {/* 범례 */}
            <div className="grid grid-cols-2 gap-2">
              {areas.map((area) => (
                <div 
                  key={area.id}
                  className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-all hover:bg-gray-50 ${selectedArea === area.id ? 'bg-blue-50 border-2 border-blue-300' : ''}`}
                  onClick={() => setSelectedArea(area.id)}
                >
                  <div className={`w-4 h-4 ${area.color} rounded`}></div>
                  <span className="text-sm font-medium">{area.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* 상세 정보 */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">구역별 안내</h3>
            
            {selectedArea ? (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold text-lg mb-2">
                  {areas.find(a => a.id === selectedArea)?.name}
                </h4>
                <p className="text-gray-700">
                  {areas.find(a => a.id === selectedArea)?.description}
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">지도에서 구역을 선택하면 상세 정보를 확인할 수 있습니다.</p>
              </div>
            )}
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">📍</div>
                <div>
                  <div className="font-semibold">주소</div>
                  <div className="text-gray-600">서울특별시 영등포구 여의도동 여의도공원</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="text-2xl">🕐</div>
                <div>
                  <div className="font-semibold">운영시간</div>
                  <div className="text-gray-600">2025. 10. 18 (토) 11:00 - 16:00</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="text-2xl">ℹ️</div>
                <div>
                  <div className="font-semibold">입장료</div>
                  <div className="text-gray-600">무료 (사전신청 권장)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}