'use client'

import { useState, useEffect } from 'react'
import { Heart, MessageCircle, Send, Filter, RefreshCw } from 'lucide-react'

interface Comment {
  id: number
  author: string
  message: string
  timestamp: string
  likes: number
  category: string
  isLiked?: boolean
}

// 정적 응원 댓글 데이터
const commentsData: Comment[] = [
  {
    id: 1,
    author: "김○○",
    message: "모든 가족이 행복했으면 좋겠어요. 힘내세요! 💝",
    timestamp: "2024-09-12 14:30",
    likes: 47,
    category: "응원",
    isLiked: false
  },
  {
    id: 2,
    author: "이○○",
    message: "한부모 가정도 충분히 아름다운 가족입니다. 서로 이해하고 존중해요!",
    timestamp: "2024-09-12 13:45",
    likes: 63,
    category: "공감",
    isLiked: false
  },
  {
    id: 3,
    author: "박○○",
    message: "축제 너무 기대됩니다! 온 가족이 함께 참여할 예정이에요 🎉",
    timestamp: "2024-09-12 12:20",
    likes: 28,
    category: "기대",
    isLiked: false
  },
  {
    id: 4,
    author: "최○○",
    message: "다양한 가족의 모습이 모두 소중하다는 것을 배웠어요. 감사합니다!",
    timestamp: "2024-09-12 11:15",
    likes: 54,
    category: "감사",
    isLiked: false
  },
  {
    id: 5,
    author: "정○○",
    message: "우리 아이와 함께 참여할 수 있는 프로그램이 많아서 좋네요! 👨‍👧‍👦",
    timestamp: "2024-09-12 10:30",
    likes: 31,
    category: "기대",
    isLiked: false
  },
  {
    id: 6,
    author: "강○○",
    message: "혼자 키우는 것이 힘들 때가 많았는데, 이런 축제가 있어서 위로가 됩니다.",
    timestamp: "2024-09-12 09:45",
    likes: 89,
    category: "응원",
    isLiked: false
  },
  {
    id: 7,
    author: "윤○○",
    message: "모든 엄마, 아빠들 정말 수고 많으세요. 항상 응원합니다! 💪",
    timestamp: "2024-09-12 09:20",
    likes: 76,
    category: "응원",
    isLiked: false
  },
  {
    id: 8,
    author: "임○○",
    message: "가족의 형태는 다양해도, 사랑은 하나죠. 모두 함께 해요!",
    timestamp: "2024-09-12 08:55",
    likes: 42,
    category: "공감",
    isLiked: false
  }
]

const categories = ["전체", "응원", "공감", "기대", "감사"]

const sampleMessages = [
  "모든 가족이 행복하길 바라요! 💕",
  "함께하는 축제, 정말 기대됩니다!",
  "다양한 가족의 모습이 아름다워요 🌈",
  "서로 응원하며 함께 해요!",
  "축제에서 만날 수 있어서 기뻐요!"
]

export default function SupportComments() {
  const [comments, setComments] = useState<Comment[]>(commentsData)
  const [newComment, setNewComment] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [filteredComments, setFilteredComments] = useState<Comment[]>(comments)
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest')

  // 카테고리 및 정렬 필터링
  useEffect(() => {
    let filtered = selectedCategory === '전체' 
      ? comments 
      : comments.filter(comment => comment.category === selectedCategory)

    // 정렬
    if (sortBy === 'popular') {
      filtered = [...filtered].sort((a, b) => b.likes - a.likes)
    } else {
      filtered = [...filtered].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
    }

    setFilteredComments(filtered)
  }, [selectedCategory, comments, sortBy])

  const handleLike = (commentId: number) => {
    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
              isLiked: !comment.isLiked
            }
          : comment
      )
    )
  }

  const handleSubmitComment = () => {
    if (!newComment.trim()) return

    const newCommentObj: Comment = {
      id: comments.length + 1,
      author: authorName.trim() || '익명',
      message: newComment.trim(),
      timestamp: new Date().toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\. /g, '-').replace('.', ''),
      likes: 0,
      category: '응원',
      isLiked: false
    }

    setComments(prev => [newCommentObj, ...prev])
    setNewComment('')
    setAuthorName('')
  }

  const insertSampleMessage = (message: string) => {
    setNewComment(message)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmitComment()
    }
  }

  return (
    <div className="p-8 md:p-12">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-festival-purple/10 rounded-full mb-6">
          <span className="text-2xl">💬</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          따뜻한 응원 메시지
        </h2>
        <p className="text-lg text-gray-600">
          서로에게 따뜻한 응원의 메시지를 전해주세요
        </p>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-3 gap-4 md:gap-6 mb-8">
        <div className="text-center p-4 bg-white/50 rounded-2xl">
          <div className="text-2xl md:text-3xl font-bold text-festival-purple mb-2">
            {comments.length}
          </div>
          <div className="text-sm md:text-base text-gray-600">총 응원글</div>
        </div>
        <div className="text-center p-4 bg-white/50 rounded-2xl">
          <div className="text-2xl md:text-3xl font-bold text-festival-pink mb-2">
            {comments.reduce((sum, comment) => sum + comment.likes, 0)}
          </div>
          <div className="text-sm md:text-base text-gray-600">총 공감수</div>
        </div>
        <div className="text-center p-4 bg-white/50 rounded-2xl">
          <div className="text-2xl md:text-3xl font-bold text-festival-orange mb-2">
            Today
          </div>
          <div className="text-sm md:text-base text-gray-600">참여 중</div>
        </div>
      </div>

      {/* 응원글 작성 */}
      <div className="bg-white/70 rounded-2xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">응원 메시지 남기기</h3>
        
        {/* 샘플 메시지 */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">💡 이런 메시지는 어떠세요?</p>
          <div className="flex flex-wrap gap-2">
            {sampleMessages.map((message, index) => (
              <button
                key={index}
                onClick={() => insertSampleMessage(message)}
                className="text-xs px-3 py-1 bg-festival-purple/10 text-festival-purple rounded-full hover:bg-festival-purple/20 transition-colors"
              >
                {message}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="닉네임 (선택사항)"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:border-festival-purple focus:bg-white transition-colors"
            maxLength={10}
          />
          <textarea
            placeholder="따뜻한 응원 메시지를 남겨주세요... (Ctrl+Enter로 전송)"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:border-festival-purple focus:bg-white transition-colors resize-none"
            rows={4}
            maxLength={200}
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">{newComment.length}/200</span>
            <button
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              className="flex items-center space-x-2 px-6 py-3 bg-festival-purple text-white font-semibold rounded-xl hover:bg-festival-purple/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>응원글 등록</span>
            </button>
          </div>
        </div>
      </div>

      {/* 필터링 및 정렬 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-festival-purple text-white'
                  : 'bg-white/50 text-gray-600 hover:bg-white/70'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular')}
            className="px-3 py-2 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:border-festival-purple"
          >
            <option value="latest">최신순</option>
            <option value="popular">인기순</option>
          </select>
        </div>
      </div>

      {/* 응원글 목록 */}
      <div className="space-y-4">
        {filteredComments.map((comment) => (
          <div key={comment.id} className="bg-white/70 rounded-2xl p-6 hover:bg-white/80 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-festival-purple to-festival-pink rounded-full flex items-center justify-center text-white font-semibold">
                  {comment.author[0]}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{comment.author}</div>
                  <div className="text-sm text-gray-500">{comment.timestamp}</div>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                comment.category === '응원' ? 'bg-red-100 text-red-600' :
                comment.category === '공감' ? 'bg-blue-100 text-blue-600' :
                comment.category === '기대' ? 'bg-green-100 text-green-600' :
                'bg-purple-100 text-purple-600'
              }`}>
                {comment.category}
              </span>
            </div>
            <p className="text-gray-700 mb-4 leading-relaxed">{comment.message}</p>
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleLike(comment.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                  comment.isLiked
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm font-medium">{comment.likes}</span>
              </button>
              <div className="text-xs text-gray-400">
                #{comment.id.toString().padStart(3, '0')}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredComments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">💭</div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            아직 {selectedCategory === '전체' ? '' : selectedCategory + ' '} 응원글이 없어요
          </h3>
          <p className="text-gray-500">첫 번째 응원 메시지를 남겨보세요!</p>
        </div>
      )}
    </div>
  )
}