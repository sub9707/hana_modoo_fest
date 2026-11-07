'use client'

import { useState, useEffect, useCallback } from 'react'
import { NewsSearchParams } from '@/types/Board'
import { Search, X } from 'lucide-react'

interface Category {
  id: string
  name: string
  count: number
}

interface NewsFiltersProps {
  categories: Category[]
  searchParams: NewsSearchParams
  onFilterChange: (params: Partial<NewsSearchParams>) => void
}

export default function NewsFilters({ 
  categories, 
  searchParams, 
  onFilterChange 
}: NewsFiltersProps) {
  const [searchInput, setSearchInput] = useState(searchParams.search || '')

  // 검색어 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchParams.search) {
        onFilterChange({ search: searchInput || undefined })
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput, searchParams.search, onFilterChange])

  const handleCategoryChange = useCallback((categoryId: string) => {
    onFilterChange({ category: categoryId })
  }, [onFilterChange])

  const handleSortChange = useCallback((sort: string) => {
    onFilterChange({ sort: sort as any })
  }, [onFilterChange])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
  }, [])

  const handleSearchClear = useCallback(() => {
    setSearchInput('')
  }, [])

  const clearAllFilters = useCallback(() => {
    setSearchInput('')
    onFilterChange({
      category: 'all',
      search: undefined,
      sort: 'newest'
    })
  }, [onFilterChange])

  const hasActiveFilters = searchParams.category !== 'all' || 
                          searchParams.search || 
                          searchParams.sort !== 'newest'

  const sortLabel: Record<string, string> = {
    newest: '최신순',
    oldest: '오래된순',
    views: '조회수순',
    important: '중요도순',
  }

  return (
    <aside className="w-full bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
      {/* 검색 */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-900">검색</h3>
          {searchParams.search && (
            <button
              onClick={handleSearchClear}
              className="text-xs text-gray-500 hover:text-orange-600 transition-colors"
            >
              지우기
            </button>
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="제목이나 내용으로 검색"
            value={searchInput}
            onChange={handleSearchChange}
            className="w-full rounded-md border border-gray-300 pl-3 pr-9 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-colors"
          />
          {searchInput ? (
            <button
              onClick={handleSearchClear}
              aria-label="검색어 지우기"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
          )}
        </div>
      </div>

      {/* 카테고리 */}
      <div className="p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-3">카테고리</h3>
        <ul className="space-y-1">
          {categories.map((category) => {
            const isActive = searchParams.category === category.id
            return (
              <li key={category.id}>
                <button
                  onClick={() => handleCategoryChange(category.id)}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    isActive
                      ? 'bg-orange-50 font-semibold text-orange-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {category.name}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* 정렬 */}
      <div className="p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-3">정렬</h3>
        <select
          value={searchParams.sort || 'newest'}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
        >
          {Object.entries(sortLabel).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <div className="p-5">
          <button
            onClick={clearAllFilters}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:border-gray-400 transition-colors"
          >
            필터 초기화
          </button>
        </div>
      )}
    </aside>
  )
}
