import { WritingEntry, WritingTopic, User, SortType } from '@/types/writing'
import WritingCard from './WritingCard'

interface BrowseTabProps {
  browseWritings: WritingEntry[]
  writingTopics: WritingTopic[]
  browseSort: SortType
  browseTopic: string
  totalWritings: number
  loading: boolean
  browseHasMore: boolean
  currentUser: User | null
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
  setBrowseSort,
  setBrowseTopic,
  onLike
}: BrowseTabProps) {
  const topicOptions = ['all', ...writingTopics.map(topic => topic.title)]

  return (
    <div className="max-w-4xl mx-auto">
      {/* 필터링 */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {topicOptions.map((topic) => (
            <button
              key={topic}
              onClick={() => setBrowseTopic(topic)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                browseTopic === topic
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {topic === 'all' ? '전체' : topic}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {(['latest', 'popular', 'oldest'] as SortType[]).map((sort) => (
            <button
              key={sort}
              onClick={() => setBrowseSort(sort)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                browseSort === sort
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {sort === 'latest' ? '최신순' : sort === 'popular' ? '인기순' : '오래된순'}
            </button>
          ))}
        </div>
      </div>

      {/* 통계 */}
      <div className="text-center p-4 bg-white/50 rounded-2xl mb-8">
        <div className="text-2xl md:text-3xl font-bold text-pink-600 mb-2">
          {totalWritings}
        </div>
        <div className="text-sm md:text-base text-gray-600">총 작품수</div>
      </div>

      {/* 작품 목록 - 스크롤 제거하고 전체 높이로 표시 */}
      <div className="space-y-6">
        {browseWritings.map((entry) => (
          <WritingCard
            key={entry.id}
            entry={entry}
            currentUser={currentUser}
            onLike={onLike}
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