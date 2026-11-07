'use client'

import { WritingTopic } from '@/types/writing'
import Notice from '@/components/ui/Notice'
import { PenTool, Clock } from 'lucide-react'

interface TopicsTabProps {
  writingTopics: WritingTopic[]
  onTopicSelect: (topic: WritingTopic) => void
}

export default function TopicsTab({ writingTopics, onTopicSelect }: TopicsTabProps) {
  // 이벤트 종료 상태
  const EVENT_ENDED = true

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 이벤트 종료 안내 */}
      {EVENT_ENDED && (
        <Notice title="글짓기 이벤트 종료">
            <p>모두하나대축제 2025 가족 이야기 글짓기 이벤트가 종료되었습니다.</p>
            <p>새로운 글 작성은 불가능하지만, 작성된 글들은 '둘러보기' 탭에서 계속 확인하실 수 있습니다.</p>
          </Notice>
      )}

      {/* 주제 안내 */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {EVENT_ENDED ? '이벤트 주제 목록' : '글짓기 주제를 선택하세요'}
        </h3>
        <p className="text-gray-600">
          {EVENT_ENDED 
            ? '아래는 진행되었던 글짓기 주제 목록입니다.'
            : '원하시는 주제를 선택하여 가족에 대한 이야기를 작성해보세요.'
          }
        </p>
      </div>

      {/* 주제 목록 */}
      <div className="space-y-6">
        {writingTopics.map((topic) => (
          <div
            key={topic.id}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-900 mb-2">{topic.title}</h4>
                <p className="text-gray-600 mb-3">{topic.description}</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  EVENT_ENDED 
                    ? 'bg-gray-100 text-gray-600'
                    : topic.is_active 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-500'
                }`}>
                  {EVENT_ENDED ? '이벤트 종료' : topic.is_active ? '접수 중' : '마감'}
                </span>
              </div>
              <button
                onClick={() => !EVENT_ENDED && onTopicSelect(topic)}
                disabled={EVENT_ENDED || !topic.is_active}
                className="flex items-center justify-center space-x-2 w-full md:w-auto px-4 md:px-6 py-3 bg-pink-600 text-white font-semibold rounded-xl hover:bg-pink-600/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm md:text-base"
              >
                {EVENT_ENDED ? (
                  <>
                    <Clock className="w-4 h-4" />
                    <span>종료됨</span>
                  </>
                ) : (
                  <>
                    <PenTool className="w-4 h-4" />
                    <span>이 주제로 글쓰기</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}