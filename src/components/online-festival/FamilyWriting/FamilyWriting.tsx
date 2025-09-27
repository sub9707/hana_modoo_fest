'use client'

import { useState } from 'react'
import { WritingTopic, TabType } from '@/types/writing'

// 훅 임포트
import { useUser } from '@/hooks/useUser'
import { useWritingTopics } from '@/hooks/writing/useWritingTopics'
import { useCooldown } from '@/hooks/writing/useCooldown'
import { useWritingForm } from '@/hooks/writing/useWritingForm'
import { useWritingData } from '@/hooks/writing/useWritingData'
import { useInfiniteScroll } from '@/hooks/writing/useInfiniteScroll'

// 컴포넌트 임포트
import TabNavigation from './TabNavigation'
import TopicsTab from './TopicsTab'
import WriteTab from './WriteTab'
import BrowseTab from './BrowseTab'
import FeaturedTab from './FeaturedTab'
import MyWritingsTab from './MyWritingTab'
import { Gift } from 'lucide-react'

export default function FamilyWriting() {
  const [currentTab, setCurrentTab] = useState<TabType>('topics')

  // 커스텀 훅들
  const { currentUser } = useUser()
  const { writingTopics } = useWritingTopics()
  const { cooldown, setCooldown, checkUserCooldown } = useCooldown(currentUser)

  const {
    selectedTopic,
    setSelectedTopic,
    writingTitle,
    setWritingTitle,
    writingContent,
    setWritingContent,
    isSubmitted,
    handleSubmit
  } = useWritingForm()

  const {
    browseWritings,
    featuredWritings,
    myWritings,
    browseSort,
    browseTopic,
    featuredTopic,
    browseHasMore,
    myHasMore,
    totalWritings,
    loading,
    setBrowseSort,
    setBrowseTopic,
    setFeaturedTopic,
    loadBrowseWritings,
    loadMyWritings,
    handleLike
  } = useWritingData(currentUser, currentTab)

  // 무한 스크롤 훅
  useInfiniteScroll({
    currentTab,
    currentUser,
    browseHasMore,
    myHasMore,
    loading,
    loadBrowseWritings,
    loadMyWritings
  })

  // 이벤트 핸들러
  const handleTopicSelect = async (topic: WritingTopic) => {
    if (!currentUser) {
      alert('로그인이 필요합니다.')
      return
    }
    setSelectedTopic(topic)
    setCurrentTab('write')
    await checkUserCooldown()
  }

  const onSubmit = () => {
    handleSubmit(currentUser, setCooldown, setCurrentTab)
  }

  return (
    <div className="p-1 py-4 sm:p-8 md:p-12">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-600/10 rounded-full mb-6">
          <span className="text-2xl">📝</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          가족 이야기 글짓기
        </h2>
        <p className="text-md sm:text-lg text-gray-600">
          가족에 대한 소중한 이야기를 글로 표현해보세요
        </p>
        <div className="inline-flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full border border-amber-200 mt-4">
          <Gift className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-700">
            응원 댓글을 남기신 분들 가운데 추첨을 통해 100분께 선물을 드립니다
          </span>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <TabNavigation
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
      />

      {/* 탭 컨텐츠 */}
      {currentTab === 'topics' && (
        <TopicsTab
          writingTopics={writingTopics}
          onTopicSelect={handleTopicSelect}
        />
      )}

      {currentTab === 'write' && (
        <WriteTab
          currentUser={currentUser}
          selectedTopic={selectedTopic}
          writingTitle={writingTitle}
          writingContent={writingContent}
          isSubmitted={isSubmitted}
          cooldown={cooldown}
          setWritingTitle={setWritingTitle}
          setWritingContent={setWritingContent}
          setSelectedTopic={setSelectedTopic}
          setCurrentTab={setCurrentTab}
          onSubmit={onSubmit}
        />
      )}

      {currentTab === 'browse' && (
        <BrowseTab
          browseWritings={browseWritings}
          writingTopics={writingTopics}
          browseSort={browseSort}
          browseTopic={browseTopic}
          totalWritings={totalWritings}
          loading={loading}
          browseHasMore={browseHasMore}
          currentUser={currentUser}
          setBrowseSort={setBrowseSort}
          setBrowseTopic={setBrowseTopic}
          onLike={handleLike}
        />
      )}

      {currentTab === 'featured' && (
        <FeaturedTab
          featuredWritings={featuredWritings}
          writingTopics={writingTopics}
          featuredTopic={featuredTopic}
          currentUser={currentUser}
          setFeaturedTopic={setFeaturedTopic}
          onLike={handleLike}
        />
      )}

      {currentTab === 'my' && (
        <MyWritingsTab
          myWritings={myWritings}
          currentUser={currentUser}
          loading={loading}
          myHasMore={myHasMore}
          setCurrentTab={setCurrentTab}
        />
      )}
    </div>
  )
}