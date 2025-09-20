import { CoreValue } from "@/types/festival";

interface CoreValueCardProps {
    coreValue: CoreValue;
    index: number;
}

export default function CoreValueCard({ coreValue, index }: CoreValueCardProps) {
  return (
    <div 
      className="relative group cursor-pointer transition-all duration-300 hover:-translate-y-1 h-full"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* 그라데이션 테두리 래퍼 */}
      <div className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 group-hover:bg-gray-200/50 transition-all duration-300 rounded-2xl p-0.5 h-full">
        {/* 메인 카드 */}
        <div className="
          bg-white
          rounded-2xl p-8 md:p-10 h-full
          shadow-sm hover:shadow-xl
          transition-all duration-300
          relative overflow-hidden
          flex flex-col
        ">
          {/* 호버 시 나타나는 그라데이션 배경 */}
          <div className="
            absolute inset-0 bg-gradient-to-r from-cyan-300 via-purple-300 to-indigo-600
            opacity-0 group-hover:opacity-5
            transition-opacity duration-300
          "></div>

          {/* 상단 그라데이션 라인 */}
          <div className="
            absolute top-0 left-0 right-0 h-1 
            bg-gradient-to-r from-cyan-300 via-purple-300 to-indigo-600
            transform scale-x-0 group-hover:scale-x-100
            transition-transform duration-500 ease-out
            origin-left
          "></div>

          {/* 콘텐츠 */}
          <div className="relative z-10 flex flex-col h-full text-center">
            <h3 className=" text-2xl md:text-3xl font-bold mb-3 text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
              {coreValue.title}
            </h3>
            <h4 className="text-lg md:text-xl mb-6 text-gray-500 font-normal tracking-wide">
              {coreValue.subtitle}
            </h4>
            <p className="text-base md:text-lg leading-relaxed text-gray-600 group-hover:text-gray-700 transition-colors duration-300 flex-1 whitespace-pre-line">
              {coreValue.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}