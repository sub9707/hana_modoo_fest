import { Trophy } from 'lucide-react'
import WritingCard from './WritingCard'
import { WritingEntry, User, WritingTopic } from '@/types/writing'

interface FeaturedTabProps {
  featuredWritings: WritingEntry[]
  writingTopics: WritingTopic[]
  featuredTopic: string
  currentUser: User | null
  likingWritings: Set<string> // 🚀 새로 추가
  setFeaturedTopic: (topic: string) => void
  onLike: (writingId: string) => void
}

export default function FeaturedTab({
  featuredWritings,
  writingTopics,
  featuredTopic,
  currentUser,
  likingWritings, // 🚀 새로 추가
  setFeaturedTopic,
  onLike
}: FeaturedTabProps) {
  const topics = [
    { id: 'all', title: '전체' },
    ...writingTopics.map(topic => ({ id: topic.title, title: topic.title }))
  ]

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="text-center bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 md:p-8 border border-yellow-200">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500 rounded-full mb-4">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          우수 작품
        </h3>
        <p className="text-sm md:text-base text-gray-600">
          좋아요를 많이 받은 상위 10개의 작품입니다
        </p>
      </div>

      {/* 주제 필터 */}
      <div className="bg-white/60 rounded-2xl p-4 md:p-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">주제별 보기</label>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setFeaturedTopic(topic.id)}
              className={`px-3 md:px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                featuredTopic === topic.id
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {topic.title}
            </button>
          ))}
        </div>
      </div>

      {/* 우수 작품 목록 */}
      <div className="space-y-6">
        {featuredWritings.map((entry, index) => (
          <WritingCard
            key={entry.id}
            entry={entry}
            currentUser={currentUser}
            onLike={onLike}
            showRanking={true}
            rankingIndex={index}
            isLiking={likingWritings.has(entry.id)} // 🚀 새로 추가
          />
        ))}
      </div>

      {featuredWritings.length === 0 && (
        <div className="text-center py-12 bg-white/50 rounded-2xl">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            {featuredTopic === 'all' ? '아직 우수 작품이 없어요' : `${featuredTopic} 주제의 우수 작품이 없어요`}
          </h3>
          <p className="text-gray-500">
            좋아요를 1개 이상 받은 작품이 여기에 표시됩니다
          </p>
        </div>
      )}
    </div>
  )
}