import ProgramCard from "../home/ProgramCard"

const mainServices = [
  {
    title: '상담 및 정보제공',
    features: ['생활상담', '법률상담', '심리상담', '자녀양육상담', '정보제공 서비스'],
  },
  {
    title: '교육 및 문화',
    features: ['자립역량강화교육', '자녀교육프로그램', '문화체험활동', '가족캠프'],
  },
  {
    title: '경제적 지원',
    features: ['긴급지원사업', '후원사업', '장학금지원', '생활용품지원'],
  },
  {
    title: '네트워킹',
    features: ['자조모임운영', '멘토링사업', '지역사회연계', '취업연계서비스'],
  }
];

export default function BusinessSection() {
  return (
    <section className="w-full py-20 bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4">
        {/* 섹션 타이틀 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              주요 사업
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            한부모가족의 자립과 사회통합을 위한 다양한 서비스를 제공합니다
          </p>
        </div>

        <div className="w-full max-w-6xl mx-auto">
          {/* 모바일: 가로 스크롤 */}
          <div
            className="flex gap-4 overflow-x-auto sm:hidden py-8 px-4 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {mainServices.map((data, idx) => (
              <div key={idx} className="flex-shrink-0 w-72">
                <ProgramCard {...data} />
              </div>
            ))}
          </div>

          {/* 데스크탑: grid */}
          <div
            className="hidden sm:flex gap-6 py-8 px-6 justify-center"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {mainServices.map((data, idx) => (
              <div key={idx} className="flex-shrink-0 min-w-[280px]">
                <ProgramCard
                  title={data.title}
                  features={data.features ?? []}
                  gradient={"from-purple-400 via-blue-400 to-cyan-400"}
                />
              </div>
            ))}
          </div>

          {/* 모바일 스와이프 힌트 */}
          <div className="sm:hidden flex flex-col items-center justify-center mt-0 sm:mt-6 gap-4">
            {/* 텍스트를 위로 */}
            <span className="text-gray-500 text-sm whitespace-nowrap">좌우로 스와이프</span>

            <div className="swipe-hint-container">
              {/* 더 큰 화살표들 - 간격 더 벌림 */}
              <div className="swipe-arrows">
                <svg width="100" height="50" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-left">
                  <path d="M18 15L8 25L18 35M8 25H30" stroke="#9CA3AF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <svg width="100" height="50" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-right">
                  <path d="M82 35L92 25L82 15M92 25H70" stroke="#9CA3AF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* 애니메이션되는 손가락 아이콘 */}
              <div className="swipe-finger">
                <img src="/images/icons/ui/touch.svg" alt="터치" width="35" height="35" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
