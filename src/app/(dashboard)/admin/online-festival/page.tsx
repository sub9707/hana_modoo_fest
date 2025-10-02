'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/admin/online-festival/ui/tabs'

import { Users, Trophy, MessageSquare, PenTool, Gift } from 'lucide-react'
import { RegistrationTab } from '@/components/admin/online-festival/RegistrationTab'
import { QuizTab } from '@/components/admin/online-festival/QuizTab'
import { SupportCommentsTab } from '@/components/admin/online-festival/SupportCommentsTab'
import { WinnersTab } from '@/components/admin/online-festival/WinnersTab'
import WritingTab from '@/components/admin/online-festival/WritingTab'

export default function OnlineFestivalPage() {
  const [activeTab, setActiveTab] = useState('registration')

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            온라인 축제 관리
          </h1>
          <p className="text-gray-600">
            사전접수, 퀴즈 이벤트, 응원댓글, 가족주제글짓기, 랜덤이벤트를 관리합니다.
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="registration" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              사전접수
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              퀴즈 이벤트
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              응원댓글
            </TabsTrigger>
            <TabsTrigger value="writings" className="flex items-center gap-2">
              <PenTool className="h-4 w-4" />
              가족주제글짓기
            </TabsTrigger>
            <TabsTrigger value="winners" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              랜덤이벤트
            </TabsTrigger>
          </TabsList>

          {/* 탭 컨텐츠 */}
          <TabsContent value="registration">
            <RegistrationTab />
          </TabsContent>

          <TabsContent value="quiz">
            <QuizTab />
          </TabsContent>

          <TabsContent value="comments">
            <SupportCommentsTab />
          </TabsContent>

          <TabsContent value="writings">
            <WritingTab />
          </TabsContent>

          <TabsContent value="winners">
            <WinnersTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}