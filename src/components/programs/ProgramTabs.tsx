'use client'

import { useState } from 'react'

const tabs = [
  { id: 'schedule', label: '행사 일정' },
  { id: 'events', label: '전체행사안내' },
  { id: 'map', label: '행사장 안내도' }
]

export default function ProgramTabs() {
  const [activeTab, setActiveTab] = useState('schedule')

  return (
    <>
      {/* 탭 메뉴 섹션 */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <nav className="flex space-x-8" aria-label="프로그램 탭">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-6 border-b-2 font-medium text-md sm:text-xl transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-orange-400 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* 컨텐츠 영역 */}
      <section className="bg-gradient-to-b from-white to-purple-50 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm border border-gray-200 min-h-[500px] p-8">
            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">행사 일정</h2>
                <div className="text-gray-600">
                  <p>행사 일정 컨텐츠가 여기에 들어갑니다.</p>
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">전체행사안내</h2>
                <div className="text-gray-600">
                  <p>전체행사안내 컨텐츠가 여기에 들어갑니다.</p>
                </div>
              </div>
            )}

            {activeTab === 'map' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">행사장 안내도</h2>
                <div className="text-gray-600">
                  <p>행사장 안내도 컨텐츠가 여기에 들어갑니다.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}