import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '함께하는 기관',
  description: '모두하나대축제를 함께 만들어가는 소중한 파트너들을 소개합니다',
}

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            함께하는 기관
          </h1>
          <p className="text-xl text-slate-600">
            모두하나대축제를 함께 만들어가는 소중한 파트너들
          </p>
        </div>

        <div className="space-y-12">
          {/* 주최/주관 */}
          <section>
            <h2 className="text-2xl font-bold text-center mb-8">주최 / 주관</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-8 bg-blue-50 rounded-xl">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">서울</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">서울특별시</h3>
                <p className="text-slate-600">주최</p>
              </div>
              <div className="text-center p-8 bg-green-50 rounded-xl">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-lg font-bold">센터</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">서울특별시한부모가족지원센터</h3>
                <p className="text-slate-600">주관</p>
              </div>
            </div>
          </section>

          {/* 후원기관 */}
          <section>
            <h2 className="text-2xl font-bold text-center mb-8">후원기관</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['여성가족부', '한국건강가정진흥원', '서울시교육청', '영등포구청'].map((org) => (
                <div key={org} className="text-center p-6 bg-slate-50 rounded-lg">
                  <div className="w-16 h-16 bg-slate-200 rounded-lg mx-auto mb-3"></div>
                  <p className="font-medium">{org}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 협력기관 */}
          <section>
            <h2 className="text-2xl font-bold text-center mb-8">협력기관</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-gray-200 rounded mx-auto mb-2"></div>
                  <p className="text-sm font-medium">협력기관 {i + 1}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-16 text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-12">
          <h2 className="text-2xl font-bold mb-4">함께 축제를 만들어가요</h2>
          <p className="text-lg text-slate-600 mb-8">
            모두하나대축제에 참여하고 싶은 기관이나 단체가 있으시다면 언제든 연락해주세요
          </p>
          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            협력 문의하기
          </button>
        </div>
      </div>
    </div>
  )
}