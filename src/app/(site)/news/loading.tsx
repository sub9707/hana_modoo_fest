export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 히어로 스켈레톤 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-white/20 rounded-lg w-64 mx-auto mb-4"></div>
            <div className="h-6 bg-white/20 rounded-lg w-96 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/10 rounded-lg p-4">
                  <div className="h-8 bg-white/20 rounded mb-2"></div>
                  <div className="h-4 bg-white/20 rounded w-20 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* 콘텐츠 스켈레톤 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* 사이드바 스켈레톤 */}
          <div className="lg:col-span-1 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-12 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* 메인 콘텐츠 스켈레톤 */}
          <div className="lg:col-span-3 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6">
                <div className="animate-pulse">
                  <div className="flex justify-between mb-4">
                    <div className="flex space-x-2">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="h-4 bg-gray-200 rounded w-12"></div>
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}