const tabs = [
  { id: 'schedule', label: '행사 일정' },
  { id: 'events', label: '전체행사안내' },
  { id: 'map', label: '행사장 안내도' }
]

interface TabNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <nav className="flex space-x-4 md:space-x-8" aria-label="프로그램 탭">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`py-3 md:py-4 px-4 md:px-6 border-b-2 font-medium text-sm md:text-base transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-orange-400 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </section>
  )
}