'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'

interface NewsPaginationProps {
  currentPage: number
  totalPages: number
  total: number
}

export function NewsPagination({ currentPage, totalPages, total }: NewsPaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    
    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  const getPageNumbers = () => {
    const delta = 2
    const range: number[] = []
    const rangeWithDots: (number | string)[] = []

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-700">
        총 {total}개 항목 중 {((currentPage - 1) * 10) + 1}-{Math.min(currentPage * 10, total)} 표시
      </div>
      
      <div className="flex space-x-1">
        <button
          onClick={() => changePage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1 || isPending}
          className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          이전
        </button>

        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' ? changePage(page) : undefined}
            disabled={page === '...' || page === currentPage || isPending}
            className={`px-3 py-2 border rounded-md ${
              page === currentPage
                ? 'bg-orange-600 text-white border-orange-600'
                : page === '...'
                ? 'border-gray-300 cursor-default'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => changePage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || isPending}
          className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  )
}