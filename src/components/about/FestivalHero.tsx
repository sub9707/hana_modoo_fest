import HeroTitleBadge from "./HeroTitleBadge";

export default function FestivalHero() {
  return (
    <section className="relative min-h-screen overflow-hidden">

      {/* 캐릭터 위치 - 이미지로 대체될 예정 */}
      <div className="absolute top-32 left-8 w-20 h-20 bg-green-200 rounded-lg opacity-50 flex items-center justify-center text-xs">
        캐릭터1
      </div>
      <div className="absolute top-20 left-32 w-16 h-16 bg-gray-200 rounded-lg opacity-50 flex items-center justify-center text-xs">
        캐릭터2
      </div>
      <div className="absolute top-28 left-52 w-18 h-18 bg-blue-200 rounded-lg opacity-50 flex items-center justify-center text-xs">
        캐릭터3
      </div>
      <div className="absolute top-20 right-8 w-24 h-32 bg-pink-200 rounded-lg opacity-50 flex items-center justify-center text-xs">
        메인캐릭터
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 m-0 sm:-mt-10">

        {/* 2025 메인 타이틀 */}
        <div className="text-center">
          <h1 className="text-[9rem] md:text-[18rem] sm:text-[20rem] font-black bg-gradient-to-r from-cyan-300 via-purple-300 to-indigo-600 bg-clip-text text-transparent leading-none">
            2025
          </h1>
        </div>

        {/* 모두하나 대축제 */}
        <div className="mb-6 -mt-2 sm:-mt-4">
          <div className="bg-gradient-to-r from-cyan-300 via-purple-300 to-indigo-600 py-1 sm:py-2 px-4 sm:px-8">
            <h2 className="text-white text-6xl sm:text-9xl font-black">
              모두하나 대축제
            </h2>
          </div>
        </div>

        {/* Seoul Family Diversity Festival */}
        <p className="text-gray-700 text-xl md:text-2xl font-medium mb-4">
          Seoul Family Diversity Festival
        </p>

        {/* 슬로건 */}
        <p className="text-gray-800 text-2xl md:text-5xl font-bold mb-10">
          모두의 서울, 모두 다함께
        </p>

        {/* 정보 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-6xl">

          {/* 일시 */}
          <HeroTitleBadge title="일시" descMain="2025. 10. 18(토)" descSub="11:00 - 17:00"/>
          <HeroTitleBadge title="장소" descMain="여의도공원 문화의마당" descSub="무료 입장"/>
          <HeroTitleBadge title="참여" descMain="누구나 환영" descSub="사전신청 권장"/>
        </div>
      </div>
    </section>
  )
}