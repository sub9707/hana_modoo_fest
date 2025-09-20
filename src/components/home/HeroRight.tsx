import Image from "next/image";
import Carousel from "../common/Carousel";
import VideoPlayer from "../common/VideoPlayer";

export default function HeroRight() {
  return (
    <div className="relative hidden sm:hidden md:flex items-center justify-center flex-1">
        <div className="max-w-2xl h-100 mb-30">
          <VideoPlayer src="/videos/main/sample_video.mp4"/>
        </div>
        <div className="w-130 h-70 absolute bottom-20 -right-40 z-10">
          <Image src={'/images/main/main_hero.webp'} fill alt="main_hero_characters" /> 
        </div>
    </div>
  )
}
