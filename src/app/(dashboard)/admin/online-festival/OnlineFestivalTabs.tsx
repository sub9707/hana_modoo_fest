'use client'

import { useState, Children, ReactNode } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/admin/online-festival/ui/tabs'
import { LucideIcon } from 'lucide-react'

interface TabConfig {
  value: string
  label: string
  icon: LucideIcon
}

interface OnlineFestivalTabsProps {
  tabConfig: readonly TabConfig[]
  children: ReactNode
}

export function OnlineFestivalTabs({ tabConfig, children }: OnlineFestivalTabsProps) {
  const [activeTab, setActiveTab] = useState(tabConfig[0].value)
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
