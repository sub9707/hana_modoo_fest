import { Clock } from 'lucide-react'
import { WritingTopic, User, CooldownData, TabType } from '@/types/writing'
import { formatTime } from '@/utils/writing'
import CooldownAlert from './CooldownAlert'

interface WriteTabProps {
  currentUser: User | null
  selectedTopic: WritingTopic | null
  writingTitle: string
  writingContent: string
  isSubmitted: boolean
  cooldown: CooldownData
  setWritingTitle: (title: string) => void
  setWritingContent: (content: string) => void
  setSelectedTopic: (topic: WritingTopic | null) => void
  setCurrentTab: (tab: any) => void  // any로 설정하여 타입 충돌 회피
  onSubmit: () => void
}

export default function WriteTab({
  currentUser,
  selectedTopic,
  writingTitle,
  writingContent,
  isSubmitted,
  cooldown,
  setWritingTitle,
  setWritingContent,
  setSelectedTopic,
  setCurrentTab,
  onSubmit
}: WriteTabProps) {
  if (!currentUser) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">로그인이 필요합니다</h3>
          <p className="text-gray-500 mb-6">글을 작성하려면 먼저 로그인해주세요</p>
          <button
            onClick={() => window.location.href = '/login?redirect=/online-festival'}
            className="px-6 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-600/90 transition-colors"
          >
            로그인 하기
          </button>
        </div>
      </div>
    )
  }

  if (!selectedTopic) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center py-12">
          <div className="text-4xl mb-4">✍️</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">주제를 먼저 선택해주세요</h3>
          <p className="text-gray-500 mb-6">주제 선택 탭에서 원하는 주제를 골라보세요</p>
          <button
            onClick={() => setCurrentTab('topics')}
            className="px-6 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-600/90 transition-colors"
          >
            주제 선택하기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-6">
        {isSubmitted && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-green-800 mb-2">글이 성공적으로 제출되었습니다!</h3>
            <p className="text-green-600">소중한 이야기를 나눠주셔서 감사합니다.</p>
          </div>
        )}

        {/* 쿨타임 알림 */}
        {!cooldown.canWrite && (
          <CooldownAlert remainingSeconds={cooldown.remainingSeconds} />
        )}

        {/* 선택된 주제 표시 */}
        <div className="bg-pink-600/10 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-pink-600 mb-2">선택된 주제</h3>
          <h4 className="text-xl font-semibold text-gray-900 mb-2">{selectedTopic.title}</h4>
          <p className="text-gray-600">{selectedTopic.description}</p>
        </div>

        {/* 글쓰기 폼 */}
        <div className="bg-white/70 rounded-2xl p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                작성자: {currentUser.name}
              </label>
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
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-600 focus:bg-white transition-colors"
                maxLength={100}
              />
              <div className="text-right text-sm text-gray-500 mt-1">{writingTitle.length}/100</div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                내용 *
              </label>
              <textarea
                placeholder="가족에 대한 소중한 이야기를 들려주세요..."
                value={writingContent}
                onChange={(e) => setWritingContent(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-600 focus:bg-white transition-colors resize-none"
                rows={10}
                maxLength={1500}
              />
              <div className="text-right text-sm text-gray-500 mt-1">{writingContent.length}/1500</div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setSelectedTopic(null)}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
              >
                주제 다시 선택
              </button>
              <button
                onClick={onSubmit}
                disabled={!writingTitle.trim() || !writingContent.trim() || isSubmitted || !cooldown.canWrite}
                className="flex items-center space-x-2 px-6 py-3 bg-pink-600 text-white font-semibold rounded-xl hover:bg-pink-600/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {!cooldown.canWrite && <Clock className="w-4 h-4" />}
                <span>
                  {!cooldown.canWrite 
                    ? `${formatTime(cooldown.remainingSeconds)}`
                    : '글 제출하기'
                  }
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}