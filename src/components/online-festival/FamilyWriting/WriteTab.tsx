'use client'

import { WritingTopic } from '@/types/writing'
import { Clock, PenTool, AlertCircle } from 'lucide-react'

interface CooldownState {
  canWrite: boolean
  remainingSeconds: number
  nextWriteTime?: Date | null  // 선택적 속성으로 변경
}

interface WriteTabProps {
  currentUser: any
  selectedTopic: WritingTopic | null
  writingTitle: string
  writingContent: string
  isSubmitted: boolean
  cooldown: CooldownState
  setWritingTitle: (title: string) => void
  setWritingContent: (content: string) => void
  setSelectedTopic: (topic: WritingTopic | null) => void
  setCurrentTab: (tab: any) => void
  onSubmit: () => void
}

// 시간 포맷팅 함수
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function CooldownAlert({ remainingSeconds }: { remainingSeconds: number }) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
      <div className="flex items-start space-x-3">
        <Clock className="w-6 h-6 text-yellow-600 mt-0.5" />
        <div>
          <h3 className="text-lg font-bold text-yellow-800 mb-2">작성 대기 시간</h3>
          <p className="text-yellow-700">
            다음 글을 작성하려면 <strong>{formatTime(remainingSeconds)}</strong> 후에 시도해주세요.
          </p>
          <p className="text-sm text-yellow-600 mt-1">
            스팸 방지를 위해 일정 시간 후에 다시 작성할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  )
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
  onSubmit,
}: WriteTabProps) {

  // 이벤트 종료 상태
  const EVENT_ENDED = true

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔒</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">로그인이 필요합니다</h3>
        <p className="text-gray-600">글을 작성하려면 먼저 로그인해주세요.</p>
      </div>
    )
  }

  if (!selectedTopic) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">주제를 선택해주세요</h3>
        <p className="text-gray-600 mb-6">글을 쓰기 전에 먼저 주제를 선택해야 합니다.</p>
        <div className="flex justify-center">
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
        {/* 이벤트 종료 안내 */}
        {EVENT_ENDED && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-orange-400 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-orange-900 mb-2 text-lg">글짓기 이벤트 종료</h3>
                <p className="text-orange-800 text-sm mb-2">
                  모두하나대축제 2025 가족 이야기 글짓기 이벤트가 종료되었습니다.
                </p>
                <p className="text-orange-700 text-sm">
                  지금까지 작성해주신 소중한 글들은 '둘러보기' 탭에서 계속 확인하실 수 있으며, 공감하기 기능은 계속 이용 가능합니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {isSubmitted && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-green-800 mb-2">글이 성공적으로 제출되었습니다!</h3>
            <p className="text-green-600">소중한 이야기를 나눠주셔서 감사합니다.</p>
          </div>
        )}

        {/* 쿨타임 알림 */}
        {!EVENT_ENDED && !cooldown.canWrite && (
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
                제목
              </label>
              <input
                type="text"
                placeholder={EVENT_ENDED ? "이벤트가 종료되어 글 작성이 불가능합니다." : "글의 제목을 입력하세요"}
                value={writingTitle}
                onChange={(e) => setWritingTitle(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-600 focus:bg-white transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                maxLength={100}
                disabled={EVENT_ENDED}
              />
              <div className="text-right text-sm text-gray-500 mt-1">{writingTitle.length}/100</div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                내용
              </label>
              <textarea
                placeholder={EVENT_ENDED ? "이벤트가 종료되어 글 작성이 불가능합니다." : "가족에 대한 소중한 이야기를 들려주세요..."}
                value={writingContent}
                onChange={(e) => setWritingContent(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-600 focus:bg-white transition-colors resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                rows={10}
                maxLength={1500}
                disabled={EVENT_ENDED}
              />
              <div className="text-right text-sm text-gray-500 mt-1">{writingContent.length}/1500</div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setSelectedTopic(null)}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
                disabled={EVENT_ENDED}
              >
                주제 다시 선택
              </button>
              <button
                onClick={onSubmit}
                disabled={EVENT_ENDED || !writingTitle.trim() || !writingContent.trim() || isSubmitted || !cooldown.canWrite}
                className="flex items-center space-x-2 px-6 py-3 bg-pink-600 text-white font-semibold rounded-xl hover:bg-pink-600/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {EVENT_ENDED 
                  ? <><AlertCircle className="w-4 h-4" /><span>이벤트 종료</span></>
                  : !cooldown.canWrite 
                    ? <><Clock className="w-4 h-4" /><span>{formatTime(cooldown.remainingSeconds)}</span></>
                    : <><PenTool className="w-4 h-4" /><span>글 제출하기</span></>
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}