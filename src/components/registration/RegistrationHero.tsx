export default function RegistrationHero() {
  return (
    <section className="bg-gradient-to-r from-orange-400 to-festival-pink text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          사전참가 신청
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          모두하나대축제 2025에 함께해주세요
        </p>
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl mb-2">📅</div>
            <div className="font-bold">2025. 10. 18 (토)</div>
            <div className="opacity-90">11:00 - 17:00</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl mb-2">📍</div>
            <div className="font-bold">여의도공원</div>
            <div className="opacity-90">문화의마당</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl mb-2">🎟️</div>
            <div className="font-bold">참가비 무료</div>
            <div className="opacity-90">사전신청 권장</div>
          </div>
        </div>
      </div>
    </section>
  )
}