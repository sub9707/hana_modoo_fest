interface NewsHeroProps {
  totalNews: number
  todayNews?: number
  totalViews?: number
  latestNews?: string | null
}

export default function NewsHero({ 
  totalNews, 
  todayNews = 0,
  totalViews = 0,
  latestNews,
}: NewsHeroProps) {
  return (
    <div className="orange-gradient text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 ">
          공지 · 소식
        </h1>
        <p className="text-xl text-blue-100">
          모두하나대축제 2025의 최신 소식과 중요한 공지사항을 확인하세요
        </p>
      </div>
    </div>
  )
}