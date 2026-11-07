'use client'

import { useState, useTransition } from 'react'
import { NewsItem } from '@/types/Board'
import { formatDate } from '@/lib/utils'
import { NewsDetail } from './NewsDetail'
import { deleteNewsItem } from '@/lib/actions/admin/news/action'

interface NewsTableProps {
  items: NewsItem[]
  onEdit: (item: NewsItem) => void
}

export function NewsTable({ items, onEdit }: NewsTableProps) {
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [viewingItem, setViewingItem] = useState<NewsItem | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    
    setDeletingId(id)
    startTransition(async () => {
      const result = await deleteNewsItem(id)
      if (result.error) {
        alert(result.error)
      }
      setDeletingId(null)
    })
  }

  const handleView = (item: NewsItem) => {
    setViewingItem(item)
  }

  const handleEditFromDetail = (item: NewsItem) => {
    setViewingItem(null) // 모달 닫기
    onEdit(item) // 편집 모드로
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">등록된 공지사항이 없습니다</h3>
        <p className="text-gray-500 mb-6">첫 번째 공지사항을 작성해보세요.</p>
        <div className="text-sm text-gray-400">
          공지사항을 통해 중요한 소식을 전달할 수 있습니다.
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                제목
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                카테고리
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                조회수
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                등록일
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr 
                key={item.id} 
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleView(item)}
              >
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <div className="text-sm font-semibold text-gray-900 truncate hover:text-orange-600 transition-colors">
                      {item.title}
                    </div>
                    {item.summary && (
                      <div className="text-sm text-gray-500 truncate mt-1">
                        {item.summary}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.important ?(
                    <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 animate-pulse">
                      중요
                    </span>
                  ):null}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  <span className="flex items-center">
                    {item.views.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.createdAt ? formatDate(item.createdAt) : ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleView(item)}
                      className="text-orange-600 hover:text-orange-800 transition-colors font-medium"
                      disabled={isPending}
                    >
                      보기
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="text-orange-600 hover:text-orange-800 transition-colors font-medium"
                      disabled={isPending}
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors font-medium"
                      disabled={isPending || deletingId === item.id}
                    >
                      {deletingId === item.id ? '삭제중...' : '삭제'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 테이블 하단 안내 */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>행을 클릭하면 게시글을 바로 볼 수 있습니다.</span>
            <span>총 {items.length}개의 공지사항</span>
          </div>
        </div>
      </div>

      {/* 게시글 상세 보기 모달 */}
      {viewingItem && (
        <NewsDetail 
          item={viewingItem} 
          onClose={() => setViewingItem(null)}
          onEdit={handleEditFromDetail}
        />
      )}
    </>
  )
}