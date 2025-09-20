import OverviewCard from "../common/OverviewCard"
import CoreValuesSection from "./CoreValueSection"


export default function VisionSection() {

  return (
    <section className="py-20 mb-20">
      <div className="mx-auto px-4 container ">
        {/* 섹션 헤더 */}
        <div className="text-center mb-32 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-15">
            한부모가족지원센터의 <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">비전</span>
          </h2>
          <div className="max-w-7xl flex flex-col md:flex-row justify-center items-stretch gap-6">
            <OverviewCard title="비전" engTitle="Vision" description="함께 만들고, 함께 나누고, 함께 누리는 한부모가족지원" color="#fcba03" />
            <OverviewCard title="사명" engTitle="Mission" description="한부모가족의 자립과 사회통합을 통한 삶의 질 향상" color="#960546" />
          </div>
        </div>

        {/* 핵심 가치 영역 */}
        <CoreValuesSection/>
      </div>
    </section>
  )
}