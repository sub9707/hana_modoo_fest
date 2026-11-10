import { Heart, Award } from 'lucide-react'
import { WritingEntry, User } from '@/types/writing'
import { formatDateMobile } from '@/utils/writing'

interface WritingCardProps {
  entry: WritingEntry
  currentUser: User | null
  onLike: (writingId: string) => void
  showRanking?: boolean
  rankingIndex?: number
  isMyWriting?: boolean
  isLiking?: boolean
}

export default function WritingCard({ 
  entry, 
  currentUser, 
  onLike, 
  showRanking = false, 
  rankingIndex, 
  isMyWriting = false,
  isLiking = false
}: WritingCardProps) {
  // is_liked 는 API 에서 boolean 대신 0/1 로 내려올 수 있다
  const isLiked = entry.is_liked === true || entry.is_liked === 1
  
  return (
    <div className={`bg-white/70 rounded-2xl p-4 md:p-6 hover:bg-white/80 transition-colors ${
      entry.is_featured ? 'ring-2 ring-pink-600/30' : ''
    }`}>
      {/* 상단: 토픽과 우수작품 뱃지 */}
      <div className="flex justify-between items-start mb-3">
        <div className="bg-gray-100 text-gray-600 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
          {entry.topic}
        </div>
        {entry.is_featured ? (
          <div className="bg-pink-600/10 text-pink-600 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium flex items-center">
            <Award className="w-3 h-3 md:w-4 md:h-4 mr-1" />
            <span className="hidden sm:inline">우수작품</span>
            <span className="sm:hidden">우수</span>
          </div>
        ):null}
      </div>

      {/* 작성자 정보 */}
      <div className="flex items-center space-x-3 mb-3 md:mb-4">
        <div className="relative">
          <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${
            isMyWriting ? 'from-blue-500 to-blue-600' : 'from-pink-600 to-purple-600'
          } rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base`}>
            {isMyWriting ? '내' : entry.author_name[0]}
          </div>
          {showRanking && typeof rankingIndex === 'number' && (
            <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-yellow-500 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs font-bold">
              {rankingIndex + 1}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-900 text-sm md:text-base truncate">{entry.author_name}</span>
            {entry.is_featured ? (
              <Award className="w-3 h-3 md:w-4 md:h-4 text-pink-600 flex-shrink-0" />
            ) : null}
          </div>
          <div className="text-xs md:text-sm text-gray-500">{formatDateMobile(entry.created_at)}</div>
        </div>
      </div>
      
      {/* 글 내용 */}
      <div className="mb-4">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 leading-tight">{entry.title}</h3>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed">{entry.content}</p>
      </div>
      
      {/* 하단: 좋아요 버튼 */}
      <div className="flex justify-between items-center">
        {isMyWriting ? (
          <div className="flex items-center space-x-2 px-3 md:px-4 py-2 rounded-full bg-gray-100 text-gray-600">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">{entry.likes_count}</span>
          </div>
        ) : (
          <button
            onClick={() => onLike(entry.id)}
            disabled={!currentUser || isLiking}
            className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-full transition-all touch-manipulation ${
              isLiked
                ? 'bg-red-100 text-red-600'
                : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500 active:bg-red-100'
            } ${!currentUser || isLiking ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            {/* 좋아요 처리 중 */}
            {isLiking ? (
              <>
                <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                <span className="text-sm font-medium">{entry.likes_count}</span>
              </>
            ) : (
              <>
                <Heart className={`w-4 h-4 transition-all ${isLiked ? 'fill-current scale-110' : ''}`} />
                <span className="text-sm font-medium">{entry.likes_count}</span>
              </>
            )}
          </button>
        )}
        
        {/* 모바일에서는 빈 공간 */}
        <div></div>
      </div>
    </div>
  )
}