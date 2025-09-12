interface GalleryHeroProps {
  totalPhotos: number
}

export default function GalleryHero({ totalPhotos }: GalleryHeroProps) {
  return (
    <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          갤러리
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          모두하나대축제의 소중한 순간들
        </p>
        <div className="flex justify-center items-center space-x-8 text-lg">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
            <div className="font-bold text-2xl">{totalPhotos.toLocaleString()}</div>
            <div className="opacity-90">전체 사진</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
            <div className="font-bold text-2xl">4</div>
            <div className="opacity-90">행사 연도</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
            <div className="font-bold text-2xl">6</div>
            <div className="opacity-90">카테고리</div>
          </div>
        </div>
      </div>
    </section>
  )
}