'use client'

import { useState, Children, ReactNode } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/admin/online-festival/ui/tabs'
import { Users, Trophy, MessageSquare, PenTool, Gift } from 'lucide-react'

const tabConfig = [
  { value: 'registration', label: '사전접수', icon: Users },
  { value: 'quiz', label: '퀴즈 이벤트', icon: Trophy },
  { value: 'comments', label: '응원댓글', icon: MessageSquare },
  { value: 'writings', label: '가족주제글짓기', icon: PenTool },
  { value: 'winners', label: '랜덤이벤트', icon: Gift }
] as const

interface OnlineFestivalTabsProps {
  children: ReactNode
}

export function OnlineFestivalTabs({ children }: OnlineFestivalTabsProps) {
  const [activeTab, setActiveTab] = useState<string>(tabConfig[0].value)
  const childArray = Children.toArray(children)

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-5 mb-8">
        {tabConfig.map((tab) => {
          const Icon = tab.icon
          return (
            <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          )
        })}
      </TabsList>

      {tabConfig.map((tab, index) => (
        <TabsContent key={tab.value} value={tab.value}>
          {childArray[index]}
        </TabsContent>
      ))}
    </Tabs>
  )
}
