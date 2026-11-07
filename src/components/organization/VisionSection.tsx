import OverviewCard from "../common/OverviewCard"
import CoreValuesSection from "./CoreValueSection"

export default function VisionSection() {
  return (
    <section className="py-20 mb-20 overflow-x-hidden">
      <div className="mx-auto px-4 container ">
        {/* 섹션 헤더 */}
        <div className="text-center mb-32 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-16">
            한부모가족지원센터의 <span className="header-orange">비전·목표</span>
          </h2>
          <div className="w-full max-w-6xl flex flex-col md:flex-row justify-center items-stretch gap-6">
            <div className="flex-1">
              <OverviewCard 
                title="비전" 
                engTitle="Vision" 
                description={`한부모가족지원의 돌봄, 성장, 미래를 \n 함께하는 서울`} 
                color="#ea580c" 
              />
            </div>
            <div className="flex-1">
              <OverviewCard 
                title="사명" 
                engTitle="Mission" 
                description={`함께 만드는 가족지원 \n 함께 나누는 가족지원 \n 함께 누리는 가족지원`} 
                color="#ea580c" 
                needKeyword
              />
            </div>
            <div className="flex-1">
              <OverviewCard 
                title="가치" 
                engTitle="Value" 
                description={`한부모 가족의 돌봄 \n 한부모 가족사업의 성장 \n 한부모 가족과 소통 \n 한부모 가족지원의 혁신`} 
                color="#ea580c" 
                needKeyword
              />
            </div>
          </div>
        </div>

        {/* 핵심 가치 영역 */}
        <CoreValuesSection/>
      </div>
    </section>
  )
}