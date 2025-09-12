'use client'

import { useState } from 'react'

interface Category {
  id: string
  name: string
  count: number
}

interface NewsFiltersProps {
  categories: Category[]
}

export default function NewsFilters({ categories }: NewsFiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="space-y-6">
      {/* 검색 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">검색</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="제목이나 내용으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
            🔍
          </button>
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">카테고리</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-50 border-2 border-blue-300 text-blue-700'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span className="font-medium">{category.name}</span>
              <span className={`text-sm px-2 py-1 rounded-full ${
                selectedCategory === category.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 정렬 옵션 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">정렬</h3>
        <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="newest">최신순</option>
          <option value="oldest">오래된순</option>
          <option value="views">조회수순</option>
          <option value="important">중요도순</option>
        </select>
      </div>
    </div>
  )
}