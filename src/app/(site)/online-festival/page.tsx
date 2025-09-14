import { Metadata } from 'next'
import OnlineFestivalTabs from '@/components/online-festival/OnlineFestivalTabs'

export const metadata: Metadata = {
  title: '온라인 축제 | 모두하나대축제 2025',
  description: '모두하나대축제 2025 온라인 축제에 참여하세요. 퀴즈, 응원 댓글, 가족 글짓기, 랜덤 이벤트 등 다양한 온라인 활동으로 축제의 즐거움을 함께 나눠요.',
  openGraph: {
    title: '온라인 축제 | 모두하나대축제 2025',
    description: '모두하나대축제 2025 온라인 축제에 참여하세요. 퀴즈, 응원 댓글, 가족 글짓기, 랜덤 이벤트 등 다양한 온라인 활동으로 축제의 즐거움을 함께 나눠요.',
    url: 'https://moduhana2025.seoul.kr/online-festival',
  },
}

export default function OnlineFestivalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* 페이지 헤더 */}
      <section className="relative pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-festival-blue/10 via-festival-purple/10 to-festival-pink/10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full mb-6">
              <span className="text-festival-blue font-semibold">🎉 온라인 축제</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-festival-blue via-festival-purple to-festival-pink bg-clip-text text-transparent mb-6">
              함께 만드는 온라인 축제
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
              집에서도, 어디서든 모두하나대축제에 참여하세요.<br />
              다양한 온라인 이벤트로 축제의 즐거움을 함께 나눠요!
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-festival-blue font-semibold">📅 9월 - 10월</span>
              </div>
              <div className="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-festival-green font-semibold">🎯 5개 이벤트</span>
              </div>
              <div className="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-festival-purple font-semibold">🏆 풍성한 상품</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 플로팅 장식 요소들 */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-festival-blue/20 rounded-full float-animation"></div>
        <div className="absolute top-40 right-16 w-16 h-16 bg-festival-purple/20 rounded-full float-animation animation-delay-1500"></div>
        <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-festival-pink/20 rounded-full float-animation animation-delay-2500"></div>
        <div className="absolute bottom-20 right-1/3 w-14 h-14 bg-festival-green/20 rounded-full float-animation animation-delay-3000"></div>
      </section>

      {/* 메인 콘텐츠 - 탭 섹션 */}
      <section className="relative pb-20">
        <div className="container mx-auto px-4">
          <OnlineFestivalTabs />
        </div>
      </section>
    </div>
  )
}