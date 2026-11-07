export default function NewsListSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* 사이드바 스켈레톤 */}
        <div className="lg:col-span-1 hidden sm:block">
          <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-10 bg-gray-100 rounded" />
              ))}
            </div>
          </div>
        </div>

        {/* 뉴스 리스트 스켈레톤 */}
        <div className="lg:col-span-3 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-blue-100 rounded-full w-20" />
                <div className="h-6 bg-gray-100 rounded-full w-24" />
              </div>
              <div className="h-8 bg-gray-200 rounded mb-3 w-3/4" />
              <div className="h-4 bg-gray-100 rounded mb-2 w-full" />
              <div className="h-4 bg-gray-100 rounded w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}