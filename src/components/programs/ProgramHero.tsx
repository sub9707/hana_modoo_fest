import HeroAnimation from '../common/HeroAnimation'

export default function ProgramHero() {
  return (
    <section className="relative orange-gradient text-white py-12 xl:py-12">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeroAnimation>
          <h1 className="text-4xl mb-6 md:text-4xl lg:text-6xl xl:text-5xl font-bold leading-tight">
            행사 프로그램 안내
          </h1>
          <p className="text-md sm:text-lg md:text-xl lg:text-xl opacity-90 max-w-3xl mx-auto break-keep">
            모두하나대축제 2025의 다양한 프로그램을 확인하세요
          </p>
        </HeroAnimation>
      </div>
    </section>
  )
}