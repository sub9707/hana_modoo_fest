'use client'

import { useState } from 'react'
import { Search, Filter, Calendar, Eye } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

interface GalleryItem {
  id: string
  title: string
  year: number
  category: string
  imageUrl: string
  thumbnailUrl: string
  description?: string
  photographer?: string
  copyrightInfo: string
  uploadedAt: string
  views: number
}

interface GalleryGridProps {
  items: GalleryItem[]
  onLoadMore?: () => void
  hasMore?: boolean
}

export default function GalleryGrid({ items, onLoadMore, hasMore = false }: GalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const years = Array.from(new Set(items.map(item => item.year))).sort((a, b) => b - a)
  const categories = Array.from(new Set(items.map(item => item.category)))

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesYear = selectedYear === 'all' || item.year.toString() === selectedYear
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    
    return matchesSearch && matchesYear && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* 필터 영역 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="사진 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 연도</SelectItem>
            {years.map(year => (
              <SelectItem key={year} value={year.toString()}>
                {year}년
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 카테고리</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 결과 수 표시 */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          총 {filteredItems.length}개의 사진
        </p>
        
        {(selectedYear !== 'all' || selectedCategory !== 'all' || searchTerm) && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              setSearchTerm('')
              setSelectedYear('all')
              setSelectedCategory('all')
            }}
          >
            필터 초기화
          </Button>
        )}
      </div>

      {/* 갤러리 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
            onClick={() => setSelectedImage(item)}
          >
            {/* 이미지 placeholder */}
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <div className="text-center">
                <span className="text-4xl mb-2 block">📸</span>
                <p className="text-xs text-muted-foreground px-2 line-clamp-2">
                  {item.title}
                </p>
              </div>
            </div>

            {/* 오버레이 */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
            
            {/* 정보 오버레이 */}
            <div className="absolute inset-0 p-3 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex justify-between items-start">
                <Badge variant="secondary" className="text-xs">
                  {item.category}
                </Badge>
                <div className="flex items-center space-x-1 text-white text-xs">
                  <Eye className="w-3 h-3" />
                  <span>{item.views}</span>
                </div>
              </div>
              
              <div className="text-white">
                <h3 className="font-medium text-sm line-clamp-2 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs opacity-80">
                  {item.year}년
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 로드 모어 버튼 */}
      {hasMore && (
        <div className="text-center">
          <Button onClick={onLoadMore} variant="outline">
            더 많은 사진 보기
          </Button>
        </div>
      )}

    </div>
  )
}