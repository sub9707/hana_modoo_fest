'use client'

import { useState } from 'react'
import TabNavigation from './TabNavigation'
import TabContent from './TabContent'

export default function ProgramTabs() {
  const [activeTab, setActiveTab] = useState('schedule')

  return (
    <>
      {/* 탭 네비게이션 */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* 탭 컨텐츠 */}
      <TabContent activeTab={activeTab} />
    </>
  )
}