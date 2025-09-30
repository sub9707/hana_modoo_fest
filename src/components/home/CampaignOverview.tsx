import HeroCTAButton from "./HeroCTAButton"

export default function CampaignOverview() {
  const stats = [
    {
      number: "2,000",
      label: "예상 참가자",
      unit: "시민"
    },
    {
      number: "27",
      label: "참여 프로그램",
      unit: "개"
    },
    {
      number: "34",
      label: "협력 기관",
      unit: "곳"
    }
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        {/* 메인 제목 */}
        <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 break-keep">
          모두가 함께하는 축제에 참여하세요
        </h2>
        
        {/* 서브 제목 */}
        <h2 className="text-xl lg:text-4xl bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent font-bold mb-12 break-keep">
          온라인 캠페인부터 현장 축제까지, 다양한 방법으로 참여할 수 있습니다.
        </h2>

        {/* 참여 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
          <HeroCTAButton href="/registration" text="사전참가 신청하기" />
          <HeroCTAButton href="/online-festival" text="캠페인 참여하기" />
        </div>

        {/* 통계 섹션 */}
        <div className="flex justify-around items-center">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-2">
                {stat.number}
                <span className="text-sky-500">+</span>
              </div>
              <div className="text-lg lg:text-xl font-bold text-gray-800 mb-1">
                {stat.label}
              </div>
              <div className="text-gray-600">
                {stat.unit}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}