'use client'

import React, { useState } from 'react'
import { MessageSquare, PenTool, Gift, Bell, UserCheck } from 'lucide-react'
import Sidebar from './Sidebar'
import Dashboard from './Dashboard'
import RegistrationManagement from './RegistrationManagement'
import QuizManagement from './QuizManagement'
import GalleryManagement from './GalleryManagement'

// 빈 페이지 컴포넌트들
const CommentsManagement = () => (
  <div className="text-center py-12">
    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">응원댓글 관리</h3>
    <p className="text-gray-500">댓글 목록, 승인/차단 관리, 통계 기능을 구현해주세요.</p>
  </div>
)

const WritingManagement = () => (
  <div className="text-center py-12">
    <PenTool className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">가족주제 글짓기 관리</h3>
    <p className="text-gray-500">글 목록, 우수작 선정, 통계 분석 기능을 구현해주세요.</p>
  </div>
)

const RandomEventManagement = () => (
  <div className="text-center py-12">
    <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">랜덤이벤트</h3>
    <p className="text-gray-500">랜덤이벤트 관리 페이지입니다.</p>
  </div>
)

const NoticesManagement = () => (
  <div className="text-center py-12">
    <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">공지 관리</h3>
    <p className="text-gray-500">공지사항 작성, 편집, 발행 관리 기능을 구현해주세요.</p>
  </div>
)

const UsersManagement = () => (
  <div className="text-center py-12">
    <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">회원 관리</h3>
    <p className="text-gray-500">회원 목록, 권한 관리, 활동 통계 기능을 구현해주세요.</p>
  </div>
)

export default function AdminLayout() {
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard />
      case 'registration':
        return <RegistrationManagement />
      case 'quiz':
        return <QuizManagement />
      case 'comments':
        return <CommentsManagement />
      case 'writing':
        return <WritingManagement />
      case 'random-event':
        return <RandomEventManagement />
      case 'notices':
        return <NoticesManagement />
      case 'gallery':
        return <GalleryManagement />
      case 'users':
        return <UsersManagement />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 사이드바 */}
      <Sidebar 
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        openSubmenu={openSubmenu}
        setOpenSubmenu={setOpenSubmenu}
      />
      
      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}