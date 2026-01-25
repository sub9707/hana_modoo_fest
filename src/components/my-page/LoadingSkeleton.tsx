export function LoadingSkeleton() {
  return (
    <div className="p-6 space-y-8 animate-pulse">
      {/* 프로필 섹션 스켈레톤 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 기본 정보 스켈레톤 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="flex space-x-2">
                  <div className="h-5 bg-gray-200 rounded w-16"></div>
                  <div className="h-5 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>

          {/* 연락처 정보 스켈레톤 */}
          <div className="space-y-3">
            <div className="h-5 bg-gray-200 rounded w-24"></div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-12"></div>
                <div className="h-4 bg-gray-200 rounded w-40"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 개인 정보 섹션 스켈레톤 */}
      <section>
        <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <div className="h-5 bg-gray-200 rounded w-20"></div>
            {[1, 2].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-28"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 계정 활동 섹션 스켈레톤 */}
      <section>
        <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 빠른 액션 섹션 스켈레톤 */}
      <section className="border-t border-gray-200 pt-6">
        <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="h-10 bg-gray-200 rounded w-32"></div>
          <div className="h-10 bg-gray-200 rounded w-36"></div>
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </section>
    </div>
  )
}