import Image from "next/image";
import SectionHeader from "./SectionHeader";

interface InfoCardProps {
  label: string;
  title: string;
  subtitle?: string;
}

function InfoCard({ label, title, subtitle }: InfoCardProps) {
  return (
    <div className="flex flex-row items-center gap-4 sm:gap-6 w-full px-1 sm:px-0">
      <div className="w-12 sm:w-16 h-20 sm:h-24 flex items-center justify-center mb-2 sm:mb-0 flex-shrink-0">
        <span className="text-orange-500 text-center font-semibold text-lg sm:text-xl">{label}</span>
      </div>
      <div className="relative border border-orange-200 rounded-3xl h-20 sm:h-24 flex-1 flex items-center justify-center bg-white px-4 min-w-0">
        {/* 모바일에서 px-1 추가하여 블러 효과 여백 확보 */}
        <div className="absolute -inset-2 sm:-inset-3 bg-gradient-to-r from-orange-300 to-pink-300 rounded-3xl blur-lg opacity-30 -z-10"></div>
        <div className="text-center">
          <div className="text-md sm:text-xl font-medium text-black mb-1 break-words">{title}</div>
          {subtitle && <div className="text-sm sm:text-md text-red-500 break-words">{subtitle}</div>}
        </div>
      </div>
    </div>
  );
}

export default function FestivalInfo() {
  const infoData: InfoCardProps[] = [
    {
      label: "일시",
      title: "2025년 10월 18일 (토)",
      subtitle: "11:00 ~ 17:00",
    },
    {
      label: "장소",
      title: "여의도공원 문화의마당",
      subtitle: "서울 영등포구 여의공원로 120",
    },
    {
      label: "주최",
      title: "서울특별시",
    },
    {
      label: "주관",
      title: "서울특별시한부모가족지원센터",
    },
    {
      label: "참가비",
      title: "무료",
      subtitle: "누구나 자유롭게 참여 가능",
    },
  ];

  return (
    <section className="py-10 sm:py-16 container mx-auto px-4 flex flex-col items-center overflow-hidden">
      <SectionHeader title="축제 정보" mb={2} />
      <p className="text-base sm:text-xl text-gray-600 mb-8 sm:mb-12 text-center">
        모두하나대축제 2025의 상세 정보를 확인하세요.
      </p>

      <div className="relative w-full max-w-3xl px-2 sm:px-0">
        <div className="space-y-4 pr-0 sm:pr-20">
          {/* 모바일에서 px-2 추가하여 블러 효과가 잘리지 않도록 여백 확보 */}
          {infoData.map((item, idx) => (
            <InfoCard key={idx} {...item} />
          ))}
        </div>
        <div className="absolute -right-8 sm:-right-60 bottom-0 sm:bottom-0 w-32 h-32 sm:w-100 sm:h-100 pointer-events-none">
          {/* 모바일에서 -right-8로 더 우측으로 이동, overflow-hidden으로 스크롤 방지 */}
          <Image src={'/images/about/moo_reading.webp'} fill alt="moo_reading" className="object-contain" />
        </div>
      </div>
    </section>
  );
}