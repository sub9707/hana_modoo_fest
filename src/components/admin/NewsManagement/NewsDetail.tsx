'use client'

import { useEffect, useState } from 'react'
import { NewsItem } from '@/types/Board'

interface NewsDetailProps {
    item: NewsItem
    onClose: () => void
    onEdit?: (item: NewsItem) => void
}

export function NewsDetail({ item, onClose, onEdit }: NewsDetailProps) {
    const [currentItem, setCurrentItem] = useState(item)

    useEffect(() => {
        // 게시글 열람 시 조회수 증가
        const increaseViewCount = async () => {
            try {
                setCurrentItem(prev => ({ ...prev, views: prev.views + 1 }))
            } catch (error) {
                console.error('조회수 증가 실패:', error)
            }
        }

        increaseViewCount()
    }, [item.id])

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                        공지사항
                    </h2>
                    <div className="flex items-center gap-3">
                        {onEdit && (
                            <button
                                onClick={() => onEdit(currentItem)}
                                className="px-4 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                            >
                                수정
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all"
                        >
                            ×
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                    <div className="p-8">
                        {/* 게시글 헤더 */}
                        <div className="border-b border-gray-200 pb-8 mb-8">
                            <div className="flex flex-wrap items-center gap-3 text-sm mb-6">
                                <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                                    {currentItem.category}
                                </span>
                                {currentItem.important && (
                                    <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 animate-pulse">
                                        중요 공지
                                    </span>
                                )}
                                <span className="inline-flex items-center px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                                    조회 {currentItem.views.toLocaleString()}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                                    {currentItem.createdAt ? new Date(currentItem.createdAt).toLocaleDateString('ko-KR') : ''}
                                </span>
                            </div>

                            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                                {currentItem.title}
                            </h1>

                            {currentItem.summary && (
                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-4">
                                    <p className="text-lg text-gray-700 italic leading-relaxed">
                                        {currentItem.summary}
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center justify-between text-sm text-gray-500 pt-4">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center">
                                        등록: {currentItem.createdAt
                                            ? new Date(currentItem.createdAt).toLocaleDateString('ko-KR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                            : ''}
                                    </span>
                                    {currentItem.updatedAt && currentItem.updatedAt !== currentItem.createdAt && (
                                        <span className="flex items-center">
                                            수정: {new Date(currentItem.updatedAt).toLocaleDateString('ko-KR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    {currentItem.contentType?.toUpperCase() || 'HTML'}
                                </span>
                            </div>
                        </div>

                        {/* 게시글 본문 */}
                        <div className="prose prose-lg max-w-none">
                            <div
                                dangerouslySetInnerHTML={{ __html: currentItem.content }}
                                className="leading-relaxed text-gray-800 min-h-[200px]"
                                style={{
                                    wordBreak: 'break-word',
                                    lineHeight: '1.8'
                                }}
                            />
                        </div>

                        {/* 게시글 푸터 */}
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    <span className="flex items-center">
                                        이 공지사항은 <strong>{currentItem.category}</strong>&nbsp; 카테고리에 속합니다.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}