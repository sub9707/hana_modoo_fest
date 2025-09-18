import Image from "next/image";
import Carousel from "../common/Carousel";

export default function HeroRight() {
  return (
    <div className="relative hidden sm:hidden md:flex items-start justify-center flex-1">
        <Carousel />
        <div className="w-130 h-130 absolute -bottom-15 -right-30 z-10">
          <Image src={'/images/main/main_hero.webp'} fill alt="main_hero_characters" /> 
        </div>
    </div>
  )
}
