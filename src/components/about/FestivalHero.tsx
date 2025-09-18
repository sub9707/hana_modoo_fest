import Image from "next/image";
import HeroTitleBadge from "./HeroTitleBadge";

export default function FestivalHero() {
  return (
    <section className="relative min-h-screen overflow-hidden">

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 m-0 sm:-mt-10">

        {/* 2025 메인 타이틀 */}
        <div className="text-center">
          <h1 className="text-[9rem] md:text-[18rem] sm:text-[20rem] font-black bg-gradient-to-r from-cyan-300 via-purple-300 to-indigo-600 bg-clip-text text-transparent leading-none">
            2025
          </h1>
        </div>

        {/* 모두하나 대축제 */}
        <div className="mb-6 -mt-2 sm:-mt-4 relative">
          <div className="bg-gradient-to-r from-cyan-300 via-purple-300 to-indigo-600 py-1 sm:py-2 px-4 sm:px-8">
            <h2 className="text-white text-6xl sm:text-9xl font-black">
              모두하나 대축제
            </h2>
          </div>
          {/* 이미지 에셋 좌 */}
          <div className="absolute -left-90 bottom-0 w-90 h-70">
            <Image src={'/images/about/about_left.webp'} fill alt="" />
          </div>
          {/* 이미지 에셋 우 */}
          <div className="absolute -right-[38%] -bottom-10 w-110 h-110">
            <Image src={'/images/about/about_right.webp'} fill alt="" />
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
          <HeroTitleBadge title="일시" descMain="2025. 10. 18(토)" descSub="11:00 - 17:00" />
          <HeroTitleBadge title="장소" descMain="여의도공원 문화의마당" descSub="무료 입장" />
          <HeroTitleBadge title="참여" descMain="누구나 환영" descSub="사전신청 권장" />
        </div>
      </div>
    </section>
  )
}