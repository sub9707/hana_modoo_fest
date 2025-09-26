'use client'

import { NewsItem } from '@/types/Board'

interface NewsDetailProps {
  news: NewsItem
  onBack: () => void
}

export default function NewsDetail({ news, onBack }: NewsDetailProps) {
  const getCategoryColor = (category: string) => {
    const colors = {
      '공지사항': 'bg-blue-100 text-blue-700',
      '모집공고': 'bg-green-100 text-green-700',
      '이벤트': 'bg-purple-100 text-purple-700',
      '당첨자발표': 'bg-orange-100 text-orange-700',
      '현장안내': 'bg-gray-100 text-gray-700',
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  const renderContent = () => {
    if (news.contentType === 'html') {
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
    <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden">
      {/* 헤더 */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 active:text-blue-900 mb-4 sm:mb-6 transition-colors duration-200"
        >
          <span className="text-lg">←</span>
          <span className="text-sm sm:text-base font-medium">목록으로 돌아가기</span>
        </button>

        {/* 모바일: 세로 레이아웃 */}
        <div className="block sm:hidden space-y-3 mb-4">
          <div className="flex items-center gap-2">
            {news.important && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                중요
              </span>
            )}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(news.category)}`}>
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
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                중요
              </span>
            )}
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(news.category)}`}>
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
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mb-6">
            <p className="text-blue-800 font-medium text-sm sm:text-base leading-relaxed">
              {news.summary}
            </p>
          </div>
        )}

        {/* 본문 */}
        <div className="mb-6">
          {renderContent()}
        </div>

        {/* 첨부파일 */}
        {news.attachments && news.attachments.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">첨부파일</h3>
            <div className="space-y-2 sm:space-y-3">
              {news.attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-lg sm:text-xl text-gray-400">📎</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm sm:text-base truncate leading-tight">
                      {attachment.originalFilename}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {(attachment.fileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap">
                    다운로드
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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