import { Star } from 'lucide-react'
import { WritingEntry, WritingTopic, User } from '@/types/writing'
import WritingCard from './WritingCard'

interface FeaturedTabProps {
  featuredWritings: WritingEntry[]
  writingTopics: WritingTopic[]
  featuredTopic: string
  currentUser: User | null
  setFeaturedTopic: (topic: string) => void
  onLike: (writingId: string) => void
}

export default function FeaturedTab({
  featuredWritings,
  writingTopics,
  featuredTopic,
  currentUser,
  setFeaturedTopic,
  onLike
}: FeaturedTabProps) {
  const topicOptions = ['all', ...writingTopics.map(topic => topic.title)]

  return (
    <div className="max-w-4xl mx-auto">
      {/* 주제 필터 */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {topicOptions.map((topic) => (
          <button
            key={topic}
            onClick={() => setFeaturedTopic(topic)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              featuredTopic === topic
                ? 'bg-pink-600 text-white'
                : 'bg-white/50 text-gray-600 hover:bg-white/70'
            }`}
          >
            {topic === 'all' ? '전체' : topic}
          </button>
        ))}
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
          <Star className="w-8 h-8 text-yellow-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">우수 작품</h3>
        <p className="text-gray-600">좋아요를 많이 받은 작품들입니다</p>
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
          />
        ))}
      </div>

      {featuredWritings.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">아직 우수 작품이 없어요</h3>
          <p className="text-gray-500">좋아요를 받은 작품들이 여기에 표시됩니다.</p>
        </div>
      )}
    </div>
  )
}