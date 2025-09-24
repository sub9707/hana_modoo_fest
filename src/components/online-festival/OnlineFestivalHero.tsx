import HeroAnimation from "../common/HeroAnimation"

interface NewsHeroProps {
  totalNews: number
  todayNews?: number
  totalViews?: number
  latestNews?: string | null
}

export default function OnelineFestivalHero() {
  return (
    <section className="relative orange-gradient text-white py-12 xl:py-12">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeroAnimation>
          <h1 className="text-3xl sm:text-4xl mb-6 md:text-4xl lg:text-6xl xl:text-5xl font-bold leading-tight">
            함께 만드는 온라인 축제
          </h1>
          <p className="text-sm sm:text-xl text-blue-100">
            집에서도, 어디서든 모두하나대축제에 참여하세요.<br />
              다양한 온라인 이벤트로 축제의 즐거움을 함께 나눠요!
          </p>
        </HeroAnimation>
      </div>
    </section>
  )
}