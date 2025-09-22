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
    <div className="flex justify-center mb-8">
      <div className="bg-white/70 rounded-2xl p-2 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`px-4 py-3 rounded-xl font-semibold transition-colors text-sm ${
              currentTab === tab.id
                ? 'bg-pink-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:text-pink-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}