import SectionHeader from "./SectionHeader"

export default function FestivalOverview() {

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <SectionHeader title="축제 개요" mb={12}/>
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-center items-stretch gap-6">

              {/* 카드 좌 */}
              <div className="relative group flex-1">
                <div className="bg-white shadow-lg py-12 px-8 md:px-20 rounded-bl-[3rem] rounded-tr-[3rem] hover:shadow-xl transition-all duration-300 relative z-10 h-full">
                  <h3 className="text-xl md:text-4xl font-bold text-orange-400 mb-2">목적</h3>
                  <h4 className="text-lg md:text-xl mb-8 text-gray-600 font-normal">Purpose</h4>
                  <p className="text-base md:text-lg text-orange-400 font-medium">
                    가족다양성 인식 확산과 시민 연대 문화 조성
                  </p>
                </div>

                {/* 오렌지 빛 레이어 */}
                <div className="absolute inset-0 rounded-bl-[3rem] rounded-tr-[3rem] bg-orange-400/40 blur-xl opacity-50 scale-95 transition-all duration-500 group-hover:opacity-80 group-hover:scale-105 group-hover:blur-2xl"></div>
              </div>

              {/* 카드 우 */}
              <div className="relative group flex-1">
                <div className="bg-white shadow-lg py-12 px-8 md:px-20 rounded-bl-[3rem] rounded-tr-[3rem] hover:shadow-xl transition-all duration-300 relative z-10 h-full">
                  <h3 className="text-xl md:text-4xl font-bold text-pink-400 mb-2">의의</h3>
                  <h4 className="text-lg md:text-xl mb-8 text-gray-600 font-normal">Significance</h4>
                  <p className="text-base md:text-lg text-pink-400 font-medium">
                    한부모가족을 비롯한 다양한 가족이 서로의 일상을 이해하고 지지하는 경험을 만듭니다.
                  </p>
                </div>

                {/* 핑크 빛 레이어 */}
                <div className="absolute inset-0 rounded-bl-[3rem] rounded-tr-[3rem] bg-pink-400/40 blur-xl opacity-50 scale-95 transition-all duration-500 group-hover:opacity-80 group-hover:scale-105 group-hover:blur-2xl"></div>
              </div>

            </div>
          </div>


        </div>
      </div>
    </section>
  )
}