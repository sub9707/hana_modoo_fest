import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '공지/소식',
  description: '모두하나대축제 2025 관련 최신 소식과 공지사항을 확인하세요.',
}

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            공지사항 & 소식
          </h1>
          <p className="text-xl text-slate-600">
            축제 관련 최신 소식과 중요한 공지사항
          </p>
        </div>

        <div className="space-y-6">
          {[
            {
              title: '모두하나대축제 2025 자원봉사자 모집',
              category: '모집',
              date: '2025-09-05',
              isPinned: true,
              excerpt: '축제 당일 함께할 자원봉사자를 모집합니다. 다양한 활동 영역에서 시민들과 함께해요.'
            },
            {
              title: '온라인 해시태그 챌린지 이벤트 시작!',
              category: '이벤트',
              date: '2025-09-03',
              isPinned: false,
              excerpt: '#모두의서울 #함께하는축제 해시태그와 함께 일상 속 가족 이야기를 공유해주세요.'
            },
            {
              title: '축제 프로그램 타임테이블 공개',
              category: '현장안내',
              date: '2025-09-01',
              isPinned: false,
              excerpt: '무대 공연부터 체험 부스까지, 하루 종일 즐길 수 있는 다채로운 프로그램을 확인하세요.'
            },
            {
              title: '사전참가 신청 1차 마감 안내',
              category: '모집',
              date: '2025-08-30',
              isPinned: false,
              excerpt: '많은 관심과 참여 감사드립니다. 2차 신청 기간을 별도 안내드리겠습니다.'
            }
          ].map((news, index) => (
            <article key={index} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    news.category === '모집' ? 'bg-blue-100 text-blue-700' :
                    news.category === '이벤트' ? 'bg-green-100 text-green-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {news.category}
                  </span>
                  {news.isPinned && (
                    <span className="text-red-500 text-sm">📌</span>
                  )}
                </div>
                <time className="text-sm text-slate-500">{news.date}</time>
              </div>
              
              <h2 className="text-xl font-semibold mb-3 hover:text-blue-600 cursor-pointer">
                {news.title}
              </h2>
              
              <p className="text-slate-600 leading-relaxed mb-4">
                {news.excerpt}
              </p>
              
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                자세히 보기 →
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}