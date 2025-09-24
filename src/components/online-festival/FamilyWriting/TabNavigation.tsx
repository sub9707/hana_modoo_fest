import { TabType, User } from '@/types/writing'

interface TabNavigationProps {
  currentTab: TabType
  setCurrentTab: (tab: TabType) => void
  currentUser: User | null
}

export default function TabNavigation({ currentTab, setCurrentTab, currentUser }: TabNavigationProps) {
  const tabs = [
    { id: 'topics' as TabType, label: '주제 선택' },
    { id: 'write' as TabType, label: '글쓰기' },
    { id: 'browse' as TabType, label: '작품 둘러보기' },
    { id: 'featured' as TabType, label: '우수 작품' },
  ]

  if (currentUser) {
    tabs.push({ id: 'my' as TabType, label: '내 글' })
  }

  return (
    <div className="mb-6 sm:mb-8">
      {/* 모바일: 2x2 그리드 */}
      <div className="sm:hidden px-4">
        <div className="bg-white/70 rounded-2xl p-3">
          <div className="grid grid-cols-2 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`w-full px-3 py-3 rounded-xl font-semibold transition-all text-sm ${
                  currentTab === tab.id
                    ? 'bg-pink-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:text-pink-600 hover:bg-gray-200 active:bg-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 데스크톱: 기존 레이아웃 */}
      <div className="hidden sm:flex justify-center">
        <div className="bg-white/70 rounded-2xl p-2 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all text-sm sm:text-base ${
                currentTab === tab.id
                  ? 'bg-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:text-pink-600 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}