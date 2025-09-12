'use client'

import { useState } from 'react'

export default function TransportInfo() {
  const [activeTab, setActiveTab] = useState('subway')

  const tabs = [
    { id: 'subway', name: '지하철', icon: '🚇' },
    { id: 'bus', name: '버스', icon: '🚌' },
    { id: 'car', name: '자가용', icon: '🚗' },
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-festival-green to-festival-blue text-white">
        <h2 className="text-2xl font-bold mb-2">교통편 안내</h2>
        <p className="opacity-90">대중교통과 자가용 이용 방법을 안내드립니다</p>
      </div>
      
      <div className="p-6">
        {/* 탭 네비게이션 */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-white shadow-sm text-blue-600 font-semibold'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
        
        {/* 지하철 정보 */}
        {activeTab === 'subway' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-3 flex items-center">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded mr-2 text-sm">5호선</span>
                  여의나루역
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• 1번 출구에서 도보 5분</li>
                  <li>• 가장 가까운 역 (추천)</li>
                  <li>• 엘리베이터, 에스컬레이터 이용 가능</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-3 flex items-center">
                  <span className="bg-green-500 text-white px-2 py-1 rounded mr-2 text-sm">9호선</span>
                  국회의사당역
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• 1번 출구에서 도보 7분</li>
                  <li>• 여의도공원 정문 방향</li>
                  <li>• 휠체어 이용 가능</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="font-semibold text-yellow-800 mb-2">💡 교통 팁</div>
              <p className="text-yellow-700">
                여의나루역이 가장 가깝지만, 행사 당일 혼잡할 수 있습니다. 
                국회의사당역 이용도 고려해보세요.
              </p>
            </div>
          </div>
        )}
        
        {/* 버스 정보 */}
        {activeTab === 'bus' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-3">일반버스</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm">간선</span>
                    <span>162, 261, 360, 461, 750</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">지선</span>
                    <span>5633, 5713, 6623</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-3">정류장</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• 여의도공원.KBS (02138)</li>
                  <li>• 국회의사당 (02024)</li>
                  <li>• 여의나루역 (02139)</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="font-semibold text-blue-800 mb-2">🚌 버스 이용 팁</div>
              <p className="text-blue-700">
                서울버스 앱이나 지하철지도 앱을 활용하시면 실시간 버스 위치를 확인할 수 있습니다.
              </p>
            </div>
          </div>
        )}
        
        {/* 자가용 정보 */}
        {activeTab === 'car' && (
          <div className="space-y-6">
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="font-semibold text-red-800 mb-2">⚠️ 중요 안내</div>
              <p className="text-red-700">
                행사 당일 여의도 일대 교통량이 많을 예정이며, 주차공간이 제한적입니다. 
                <strong>대중교통 이용을 강력히 권장</strong>합니다.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-3">네비게이션</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• "여의도공원" 또는 "여의도문화의마당" 검색</li>
                  <li>• 주소: 서울 영등포구 여의도동</li>
                  <li>• 올림픽대로 여의도IC 이용</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-3">주요 도로</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• 여의대로 → 여의공원로</li>
                  <li>• 국회대로 → 여의나루로</li>
                  <li>• 올림픽대로 → 여의도IC</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}