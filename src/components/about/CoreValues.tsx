import Image from "next/image";
import CoreValuesCarousel from "./CoreValuesCarousel";
import SectionHeader from "./SectionHeader";

export default function CoreValues() {
  return (
    <section className="py-16 container mx-auto px-4 flex flex-col items-center">
      <div className="relative w-full h-full text-center">
        <SectionHeader title="축제의 핵심 가치" mb={3} />
        <div className="text-xl text-gray-600">
          모두하나대축제가 추구하는 네 가지 핵심 가치입니다.
        </div>
        <div className="w-50 h-50 absolute left-90 -top-20">
          <Image src={'/images/about/corevalue_left.webp'} alt="핵심 가치 좌측 캐릭터" fill />
        </div>
      </div>
      <CoreValuesCarousel />
    </section>
  )
}