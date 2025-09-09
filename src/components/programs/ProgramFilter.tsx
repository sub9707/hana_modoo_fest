'use client'

import { useState } from 'react'
import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'

interface FilterOptions {
  categories: string[]
  timeSlots: string[]
  locations: string[]
  accessibility: string[]
}

interface ProgramFilterProps {
  options: FilterOptions
  onFilterChange: (filters: any) => void
  activeFilters: any
}

const categoryLabels = {
  official: '공식행사',
  performance: '무대공연',
  experience: '체험부스',
  'support-group': '자조모임',
  solidarity: '연대부스'
}

const timeSlotLabels = {
  morning: '오전 (09:00-12:00)',
  afternoon: '오후 (12:00-15:00)',
  evening: '저녁 (15:00-18:00)'
}

const accessibilityLabels = {
  wheelchair: '휠체어 접근 가능',
  signLanguage: '수어 통역',
  audioDescription: '음성 해설'
}

export default function ProgramFilter({ options, onFilterChange, activeFilters }: ProgramFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleCategoryChange = (category: string) => {
    const newCategories = activeFilters.categories.includes(category)
      ? activeFilters.categories.filter((c: string) => c !== category)
      : [...activeFilters.categories, category]
    
    onFilterChange({ ...activeFilters, categories: newCategories })
  }

  const handleTimeSlotChange = (timeSlot: string) => {
    const newTimeSlots = activeFilters.timeSlots.includes(timeSlot)
      ? activeFilters.timeSlots.filter((t: string) => t !== timeSlot)
      : [...activeFilters.timeSlots, timeSlot]
    
    onFilterChange({ ...activeFilters, timeSlots: newTimeSlots })
  }

  const handleAccessibilityChange = (accessibility: string) => {
    const newAccessibility = activeFilters.accessibility.includes(accessibility)
      ? activeFilters.accessibility.filter((a: string) => a !== accessibility)
      : [...activeFilters.accessibility, accessibility]
    
    onFilterChange({ ...activeFilters, accessibility: newAccessibility })
  }

  const clearFilters = () => {
    onFilterChange({
      categories: [],
      timeSlots: [],
      locations: [],
      accessibility: []
    })
  }

  const getActiveFilterCount = () => {
    return (
      activeFilters.categories.length +
      activeFilters.timeSlots.length +
      activeFilters.locations.length +
      activeFilters.accessibility.length
    )
  }

  const activeFilterCount = getActiveFilterCount()

  return (
    <div className="space-y-4">
      {/* 필터 토글 버튼 */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="space-x-2"
        >
          <Filter className="w-4 h-4" />
          <span>필터</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-1" />
            필터 초기화
          </Button>
        )}
      </div>

      {/* 활성 필터 표시 */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.categories.map((category: string) => (
            <Badge key={category} variant="secondary" className="space-x-1">
              <span>{categoryLabels[category as keyof typeof categoryLabels]}</span>
              <button onClick={() => handleCategoryChange(category)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          
          {activeFilters.timeSlots.map((timeSlot: string) => (
            <Badge key={timeSlot} variant="secondary" className="space-x-1">
              <span>{timeSlotLabels[timeSlot as keyof typeof timeSlotLabels]}</span>
              <button onClick={() => handleTimeSlotChange(timeSlot)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          
          {activeFilters.accessibility.map((item: string) => (
            <Badge key={item} variant="secondary" className="space-x-1">
              <span>{accessibilityLabels[item as keyof typeof accessibilityLabels]}</span>
              <button onClick={() => handleAccessibilityChange(item)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* 필터 옵션 */}
      {isExpanded && (
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* 카테고리 필터 */}
            <div>
              <h3 className="font-medium mb-3">카테고리</h3>
              <div className="space-y-2">
                {options.categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={activeFilters.categories.includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                    />
                    <label htmlFor={category} className="text-sm cursor-pointer">
                      {categoryLabels[category as keyof typeof categoryLabels]}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* 시간대 필터 */}
            <div>
              <h3 className="font-medium mb-3">시간대</h3>
              <div className="space-y-2">
                {options.timeSlots.map((timeSlot) => (
                  <div key={timeSlot} className="flex items-center space-x-2">
                    <Checkbox
                      id={timeSlot}
                      checked={activeFilters.timeSlots.includes(timeSlot)}
                      onCheckedChange={() => handleTimeSlotChange(timeSlot)}
                    />
                    <label htmlFor={timeSlot} className="text-sm cursor-pointer">
                      {timeSlotLabels[timeSlot as keyof typeof timeSlotLabels]}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* 장소 필터 */}
            <div>
              <h3 className="font-medium mb-3">장소</h3>
              <Select 
                value={activeFilters.location || 'all'} 
                onValueChange={(value) => onFilterChange({ ...activeFilters, location: value === 'all' ? '' : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="장소 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 장소</SelectItem>
                  {options.locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 접근성 필터 */}
            <div>
              <h3 className="font-medium mb-3">접근성</h3>
              <div className="space-y-2">
                {options.accessibility.map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={item}
                      checked={activeFilters.accessibility.includes(item)}
                      onCheckedChange={() => handleAccessibilityChange(item)}
                    />
                    <label htmlFor={item} className="text-sm cursor-pointer">
                      {accessibilityLabels[item as keyof typeof accessibilityLabels]}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}