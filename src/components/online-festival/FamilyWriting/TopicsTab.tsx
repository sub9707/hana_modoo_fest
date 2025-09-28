import { PenTool, Calendar } from 'lucide-react'
import { WritingTopic } from '@/types/writing'

interface TopicsTabProps {
  writingTopics: WritingTopic[]
  onTopicSelect: (topic: WritingTopic) => void
}

export default function TopicsTab({ writingTopics, onTopicSelect }: TopicsTabProps) {
  console.log('📝 사용 가능한 글쓰기 주제:', writingTopics)
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid gap-4 md:gap-6">
        {writingTopics.map((topic) => (
          <div key={topic.id} className="bg-white/70 rounded-2xl p-4 md:p-6 hover:bg-white/80 transition-colors">
            {/* 모바일: 세로 배치, 데스크톱: 가로 배치 */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 space-y-3 md:space-y-0">
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{topic.title}</h3>
                <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 leading-relaxed">{topic.description}</p>
              </div>
              
              {/* 참여자 수와 마감일 - 모바일에서는 가로 배치 */}
              <div className="flex flex-row md:flex-col md:text-right space-x-4 md:space-x-0 md:space-y-2">
                <div className="text-xs md:text-sm text-gray-500 flex items-center">
                  <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  ~{topic.deadline}
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-xs md:text-sm font-semibold text-gray-700 mb-2">💡 이런 내용으로 써보세요:</h4>
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {topic.examples.map((example, index) => (
                  <span key={index} className="bg-gray-100 text-gray-600 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">
                    {example}
                  </span>
                ))}
              </div>
            </div>

            {/* 모바일: 세로 배치, 데스크톱: 가로 배치 */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
              <div className="flex items-center">
                <span className={`px-3 py-1.5 md:py-1 rounded-full text-xs md:text-sm font-medium ${
                  topic.is_active 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {topic.is_active ? '접수 중' : '마감'}
                </span>
              </div>
              <button
                onClick={() => onTopicSelect(topic)}
                disabled={!topic.is_active}
                className="flex items-center justify-center space-x-2 w-full md:w-auto px-4 md:px-6 py-3 bg-pink-600 text-white font-semibold rounded-xl hover:bg-pink-600/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm md:text-base"
              >
                <PenTool className="w-4 h-4" />
                <span>이 주제로 글쓰기</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}