import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '행사 프로그램',
  description: '모두하나대축제 2025의 다양한 프로그램을 확인하세요.',
}

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            행사 프로그램
          </h1>
          <p className="text-xl text-slate-600">
            하루 종일 즐길 수 있는 다채로운 프로그램
          </p>
        </div>

        {/* 프로그램 카테고리 탭 */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {['전체', '공식행사', '무대공연', '체험부스', '자조모임', '연대부스'].map((category) => (
            <button
              key={category}
              className="px-6 py-3 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
            >
              {category}
            </button>
          ))}
        </div>

        {/* 프로그램 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: '개막식',
              time: '11:00-11:30',
              location: '메인 무대',
              category: '공식행사',
              description: '모두하나대축제의 시작을 알리는 개막식'
            },
            {
              title: '가족 콘서트',
              time: '12:00-13:00',
              location: '메인 무대',
              category: '무대공연',
              description: '온 가족이 함께 즐기는 음악 공연'
            },
            {
              title: '체험 부스',
              time: '11:00-16:00',
              location: '체험 구역',
              category: '체험부스',
              description: '다양한 만들기 체험과 게임'
            },
            {
              title: '자조모임 만남의 장',
              time: '13:00-15:00',
              location: 'A구역',
              category: '자조모임',
              description: '한부모가족 자조모임 네트워킹'
            },
            {
              title: '시민 연대 부스',
              time: '11:00-16:00',
              location: 'B구역',
              category: '연대부스',
              description: '협력기관 및 시민단체 부스'
            },
            {
              title: '폐막식',
              time: '15:30-16:00',
              location: '메인 무대',
              category: '공식행사',
              description: '하루의 마무리와 감사 인사'
            }
          ].map((program, index) => (
            <div key={index} className="bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                  {program.category}
                </span>
                <span className="text-sm text-slate-500">{program.time}</span>
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
              <p className="text-slate-600 mb-4">{program.description}</p>
              
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>📍 {program.location}</span>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  자세히 보기
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}