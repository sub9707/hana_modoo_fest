interface NewsItem {
  id: string
  title: string
  category: string
  date: string
  summary: string
  views: number
  important: boolean
  author: string
}

interface NewsCardProps {
  news: NewsItem
  onClick: () => void
}

export default function NewsCard({ news, onClick }: NewsCardProps) {
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
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      <div className="p-6">
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
        
        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
          {news.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {news.summary}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            📝 {news.author}
          </span>
          <span className="text-blue-500 group-hover:text-blue-700 font-medium text-sm">
            자세히 보기 →
          </span>
        </div>
      </div>
    </div>
  )
}