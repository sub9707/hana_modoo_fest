'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clipboard, MessageSquareQuote, MessageCircle, Pen, Dices } from 'lucide-react'
import PreRegistration from './PreRegistration'
import QuizEvent from './Quiz/QuizEvent'
import SupportComments from './SupportComment/SupportComments'
import RandomEvent from './RandomEvent/RandomEvent'
import FamilyWriting from './FamilyWriting/FamilyWriting'

interface Tab {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  color: string
  bgColor: string
  bgHex: string
}

const tabs: Tab[] = [
  {
    id: 'registration',
    label: '사전접수',
    icon: Clipboard,
    description: '축제 사전참가 신청',
    color: 'text-festival-blue',
    bgColor: 'bg-festival-blue',
    bgHex: '#3B82F6'
  },
  {
    id: 'quiz',
    label: '퀴즈이벤트',
    icon: MessageSquareQuote,
    description: '가족 관련 퀴즈 도전',
    color: 'text-festival-green',
    bgColor: 'bg-festival-green',
    bgHex: '#10B981'
  },
  {
    id: 'comments',
    label: '응원댓글',
    icon: MessageCircle,
    description: '따뜻한 응원 메시지',
    color: 'text-festival-purple',
    bgColor: 'bg-festival-purple',
    bgHex: '#8B5CF6'
  },
  {
    id: 'writing',
    label: '글짓기',
    icon: Pen,
    description: '가족 주제 글짓기',
    color: 'text-festival-pink',
    bgColor: 'bg-festival-pink',
    bgHex: '#EC4899'
  },
  {
    id: 'random',
    label: '랜덤이벤트',
    icon: Dices,
    description: '행운의 룰렛 이벤트',
    color: 'text-festival-orange',
    bgColor: 'bg-festival-orange',
    bgHex: '#F97316'
  }
]

export default function OnlineFestivalTabs() {
  const [activeTab, setActiveTab] = useState('registration')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'registration':
        return <PreRegistration />
      case 'quiz':
        return <QuizEvent />
      case 'comments':
        return <SupportComments />
      case 'writing':
        return <FamilyWriting />
      case 'random':
        return <RandomEvent />
      default:
        return <PreRegistration />
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="hidden md:flex bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg" role="tablist" aria-label="온라인 축제 메뉴">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 relative px-4 py-4 rounded-xl transition-all duration-300 cursor-pointer ${
                activeTab === tab.id
                  ? ''
                  : 'hover:bg-white/50'
              }`}
              style={activeTab === tab.id ? {
                backgroundColor: `${tab.bgHex}10`,
                border: `2px solid ${tab.bgHex}30`
              } : {
                border: '2px solid transparent'
              }}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
            >
              <div className="text-center">
                <div className={`mb-2 flex justify-center ${activeTab === tab.id ? 'scale-110' : ''} transition-transform duration-300`}>
                  <tab.icon className={`w-6 h-6 ${activeTab === tab.id ? tab.color : 'text-gray-600'}`} />
                </div>
                <div className={`font-semibold mb-1 ${activeTab === tab.id ? tab.color : 'text-gray-600'}`}>
                  {tab.label}
                </div>
                <div className={`text-sm ${activeTab === tab.id ? 'text-gray-700' : 'text-gray-500'}`}>
                  {tab.description}
                </div>
              </div>
              
              {/* 활성 탭 인디케이터 */}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 ${tab.bgColor} rounded-full`}
                  transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* 태블릿 탭 (한 줄) */}
        <div className="hidden sm:flex md:hidden bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
          <div className="flex w-full justify-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 max-w-[140px] px-2 py-3 rounded-xl transition-all duration-300 cursor-pointer ${
                  activeTab === tab.id
                    ? ''
                    : 'hover:bg-white/50'
                }`}
                style={activeTab === tab.id ? {
                  backgroundColor: `${tab.bgHex}10`,
                  border: `2px solid ${tab.bgHex}30`
                } : {
                  border: '2px solid transparent'
                }}
              >
                <div className="text-center">
                  <div className={`mb-1 flex justify-center ${activeTab === tab.id ? 'scale-110' : ''} transition-transform duration-300`}>
                    <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? tab.color : 'text-gray-600'}`} />
                  </div>
                  <div className={`font-medium text-xs ${activeTab === tab.id ? tab.color : 'text-gray-600'}`}>
                    {tab.label}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 모바일 탭 (2줄 배치) */}
        <div className="sm:hidden bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
          {/* 첫 번째 줄: 3개 탭 */}
          <div className="flex gap-2 mb-2">
            {tabs.slice(0, 3).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-2 py-2.5 rounded-xl transition-all duration-300 cursor-pointer ${
                  activeTab === tab.id
                    ? tab.color
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
                style={activeTab === tab.id ? {
                  backgroundColor: `${tab.bgHex}10`,
                  border: `2px solid ${tab.bgHex}30`
                } : {
                  border: '2px solid transparent'
                }}
              >
                <div className="text-center">
                  <div className={`mb-1 flex justify-center ${activeTab === tab.id ? 'scale-110' : ''} transition-transform duration-300`}>
                    <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? tab.color : 'text-gray-600'}`} />
                  </div>
                  <div className="font-medium text-xs leading-tight">
                    {tab.label}
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {/* 두 번째 줄: 2개 탭 (가운데 정렬) */}
          <div className="flex justify-center gap-2">
            {tabs.slice(3, 5).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-[calc(50%-4px)] px-2 py-2.5 rounded-xl transition-all duration-300 cursor-pointer ${
                  activeTab === tab.id
                    ? tab.color
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
                style={activeTab === tab.id ? {
                  backgroundColor: `${tab.bgHex}10`,
                  border: `2px solid ${tab.bgHex}30`
                } : {
                  border: '2px solid transparent'
                }}
              >
                <div className="text-center">
                  <div className={`mb-1 flex justify-center ${activeTab === tab.id ? 'scale-110' : ''} transition-transform duration-300`}>
                    <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? tab.color : 'text-gray-600'}`} />
                  </div>
                  <div className="font-medium text-xs leading-tight">
                    {tab.label}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden"
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}