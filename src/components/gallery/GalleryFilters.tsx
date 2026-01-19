'use client'

import { useState } from 'react'

interface Category {
  id: string
  name: string
  count: number
}

interface GalleryFiltersProps {
  years: string[]
  categories: Category[]
}

export default function GalleryFilters({ years, categories }: GalleryFiltersProps) {
  const [selectedYear, setSelectedYear] = useState(years[0] || '2024')
  const [selectedCategory, setSelectedCategory] = useState('all')

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* 연도 필터 */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-3">연도별</h3>
          <div className="flex flex-wrap gap-2">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedYear === year
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {year}년
              </button>
            ))}
          </div>
        </div>
        
        {/* 카테고리 필터 */}
        <div className="flex-2">
          <h3 className="text-lg font-bold text-gray-800 mb-3">카테고리</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
        
        {/* 정렬 옵션 */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-3">정렬</h3>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="newest">최신순</option>
            <option value="oldest">오래된순</option>
            <option value="popular">인기순</option>
          </select>
        </div>
      </div>
    </div>
  )
}