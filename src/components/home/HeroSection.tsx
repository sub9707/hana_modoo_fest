import HeroLeft from "./HeroLeft";
import HeroRight from "./HeroRight";

export default function HeroSection() {

  return (
    <section className="w-full h-screen flex items-center">
      <div className="container flex mx-auto px-4 lg:px-8 gap-20">
        {/* 좌측 영역  */}
        <HeroLeft/>

        {/* 우측 영역  */}
        <HeroRight/>
      </div>
    </section>
  )
}
