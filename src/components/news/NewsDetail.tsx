interface NewsItem {
  id: string
  title: string
  category: string
  date: string
  summary: string
  content: string
  views: number
  important: boolean
  author: string
}

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

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* 헤더 */}
      <div className="p-6 border-b border-gray-200">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          <span>←</span>
          <span>목록으로 돌아가기</span>
        </button>
        
        <div className="flex items-start justify-between mb-4">
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
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {news.title}
        </h1>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600">
            📝 {news.author}
          </span>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
              📤 공유
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              🔖 북마크
            </button>
          </div>
        </div>
      </div>
      
      {/* 내용 */}
      <div className="p-6">
        <div className="prose max-w-none">
          <p className="text-lg text-gray-700 leading-relaxed">
            {news.content}
          </p>
          
          {/* 추가 내용 샘플 */}
          <div className="mt-8 space-y-4">
            <h3 className="text-xl font-bold text-gray-800">상세 안내</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800">
                자세한 내용은 홈페이지의 해당 섹션을 참고하시거나, 
                전화(02-000-0000)로 문의주시기 바랍니다.
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                최종 수정일: {news.date}
              </div>
              <div className="flex space-x-4 text-sm">
                <button className="text-blue-600 hover:text-blue-800">
                  이전 글
                </button>
                <span className="text-gray-300">|</span>
                <button className="text-blue-600 hover:text-blue-800">
                  다음 글
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}