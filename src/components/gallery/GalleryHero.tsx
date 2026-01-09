import PageHero from '../common/PageHero'

interface GalleryHeroProps {
  totalPhotos: number
}

export default function GalleryHero({ totalPhotos }: GalleryHeroProps) {
  return (
    <PageHero
      title="갤러리"
      subtitle="모두하나대축제의 소중한 순간들"
      variant="purple"
      size="large"
    >
      <div className="flex justify-center items-center space-x-8 text-lg mt-8">
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
    </PageHero>
  )
}