'use client'

import { useState } from 'react'
import { Calendar, Clock, MapPin, Trash2, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ScheduleItem {
  id: string
  title: string
  startTime: string
  endTime: string
  location: string
  category: string
}

interface MyScheduleProps {
  favoritePrograms: string[]
  onRemoveFavorite: (programId: string) => void
}

export default function MySchedule({ favoritePrograms, onRemoveFavorite }: MyScheduleProps) {
  // Mock data - 실제로는 favoritePrograms를 기반으로 데이터 fetch
  const scheduleItems: ScheduleItem[] = [
    {
      id: '1',
      title: '개막식',
      startTime: '11:00',
      endTime: '11:30',
      location: '메인 무대',
      category: '공식행사'
    },
    {
      id: '2',
      title: '가족 콘서트',
      startTime: '12:00',
      endTime: '13:00',
      location: '메인 무대',
      category: '무대공연'
    },
    {
      id: '3',
      title: '만들기 체험',
      startTime: '14:00',
      endTime: '15:00',
      location: '체험 구역 A',
      category: '체험부스'
    }
  ]

  const handleExportSchedule = () => {
    // 일정 내보내기 로직
    const scheduleText = scheduleItems
      .map(item => `${item.startTime}-${item.endTime}: ${item.title} (${item.location})`)
      .join('\n')
    
    navigator.clipboard.writeText(scheduleText)
    alert('일정이 클립보드에 복사되었습니다!')
  }

  const getTotalDuration = () => {
    // 총 소요 시간 계산 (간단한 예시)
    return scheduleItems.length * 60 // 각 프로그램당 1시간으로 가정
  }

  if (scheduleItems.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            아직 등록된 일정이 없습니다
          </h3>
          <p className="text-muted-foreground">
            관심 있는 프로그램을 즐겨찾기에 추가해보세요
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>나의 축제 일정</span>
          </CardTitle>
          
          <Button variant="outline" size="sm" onClick={handleExportSchedule}>
            <Share2 className="w-4 h-4 mr-2" />
            공유
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* 일정 요약 */}
        <div className="bg-primary/5 p-4 rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <span>총 {scheduleItems.length}개 프로그램</span>
            <span>예상 소요시간: {Math.floor(getTotalDuration() / 60)}시간</span>
          </div>
        </div>

        {/* 일정 목록 */}
        <div className="space-y-3">
          {scheduleItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{item.startTime} - {item.endTime}</span>
                  </div>
                </div>
                
                <h4 className="font-medium text-foreground mb-1">
                  {item.title}
                </h4>
                
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{item.location}</span>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveFavorite(item.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* 시간 충돌 경고 (필요시) */}
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
          <p className="text-sm text-yellow-800">
            💡 팁: 프로그램 간 이동시간을 고려하여 일정을 조정하세요
          </p>
        </div>
      </CardContent>
    </Card>
  )
}