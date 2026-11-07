import WritingCard from './WritingCard'
import { WritingEntry, User, SortType, WritingTopic } from '@/types/writing'
import { Pen } from 'lucide-react'

// 정렬 옵션 상수 (컴포넌트 외부에서 한 번만 생성)
const SORT_OPTIONS: { id: SortType; title: string }[] = [
  { id: 'latest', title: '최신순' },
  { id: 'popular', title: '인기순' },
  { id: 'oldest', title: '오래된순' }
]

interface BrowseTabProps {
  browseWritings: WritingEntry[]
  writingTopics: WritingTopic[]
  browseSort: SortType
  browseTopic: string
  totalWritings: number
  loading: boolean
  browseHasMore: boolean
  sentinelRef: (node: Element | null) => void
  currentUser: User | null
  likingWritings: Set<string>
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
  sentinelRef,
  currentUser,
  likingWritings,
  setBrowseSort,
  setBrowseTopic,
  onLike
}: BrowseTabProps) {
  const topics = [
    { id: 'all', title: '전체' },
    ...writingTopics.map(topic => ({ id: topic.title, title: topic.title }))
  ]

  return (
    <div className="space-y-6">
      {/* 필터 */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 md:p-6 space-y-4">
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
                    ? 'bg-orange-500 text-white'
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
            {SORT_OPTIONS.map((sort) => (
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

      {/* 개수 */}
      <p className="border-b border-gray-200 pb-4 text-sm text-gray-500">
        총 <span className="font-semibold text-gray-900 tabular-nums">{totalWritings.toLocaleString()}</span>개의 작품
      </p>

      {/* 작품 목록 */}
      <div className="space-y-6">
        {browseWritings.map((entry) => (
          <WritingCard
            key={entry.id}
            entry={entry}
            currentUser={currentUser}
            onLike={onLike}
            isLiking={likingWritings.has(entry.id)}
          />
        ))}
        
        {/* 무한 스크롤 감지용 */}
        {browseHasMore && <div ref={sentinelRef} aria-hidden="true" className="h-px" />}

        {loading && (
          <p className="py-8 text-center text-sm text-gray-500">불러오는 중...</p>
        )}

        {!browseHasMore && !loading && browseWritings.length > 0 && (
          <p className="py-8 text-center text-sm text-gray-400">모든 글을 확인했습니다</p>
        )}
      </div>

      {browseWritings.length === 0 && !loading && (
        <div className="text-center py-12">
          <Pen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            {browseTopic === 'all' ? '아직 작품이 없어요' : `${browseTopic} 주제의 작품이 없어요`}
          </h3>
          <p className="text-gray-500">첫 번째 작가가 되어보세요!</p>
        </div>
      )}
    </div>
  )
}