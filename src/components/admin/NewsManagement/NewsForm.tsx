'use client'

import { TiptapEditor } from '@/components/common/TiptapEditor'
import { createNewsItem, updateNewsItem } from '@/lib/actions/admin/news/action'
import { NewsItem } from '@/types/Board'
import { useState, useRef, useTransition } from 'react'

interface NewsFormProps {
    item?: NewsItem
    categories: string[]
    onSuccess?: () => void
    onCancel?: () => void
}

export function NewsForm({ item, categories, onSuccess, onCancel }: NewsFormProps) {
    const [isPending, startTransition] = useTransition()
    const formRef = useRef<HTMLFormElement>(null)
    const [error, setError] = useState<string | null>(null)

    // 에디터 상태 관리
    const [editorContent, setEditorContent] = useState(item?.content || '')


    const handleSubmit = async (formData: FormData) => {
        setError(null)

        // HTML 에디터 내용을 FormData에 추가
        const wrappedContent = `<div>${editorContent}</div>`
        formData.set('content', wrappedContent)

        startTransition(async () => {
            const result = item
                ? await updateNewsItem(item.id, formData)
                : await createNewsItem(formData)

            if (result.error) {
                setError(result.error)
            } else {
                formRef.current?.reset()
                setEditorContent('')
                onSuccess?.()
            }
        })
    }

    // 텍스트 길이 체크 (HTML 태그 제외)
    const getTextLength = (html: string) => {
        const div = document.createElement('div')
        div.innerHTML = html
        return div.textContent?.length || 0
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    {item ? '공지사항 수정' : '공지사항 작성'}
                </h2>
                <div className="text-sm text-gray-500 flex items-center">
                    <span className="mr-2">📝</span>
                    글자수: {getTextLength(editorContent)}자
                </div>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    <div className="flex items-center">
                        <span className="text-red-500 mr-2">⚠️</span>
                        {error}
                    </div>
                </div>
            )}

            <form ref={formRef} action={handleSubmit} className="space-y-6">
                {/* 기본 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            제목 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            defaultValue={item?.title}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            disabled={isPending}
                            placeholder="공지사항 제목을 입력하세요"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            카테고리 <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="category"
                            defaultValue={item?.category}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            disabled={isPending}
                        >
                            <option value="">카테고리 선택</option>
                            <option value="공지사항">공지사항</option>
                            <option value="현장안내">현장안내</option>
                        </select>

                    </div>
                </div>

                {/* 요약 */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        요약 <span className="text-gray-500 text-xs">(목록에 표시될 간단한 설명)</span>
                    </label>
                    <input
                        type="text"
                        name="summary"
                        defaultValue={item?.summary}
                        placeholder="공지사항 요약을 입력하세요 (선택사항)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        disabled={isPending}
                        maxLength={200}
                    />
                </div>

                {/* 설정 옵션 */}
                <div className="grid grid-cols-1 gap-6">
                    <div className="flex items-center h-full">
                        <div className="flex items-center space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg w-full">
                            <input
                                type="checkbox"
                                name="important"
                                value="true"
                                defaultChecked={item?.important}
                                className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                disabled={isPending}
                            />
                            <label className="text-sm font-medium text-gray-900 flex items-center">
                                <span className="mr-2">🚨</span>
                                중요 공지사항으로 설정
                                <span className="ml-2 text-xs text-gray-500">(목록 상단에 표시)</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* HTML 에디터 */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        내용 <span className="text-red-500">*</span>
                        <span className="text-xs text-gray-500 ml-2 font-normal">
                            (HTML 형식으로 작성됩니다)
                        </span>
                    </label>
                    <TiptapEditor
                        value={editorContent}
                        onChange={setEditorContent}
                        placeholder="공지사항 내용을 입력하세요..."
                        disabled={isPending}
                        height="400px"
                    />
                    {!editorContent.trim() && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                            <span className="mr-1">⚠️</span>
                            내용을 입력해주세요.
                        </p>
                    )}
                </div>

                {/* 액션 버튼 */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                    <button
                        type="submit"
                        disabled={isPending || !editorContent.trim()}
                        className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all transform active:scale-[0.98]"
                    >
                        {isPending ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {item ? '수정 중...' : '등록 중...'}
                            </span>
                        ) : (
                            <span className="flex items-center justify-center">
                                {item ? '수정 완료' : '등록하기'}
                            </span>
                        )}
                    </button>

                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isPending}
                            className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 font-semibold transition-all transform active:scale-[0.98]"
                        >
                            취소
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}