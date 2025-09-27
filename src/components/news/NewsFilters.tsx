'use client'

import { useState, useEffect, useCallback } from 'react'
import { NewsSearchParams } from '@/types/Board'

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
  const [isSearchFocused, setIsSearchFocused] = useState(false)

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

  return (
    <div className="space-y-6">
      {/* 검색 섹션 */}
      <div className="bg-white shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">검색</h3>
            {searchParams.search && (
              <button
                onClick={handleSearchClear}
                className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
              >
                초기화
              </button>
            )}
          </div>
          
          <div className={`relative transition-all duration-200 ${
            isSearchFocused ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
          }`}>
            <input
              type="text"
              placeholder="제목이나 내용으로 검색..."
              value={searchInput}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full pl-4 pr-10 py-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <div className="absolute right-3 top-3">
              {searchInput ? (
                <button
                  onClick={handleSearchClear}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              ) : (
                <span className="text-gray-400">🔍</span>
              )}
            </div>
          </div>
          
          {searchParams.search && (
            <div className="mt-3 p-2 bg-blue-50">
              <span className="text-sm text-blue-800">
                '<strong>{searchParams.search}</strong>' 검색 중
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="bg-white shadow-md overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">카테고리</h3>
          <div className="space-y-2">
            {categories.map((category) => {
              const isActive = searchParams.category === category.id
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 border-2 border-blue-300 text-blue-700 shadow-sm'
                      : 'hover:bg-gray-50 text-gray-700 border-2 border-transparent hover:border-gray-200'
                  }`}
                >
                  <span className={`font-medium ${isActive ? 'text-blue-700' : 'text-gray-700'}`}>
                    {category.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 정렬 옵션 */}
      <div className="bg-white shadow-md overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">정렬</h3>
          <select 
            value={searchParams.sort || 'newest'}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
          >
            <option value="newest">최신순</option>
            <option value="oldest">오래된순</option>
            <option value="views">조회수순</option>
            <option value="important">중요도순</option>
          </select>
        </div>
      </div>

      {/* 필터 초기화 */}
      {hasActiveFilters && (
        <div className="bg-white shadow-md overflow-hidden">
          <div className="p-6">
            <button
              onClick={clearAllFilters}
              className="w-full px-4 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 font-medium"
            >
              🔄 모든 필터 초기화
            </button>
          </div>
        </div>
      )}

      {/* 현재 필터 상태 표시 */}
      {hasActiveFilters && (
        <div className="bg-blue-50 border border-blue-200 overflow-hidden">
          <div className="p-6">
            <h4 className="text-sm font-semibold text-blue-800 mb-3">적용된 필터</h4>
            <div className="space-y-2">
              {searchParams.category !== 'all' && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">카테고리:</span>
                  <span className="text-sm font-medium text-blue-800">
                    {categories.find(c => c.id === searchParams.category)?.name}
                  </span>
                </div>
              )}
              {searchParams.search && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">검색어:</span>
                  <span className="text-sm font-medium text-blue-800">
                    "{searchParams.search}"
                  </span>
                </div>
              )}
              {searchParams.sort !== 'newest' && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">정렬:</span>
                  <span className="text-sm font-medium text-blue-800">
                    {searchParams.sort === 'oldest' ? '오래된순' :
                     searchParams.sort === 'views' ? '조회수순' :
                     searchParams.sort === 'important' ? '중요도순' : '최신순'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {/* 모바일 전용 필터 상태 */}
      <div className="lg:hidden bg-white rounded-xl shadow-md p-4">
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {categories.find(c => c.id === searchParams.category)?.count || 0}개의 소식
          </p>
        </div>
      </div>
    </div>
  )
}