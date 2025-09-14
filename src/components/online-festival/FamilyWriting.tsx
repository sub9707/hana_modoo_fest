'use client'

import { useState, useEffect } from 'react'
import { PenTool, Eye, Heart, Award, Calendar, User } from 'lucide-react'

interface WritingEntry {
  id: number
  author: string
  title: string
  content: string
  topic: string
  timestamp: string
  likes: number
  views: number
  isLiked?: boolean
  isSelected?: boolean
}

interface WritingTopic {
  id: number
  title: string
  description: string
  deadline: string
  examples: string[]
  isActive: boolean
  participants: number
}

// 정적 글짓기 주제 데이터
const writingTopics: WritingTopic[] = [
  {
    id: 1,
    title: "우리 가족만의 특별한 전통",
    description: "매년 반복되는 우리 가족만의 특별한 전통이나 기념일에 대해 써주세요.",
    deadline: "2024-10-15",
    examples: ["명절 때의 특별한 음식", "생일마다 하는 특별한 일", "가족만의 기념일"],
    isActive: true,
    participants: 127
  },
  {
    id: 2,
    title: "가족에게서 배운 소중한 가치",
    description: "가족구성원으로부터 배운 인생의 소중한 가치나 교훈을 나눠주세요.",
    deadline: "2024-10-20",
    examples: ["부모님께서 가르쳐주신 삶의 지혜", "형제자매와의 경험", "조부모님의 말씀"],
    isActive: true,
    participants: 89
  },
  {
    id: 3,
    title: "혼자여도 충분히 아름다운 우리 가족",
    description: "한부모가족, 1인가족 등 다양한 가족 형태의 아름다움을 표현해주세요.",
    deadline: "2024-10-25",
    examples: ["엄마와 나", "나 홀로 가족", "할머니와 손자"],
    isActive: true,
    participants: 156
  },
  {
    id: 4,
    title: "가족과 함께한 가장 행복했던 순간",
    description: "가족과 함께 보낸 시간 중 가장 기억에 남고 행복했던 순간을 써주세요.",
    deadline: "2024-10-30",
    examples: ["가족 여행의 추억", "함께 본 영화", "어려울 때 함께했던 순간"],
    isActive: true,
    participants: 203
  }
]

// 정적 글짓기 작품 데이터
const writingEntries: WritingEntry[] = [
  {
    id: 1,
    author: "김○○",
    title: "매주 일요일, 우리만의 팬케이크 시간",
    content: "매주 일요일 아침이면 엄마와 저는 함께 팬케이크를 만듭니다. 처음에는 엄마가 만드시는 걸 구경만 했는데, 이제는 제가 반죽을 저어요. 가끔 실수로 밀가루를 흘리기도 하지만, 엄마는 늘 웃으며 함께 치워주세요. 팬케이크 위에 올리는 블루베리 하나하나에도 우리의 사랑이 담겨있는 것 같아요. 이런 작은 전통이 우리 가족을 더욱 특별하게 만드는 것 같습니다.",
    topic: "우리 가족만의 특별한 전통",
    timestamp: "2024-09-12 15:30",
    likes: 34,
    views: 127,
    isLiked: false,
    isSelected: true
  },
  {
    id: 2,
    author: "이○○",
    title: "할머니께서 가르쳐주신 '기다림'의 의미",
    content: "할머니는 늘 말씀하셨어요. '급한 일도 차근차근 하면 더 좋은 결과가 나온다'고요. 어릴 때는 이해할 수 없었지만, 지금은 할머니의 말씀이 얼마나 소중한 가르침이었는지 알겠어요. 김장철마다 배추를 정성스럽게 절이시는 할머니의 모습에서, 인생의 모든 과정에는 기다림이 필요하다는 걸 배웠습니다.",
    topic: "가족에게서 배운 소중한 가치",
    timestamp: "2024-09-12 14:15",
    likes: 52,
    views: 189,
    isLiked: false,
    isSelected: false
  },
  {
    id: 3,
    author: "박○○",
    title: "엄마와 나, 둘이서도 충분한 가족",
    content: "친구들은 가끔 '아빠가 없어서 외롭지 않냐'고 물어봐요. 하지만 전 전혀 그렇게 느끼지 않아요. 엄마는 저에게 엄마이기도 하고, 친구이기도 하고, 때로는 든든한 아빠 역할도 해주세요. 둘이서 보는 영화도 재밌고, 둘이서 먹는 저녁도 맛있어요. 우리는 비록 둘뿐이지만 사랑이 넘치는 완전한 가족이에요.",
    topic: "혼자여도 충분히 아름다운 우리 가족",
    timestamp: "2024-09-12 13:45",
    likes: 78,
    views: 245,
    isLiked: false,
    isSelected: true
  }
]

export default function FamilyWriting() {
  const [selectedTopic, setSelectedTopic] = useState<WritingTopic | null>(null)
  const [writingTitle, setWritingTitle] = useState('')
  const [writingContent, setWritingContent] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [entries, setEntries] = useState<WritingEntry[]>(writingEntries)
  const [currentTab, setCurrentTab] = useState<'topics' | 'write' | 'gallery'>('topics')
  const [filterTopic, setFilterTopic] = useState('전체')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleTopicSelect = (topic: WritingTopic) => {
    setSelectedTopic(topic)
    setCurrentTab('write')
  }

  const handleSubmit = () => {
    if (!selectedTopic || !writingTitle.trim() || !writingContent.trim()) return

    const newEntry: WritingEntry = {
      id: entries.length + 1,
      author: authorName.trim() || '익명',
      title: writingTitle.trim(),
      content: writingContent.trim(),
      topic: selectedTopic.title,
      timestamp: new Date().toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\. /g, '-').replace('.', ''),
      likes: 0,
      views: 0,
      isLiked: false,
      isSelected: false
    }

    setEntries(prev => [newEntry, ...prev])
    setIsSubmitted(true)
    
    // 초기화
    setTimeout(() => {
      setWritingTitle('')
      setWritingContent('')
      setAuthorName('')
      setSelectedTopic(null)
      setCurrentTab('gallery')
      setIsSubmitted(false)
    }, 2000)
  }

  const handleLike = (entryId: number) => {
    setEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === entryId
          ? {
              ...entry,
              likes: entry.isLiked ? entry.likes - 1 : entry.likes + 1,
              isLiked: !entry.isLiked
            }
          : entry
      )
    )
  }

  const filteredEntries = filterTopic === '전체' 
    ? entries 
    : entries.filter(entry => entry.topic === filterTopic)

  const topicOptions = ['전체', ...writingTopics.map(topic => topic.title)]

  return (
    <div className="p-8 md:p-12">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-festival-pink/10 rounded-full mb-6">
          <span className="text-2xl">📝</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          가족 이야기 글짓기
        </h2>
        <p className="text-lg text-gray-600">
          가족에 대한 소중한 이야기를 글로 표현해보세요
        </p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/70 rounded-2xl p-2 flex space-x-2">
          <button
            onClick={() => setCurrentTab('topics')}
            className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
              currentTab === 'topics'
                ? 'bg-festival-pink text-white'
                : 'text-gray-600 hover:text-festival-pink'
            }`}
          >
            주제 선택
          </button>
          <button
            onClick={() => setCurrentTab('write')}
            className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
              currentTab === 'write'
                ? 'bg-festival-pink text-white'
                : 'text-gray-600 hover:text-festival-pink'
            }`}
          >
            글쓰기
          </button>
          <button
            onClick={() => setCurrentTab('gallery')}
            className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
              currentTab === 'gallery'
                ? 'bg-festival-pink text-white'
                : 'text-gray-600 hover:text-festival-pink'
            }`}
          >
            작품 갤러리
          </button>
        </div>
      </div>

      {/* 주제 선택 탭 */}
      {currentTab === 'topics' && (
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6">
            {writingTopics.map((topic) => (
              <div key={topic.id} className="bg-white/70 rounded-2xl p-6 hover:bg-white/80 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{topic.title}</h3>
                    <p className="text-gray-600 mb-4">{topic.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="bg-festival-pink/10 text-festival-pink px-3 py-1 rounded-full text-sm font-medium mb-2">
                      {topic.participants}명 참여
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      ~{topic.deadline}
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">💡 이런 내용으로 써보세요:</h4>
                  <div className="flex flex-wrap gap-2">
                    {topic.examples.map((example, index) => (
                      <span key={index} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                        {example}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      topic.isActive 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {topic.isActive ? '접수 중' : '마감'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleTopicSelect(topic)}
                    disabled={!topic.isActive}
                    className="flex items-center space-x-2 px-6 py-3 bg-festival-pink text-white font-semibold rounded-xl hover:bg-festival-pink/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <PenTool className="w-4 h-4" />
                    <span>이 주제로 글쓰기</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 글쓰기 탭 */}
      {currentTab === 'write' && (
        <div className="max-w-3xl mx-auto">
          {!selectedTopic ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">✍️</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">주제를 먼저 선택해주세요</h3>
              <p className="text-gray-500 mb-6">주제 선택 탭에서 원하는 주제를 골라보세요</p>
              <button
                onClick={() => setCurrentTab('topics')}
                className="px-6 py-3 bg-festival-pink text-white rounded-xl hover:bg-festival-pink/90 transition-colors"
              >
                주제 선택하기
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {isSubmitted && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                  <div className="text-4xl mb-4">🎉</div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">글이 성공적으로 제출되었습니다!</h3>
                  <p className="text-green-600">소중한 이야기를 나눠주셔서 감사합니다.</p>
                </div>
              )}

              {/* 선택된 주제 표시 */}
              <div className="bg-festival-pink/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-festival-pink mb-2">선택된 주제</h3>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{selectedTopic.title}</h4>
                <p className="text-gray-600">{selectedTopic.description}</p>
              </div>

              {/* 글쓰기 폼 */}
              <div className="bg-white/70 rounded-2xl p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      닉네임 (선택사항)
                    </label>
                    <input
                      type="text"
                      placeholder="닉네임을 입력하세요"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:border-festival-pink focus:bg-white transition-colors"
                      maxLength={10}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      제목 *
                    </label>
                    <input
                      type="text"
                      placeholder="글의 제목을 입력하세요"
                      value={writingTitle}
                      onChange={(e) => setWritingTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:border-festival-pink focus:bg-white transition-colors"
                      maxLength={50}
                    />
                    <div className="text-right text-sm text-gray-500 mt-1">{writingTitle.length}/50</div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      내용 *
                    </label>
                    <textarea
                      placeholder="가족에 대한 소중한 이야기를 들려주세요..."
                      value={writingContent}
                      onChange={(e) => setWritingContent(e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:border-festival-pink focus:bg-white transition-colors resize-none"
                      rows={10}
                      maxLength={1000}
                    />
                    <div className="text-right text-sm text-gray-500 mt-1">{writingContent.length}/1000</div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setSelectedTopic(null)}
                      className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
                    >
                      주제 다시 선택
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!writingTitle.trim() || !writingContent.trim() || isSubmitted}
                      className="px-6 py-3 bg-festival-pink text-white font-semibold rounded-xl hover:bg-festival-pink/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      글 제출하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 작품 갤러리 탭 */}
      {currentTab === 'gallery' && (
        <div className="max-w-4xl mx-auto">
          {/* 필터링 */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {topicOptions.map((topic) => (
              <button
                key={topic}
                onClick={() => setFilterTopic(topic)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterTopic === topic
                    ? 'bg-festival-pink text-white'
                    : 'bg-white/50 text-gray-600 hover:bg-white/70'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-white/50 rounded-2xl">
              <div className="text-2xl md:text-3xl font-bold text-festival-pink mb-2">
                {entries.length}
              </div>
              <div className="text-sm md:text-base text-gray-600">총 작품수</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-2xl">
              <div className="text-2xl md:text-3xl font-bold text-festival-orange mb-2">
                {entries.filter(entry => entry.isSelected).length}
              </div>
              <div className="text-sm md:text-base text-gray-600">우수작품</div>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-2xl">
              <div className="text-2xl md:text-3xl font-bold text-festival-green mb-2">
                {entries.reduce((sum, entry) => sum + entry.views, 0)}
              </div>
              <div className="text-sm md:text-base text-gray-600">총 조회수</div>
            </div>
          </div>

          {/* 작품 목록 */}
          <div className="space-y-6">
            {filteredEntries.map((entry) => (
              <div key={entry.id} className={`bg-white/70 rounded-2xl p-6 hover:bg-white/80 transition-colors ${
                entry.isSelected ? 'ring-2 ring-festival-pink/30' : ''
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-festival-pink to-festival-purple rounded-full flex items-center justify-center text-white font-bold">
                      {entry.author[0]}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">{entry.author}</span>
                        {entry.isSelected && (
                          <Award className="w-4 h-4 text-festival-pink" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{entry.timestamp}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">{entry.topic}</div>
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {entry.views}
                      </span>
                      <span className="flex items-center">
                        <Heart className={`w-4 h-4 mr-1 ${entry.isLiked ? 'text-red-500 fill-current' : ''}`} />
                        {entry.likes}
                      </span>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">{entry.title}</h3>
                <p className="text-gray-700 leading-relaxed mb-4">{entry.content}</p>
                
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleLike(entry.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                      entry.isLiked
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${entry.isLiked ? 'fill-current' : ''}`} />
                    <span className="text-sm font-medium">{entry.likes}</span>
                  </button>
                  
                  {entry.isSelected && (
                    <div className="bg-festival-pink/10 text-festival-pink px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <Award className="w-4 h-4 mr-1" />
                      우수작품
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredEntries.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {filterTopic === '전체' ? '아직 작품이 없어요' : `${filterTopic} 주제의 작품이 없어요`}
              </h3>
              <p className="text-gray-500">첫 번째 작가가 되어보세요!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}