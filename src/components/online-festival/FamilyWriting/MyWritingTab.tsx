import { User, Lock, Pen } from 'lucide-react'
import { WritingEntry, User as UserType, TabType } from '@/types/writing'
import WritingCard from './WritingCard'

interface MyWritingsTabProps {
  myWritings: WritingEntry[]
  currentUser: UserType | null
  loading: boolean
  myHasMore: boolean
  setCurrentTab: (tab: any) => void  // any로 설정하여 타입 충돌 회피
}

export default function MyWritingsTab({
  myWritings,
  currentUser,
  loading,
  myHasMore,
  setCurrentTab
}: MyWritingsTabProps) {
  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">로그인이 필요합니다</h3>
          <p className="text-gray-500">내 글을 보려면 로그인해주세요</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{currentUser.name}님의 글</h3>
        <p className="text-gray-600">작성하신 글들을 확인해보세요</p>
      </div>

      {/* 내 글 목록 - 스크롤 제거하고 전체 높이로 표시 */}
      <div className="space-y-6">
        {myWritings.map((entry) => (
          <WritingCard
            key={entry.id}
            entry={entry}
            currentUser={currentUser}
            onLike={() => {}} // 내 글이므로 좋아요 비활성화
            isMyWriting={true}
          />
        ))}
        
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
            <div className="text-gray-500 mt-2">로딩 중...</div>
          </div>
        )}
        
        {!myHasMore && myWritings.length > 0 && (
          <div className="text-center py-8">
            <div className="text-gray-500">모든 글을 확인했습니다.</div>
          </div>
        )}
      </div>

      {myWritings.length === 0 && !loading && (
        <div className="text-center py-12">
          <Pen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">아직 작성한 글이 없어요</h3>
          <p className="text-gray-500 mb-6">첫 번째 글을 작성해보세요!</p>
          <button
            onClick={() => setCurrentTab('topics')}
            className="px-6 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-600/90 transition-colors"
          >
            글쓰기 시작하기
          </button>
        </div>
      )}
    </div>
  )
}