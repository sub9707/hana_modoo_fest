import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '축제 소개',
  description: '모두하나대축제 2025의 목적과 의의, 핵심 가치를 소개합니다.',
}

export default function FestivalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            축제 소개
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            가족다양성을 존중하고 시민이 함께 즐기는 연대의 장
          </p>
        </div>
        
        <div className="space-y-12">
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-blue-600">축제 목적과 의의</h2>
            <p className="text-lg leading-relaxed text-slate-700 mb-4">
              모두하나대축제는 가족다양성 인식 확산과 시민 연대 문화 조성을 위한 서울시 대표 가족축제입니다.
            </p>
            <p className="text-lg leading-relaxed text-slate-700">
              온라인 캠페인과 오프라인 현장을 연결하여, 한부모가족을 비롯한 다양한 가족이 
              서로의 일상을 이해하고 지지하는 경험을 만듭니다.
            </p>
          </section>
          
          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-green-600">핵심 가치</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">한부모 인식개선</h3>
                <p className="text-slate-600">한부모가족에 대한 편견을 없애고 이해를 높입니다</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">가족다양성 확산</h3>
                <p className="text-slate-600">모든 형태의 가족을 존중하는 문화를 만듭니다</p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-purple-600">행사 개요</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">일시</h3>
                <p className="text-slate-600">2025년 10월 18일(토) 11:00-16:00</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">장소</h3>
                <p className="text-slate-600">여의도공원 문화의마당</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">주최/주관</h3>
                <p className="text-slate-600">서울특별시 / 서울특별시한부모가족지원센터</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">참가비</h3>
                <p className="text-slate-600">무료</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}