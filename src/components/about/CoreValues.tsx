import CoreValuesCarousel from "./CoreValuesCarousel";
import SectionHeader from "./SectionHeader";

export default function CoreValues() {
  return (
    <section className="py-16 container mx-auto px-4 flex flex-col items-center">
      <SectionHeader title="축제의 핵심 가치" mb={3}/>
      <p className="text-xl text-gray-600">
        모두하나대축제가 추구하는 네 가지 핵심 가치입니다.
      </p>
      <CoreValuesCarousel />
    </section>
  )
}