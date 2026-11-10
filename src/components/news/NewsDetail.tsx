'use client'

import { NewsItem } from '@/types/Board'

interface NewsDetailProps {
  news: NewsItem
  onBack: () => void
}

export default function NewsDetail({ news, onBack }: NewsDetailProps) {
  const getCategoryColor = (_category: string) => 'text-gray-500'

  const renderContent = () => {
    // contentType 이 누락된 예전 글도 태그가 있으면 HTML 로 렌더링한다
    if (news.contentType === 'html' || news.content.includes('<')) {
      return (
        <div
          className="
    prose prose-sm sm:prose-lg max-w-none
    prose-headings:leading-tight sm:prose-headings:leading-snug
    !prose-p:leading-8 sm:!prose-p:leading-10
    !prose-li:leading-7 sm:!prose-li:leading-9
    prose-ul:mt-4 prose-ol:mt-4
    prose-strong:text-gray-800
    px-4 sm:px-6
  "
          dangerouslySetInnerHTML={{ __html: news.content }}
        />
      )
    }

    return (
      <div className="prose prose-sm sm:prose-lg max-w-none">
        <p className="text-gray-700 whitespace-pre-line text-sm sm:text-base leading-7 sm:leading-8">
          {news.content}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* 헤더 */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 mb-4 sm:mb-6 transition-colors duration-200"
        >
          <span className="text-lg">←</span>
          <span className="text-sm sm:text-base font-medium">목록으로 돌아가기</span>
        </button>

        {/* 모바일: 세로 레이아웃 */}
        <div className="block sm:hidden space-y-3 mb-4">
          <div className="flex items-center gap-2">
            {news.important && (
              <span className="rounded border border-orange-300 px-1.5 py-0.5 text-xs font-semibold text-orange-600">
                중요
              </span>
            )}
            <span className={`text-xs font-medium ${getCategoryColor(news.category)}`}>
              {news.category}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="font-medium">{news.views.toLocaleString()}회 조회</span>
            <span className="text-gray-400">{news.date}</span>
          </div>
        </div>

        {/* 데스크톱: 가로 레이아웃 */}
        <div className="hidden sm:flex items-start justify-between mb-6 gap-3">
          <div className="flex items-center gap-3">
            {news.important && (
              <span className="rounded border border-orange-300 px-1.5 py-0.5 text-xs font-semibold text-orange-600">
                중요
              </span>
            )}
            <span className={`text-sm font-medium ${getCategoryColor(news.category)}`}>
              {news.category}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="font-medium">{news.views.toLocaleString()}회 조회</span>
            <span>{news.date}</span>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 leading-tight">
          {news.title}
        </h1>
      </div>

      {/* 내용 */}
      <div className="p-4 sm:p-6">
        {/* 요약 */}
        {news.summary && (
          <div className="bg-gray-50 border border-gray-200 p-3 sm:p-4 rounded-md mb-6">
            <p className="text-gray-700 font-medium text-sm sm:text-base leading-relaxed">
              {news.summary}
            </p>
          </div>
        )}

        {/* 본문 */}
        <div className="mb-6">
          {renderContent()}
        </div>

        {/* 하단 정보 */}
        <div className="pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            최종 수정일: {news.updatedAt ? new Date(news.updatedAt).toLocaleDateString() : news.date}
          </div>
        </div>
      </div>
    </div>
  )
}