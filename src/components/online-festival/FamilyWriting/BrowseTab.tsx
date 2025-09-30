import WritingCard from './WritingCard'
import { WritingEntry, User, SortType, WritingTopic } from '@/types/writing'

interface BrowseTabProps {
  browseWritings: WritingEntry[]
  writingTopics: WritingTopic[]
  browseSort: SortType
  browseTopic: string
  totalWritings: number
  loading: boolean
  browseHasMore: boolean
  currentUser: User | null
  likingWritings: Set<string> // 🚀 새로 추가
  setBrowseSort: (sort: SortType) => void
  setBrowseTopic: (topic: string) => void
  onLike: (writingId: string) => void
}

export default function BrowseTab({
  browseWritings,
  writingTopics,
  browseSort,
  browseTopic,
  totalWritings,
  loading,
  browseHasMore,
  currentUser,
  likingWritings, // 🚀 새로 추가
  setBrowseSort,
  setBrowseTopic,
  onLike
}: BrowseTabProps) {
  const topics = [
    { id: 'all', title: '전체' },
    ...writingTopics.map(topic => ({ id: topic.title, title: topic.title }))
  ]

  const sorts: { id: SortType; title: string }[] = [
    { id: 'latest', title: '최신순' },
    { id: 'popular', title: '인기순' },
    { id: 'oldest', title: '오래된순' }
  ]

  return (
    <div className="space-y-6">
      {/* 필터 */}
      <div className="bg-white/60 rounded-2xl p-4 md:p-6 space-y-4">
        {/* 주제 필터 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">주제</label>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setBrowseTopic(topic.id)}
                className={`px-3 md:px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  browseTopic === topic.id
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {topic.title}
              </button>
            ))}
          </div>
        </div>

        {/* 정렬 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">정렬</label>
          <div className="flex flex-wrap gap-2">
            {sorts.map((sort) => (
              <button
                key={sort.id}
                onClick={() => setBrowseSort(sort.id)}
                className={`px-3 md:px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  browseSort === sort.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {sort.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 통계 */}
      <div className="text-center p-4 bg-white/50 rounded-2xl mb-8">
        <div className="text-2xl md:text-3xl font-bold text-pink-600 mb-2">
          {totalWritings}
        </div>
        <div className="text-sm md:text-base text-gray-600">총 작품수</div>
      </div>

      {/* 작품 목록 */}
      <div className="space-y-6">
        {browseWritings.map((entry) => (
          <WritingCard
            key={entry.id}
            entry={entry}
            currentUser={currentUser}
            onLike={onLike}
            isLiking={likingWritings.has(entry.id)} // 🚀 새로 추가
          />
        ))}
        
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
            <div className="text-gray-500 mt-2">로딩 중...</div>
          </div>
        )}
        
        {!browseHasMore && browseWritings.length > 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500">모든 글을 확인했습니다.</div>
          </div>
        )}
      </div>

      {browseWritings.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            {browseTopic === 'all' ? '아직 작품이 없어요' : `${browseTopic} 주제의 작품이 없어요`}
          </h3>
          <p className="text-gray-500">첫 번째 작가가 되어보세요!</p>
        </div>
      )}
    </div>
  )
}