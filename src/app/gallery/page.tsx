import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '갤러리',
  description: '모두하나대축제의 소중한 순간들을 사진으로 만나보세요',
}

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            갤러리
          </h1>
          <p className="text-xl text-slate-600">
            모두하나대축제의 소중한 순간들
          </p>
        </div>

        {/* 연도별 필터 */}
        <div className="flex justify-center space-x-4 mb-12">
          {['전체', '2024', '2023', '2022'].map((year) => (
            <button
              key={year}
              className="px-6 py-2 rounded-full bg-white border hover:bg-blue-50 hover:border-blue-200 transition-colors"
            >
              {year}
            </button>
          ))}
        </div>

        {/* 갤러리 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
            >
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-4xl">📸</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            더 많은 사진 보기
          </button>
        </div>
      </div>
    </div>
  )
}