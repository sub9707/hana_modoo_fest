export default function DirectionsHero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          오시는 길
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          여의도공원 문화의마당에서 만나요
        </p>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 inline-block">
          <div className="text-lg font-semibold mb-2">2025년 10월 18일 (토)</div>
          <div className="text-lg mb-2">오전 11:00 - 오후 4:00</div>
          <div className="text-lg">서울특별시 영등포구 여의도공원 문화의마당</div>
        </div>
      </div>
    </section>
  )
}