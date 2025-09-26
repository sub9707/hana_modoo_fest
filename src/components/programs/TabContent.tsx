import Image from 'next/image'
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
            <div className="space-y-6 flex-col flex items-center justify-start">
              <div className="w-full text-2xl md:text-3xl text-start font-bold text-gray-900 mb-6">행사 일정</div>
              <div className="w-full max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-5xl min-h-150 sm:min-h-250 relative">
                <Image
                  src={'/images/programs/event_paper.webp'}
                  alt="이벤트 홍보 이미지"
                  fill
                  className="object-contain"
                />
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