import HeroAnimation from "../common/HeroAnimation"

export default function NewsHero() {
  return (
    <section className="relative orange-gradient text-white py-12 xl:py-12">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeroAnimation>
          <h1 className="text-4xl mb-6 md:text-4xl lg:text-6xl xl:text-5xl font-bold leading-tight">
            공지 · 소식
          </h1>
          <p className="text-xl text-blue-100">
            모두하나대축제 2025의 최신 소식과 중요한 공지사항을 확인하세요
          </p>
        </HeroAnimation>
      </div>
    </section>
  )
}