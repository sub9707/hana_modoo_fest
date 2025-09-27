'use client'

import { NewsItem } from '@/types/Board'
import { useState } from 'react'
import { NewsFilter } from './NewsFilter'
import { NewsTable } from './NewsTable'
import { NewsPagination } from './NewsPagination'
import { NewsForm } from './NewsForm'


interface NewsManagementProps {
  initialData: {
    items: NewsItem[]
    total: number
    page: number
    totalPages: number
  }
  categories: string[]
  initialParams: any
}

export function NewsManagement({ initialData, categories }: NewsManagementProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<NewsItem | undefined>()

  const handleEdit = (item: NewsItem) => {
    setEditingItem(item)
    setIsFormOpen(true)
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false)
    setEditingItem(undefined)
  }

  const handleFormCancel = () => {
    setIsFormOpen(false)
    setEditingItem(undefined)
  }

  return (
    <div className="space-y-6">
      {/* 필터 섹션 */}
      <NewsFilter categories={categories} />

      {/* 액션 버튼 */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          총 {initialData.total}개의 공지사항
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-600 cursor-pointer"
        >
          새 공지사항 작성
        </button>
      </div>

      {/* 폼 모달 */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <NewsForm
              item={editingItem}
              categories={categories}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}

      {/* 테이블 */}
      <div className="bg-white rounded-lg shadow">
        <NewsTable
          items={initialData.items} 
          onEdit={handleEdit}
        />
      </div>

      {/* 페이지네이션 */}
      <NewsPagination
        currentPage={initialData.page}
        totalPages={initialData.totalPages}
        total={initialData.total}
      />
    </div>
  )
}