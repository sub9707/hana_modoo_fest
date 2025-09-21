import EventsOverview from './EventsOverview'

interface TabContentProps {
  activeTab: string
}

export default function TabContent({ activeTab }: TabContentProps) {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm border border-gray-200 min-h-[500px] p-6 md:p-8">
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">행사 일정</h2>
              <div className="text-gray-600">
                <p>행사 일정 컨텐츠가 여기에 들어갑니다.</p>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <EventsOverview />
          )}

          {activeTab === 'map' && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">행사장 안내도</h2>
              <div className="text-gray-600">
                <p>행사장 안내도 컨텐츠가 여기에 들어갑니다.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}