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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: news.title,
          text: news.summary,
          url: window.location.href
        })
      } catch (error) {
        console.log('Share failed:', error)
      }
    } else {
      // 폴백: 클립보드에 복사
      await navigator.clipboard.writeText(window.location.href)
      alert('링크가 클립보드에 복사되었습니다!')
    }
  }

  const renderContent = () => {
    if (news.contentType === 'html') {
      return (
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />
      )
    }
    
    return (
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {news.content}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* 헤더 */}
      <div className="p-6 border-b border-gray-200">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6 transition-all duration-200 back-button"
        >
          <span>←</span>
          <span>목록으로 돌아가기</span>
        </button>
        
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
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
            <span>👀 {news.views.toLocaleString()}</span>
            <span>{news.date}</span>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {news.title}
        </h1>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button 
              onClick={handleShare}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              📤 공유
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              🔖 북마크
            </button>
          </div>
        </div>
      </div>
      
      {/* 내용 - 모바일 최적화 */}
      <div className="p-4 sm:p-6">
        {/* 요약 */}
        {news.summary && (
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mb-6 sm:mb-8">
            <p className="text-blue-800 font-medium text-sm sm:text-base leading-relaxed">
              {news.summary}
            </p>
          </div>
        )}

        {/* 본문 */}
        <div className="mb-6 sm:mb-8">
          {renderContent()}
        </div>

        {/* 첨부파일 - 모바일 최적화 */}
        {news.attachments && news.attachments.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">첨부파일</h3>
            <div className="space-y-3">
              {news.attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-xl sm:text-2xl">📎</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm sm:text-base truncate">{attachment.originalFilename}</p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {(attachment.fileSize / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm whitespace-nowrap">
                    다운로드
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* 하단 정보 - 모바일 최적화 */}
        <div className="pt-4 sm:pt-6 border-t border-gray-200">
          <div className="text-xs sm:text-sm text-gray-500">
            최종 수정일: {news.updatedAt ? new Date(news.updatedAt).toLocaleDateString() : news.date}
          </div>
        </div>
      </div>
    </div>
  )
}