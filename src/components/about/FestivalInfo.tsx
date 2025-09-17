import SectionHeader from "./SectionHeader";

interface InfoCardProps {
  label: string;
  title: string;
  subtitle?: string;
}

function InfoCard({ label, title, subtitle }: InfoCardProps) {
  return (
    <div className="flex items-center gap-4 relative">
      <div className="w-16 h-24 flex items-center justify-center">
        <span className="text-orange-500 font-semibold text-xl">{label}</span>
      </div>
      <div className="relative border border-orange-200 rounded-3xl h-24 flex-1 flex items-center justify-center bg-white">
        <div className="absolute -inset-2 bg-gradient-to-r from-orange-300 to-pink-300 rounded-3xl blur-lg opacity-30 -z-10"></div>
        <div className="text-center">
          <div className="text-xl font-medium text-black mb-1">{title}</div>
          {subtitle && <div className="text-red-500 text-md">{subtitle}</div>}
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
    <section className="py-16 container mx-auto px-4 flex flex-col items-center">
      <SectionHeader title="축제 정보" mb={3} />
      <p className="text-xl text-gray-600 mb-12">
        모두하나대축제 2025의 상세 정보를 확인하세요.
      </p>

      <div className="w-full max-w-3xl space-y-4 mr-20">
        {infoData.map((item, idx) => (
          <InfoCard key={idx} {...item} />
        ))}
      </div>
    </section>
  );
}
