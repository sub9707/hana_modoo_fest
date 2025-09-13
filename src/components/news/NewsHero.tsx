interface NewsHeroProps {
  totalNews: number
  latestNews: string
}

export default function NewsHero({ totalNews, latestNews }: NewsHeroProps) {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          공지 · 소식
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          모두하나대축제의 최신 소식을 확인하세요
        </p>
        <div className="flex justify-center items-center space-x-8 text-lg">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
            <div className="font-bold text-2xl">{totalNews}</div>
            <div className="opacity-90">전체 소식</div>
          </div>
        </div>
      </div>
    </section>
  )
}