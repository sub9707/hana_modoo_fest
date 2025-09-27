'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'

interface NewsFilterProps {
  categories: string[]
}

export function NewsFilter({ categories }: NewsFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    important: searchParams.get('important') || ''
  })

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    
    params.delete('page') // 필터 변경 시 첫 페이지로
    
    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  const resetFilters = () => {
    setFilters({ search: '', category: '', important: '' })
    startTransition(() => {
      router.push('/admin/news')
    })
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            검색
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            placeholder="제목, 내용 검색..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            카테고리
          </label>
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">전체</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            중요도
          </label>
          <select
            value={filters.important}
            onChange={(e) => setFilters(prev => ({ ...prev, important: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">전체</option>
            <option value="true">중요</option>
            <option value="false">일반</option>
          </select>
        </div>

        <div className="flex items-end space-x-2">
          <button
            onClick={applyFilters}
            disabled={isPending}
            className="flex-1 bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 disabled:opacity-50"
          >
            {isPending ? '검색중...' : '검색'}
          </button>
          <button
            onClick={resetFilters}
            disabled={isPending}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  )
}