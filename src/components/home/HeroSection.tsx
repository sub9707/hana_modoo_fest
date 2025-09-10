export default function HeroSection() {

  return (
   <section className="w-full h-screen flex items-center">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mb-20">
          {/* 메인 타이틀 */}
          <h1 className="text-6xl lg:text-8xl text-center lg:text-left font-black text-gray-900 leading-tight mb-4">
            모두의 서울
            <br />
            <span className="bg-gradient-to-r from-purple-300 via-blue-300 to-green-300 bg-clip-text text-transparent">
              모두 다 함께
            </span>
          </h1>

          {/* 서브 타이틀 */}
          <p className="text-lg lg:text-4xl text-center lg:text-left text-gray-700 font-black mb-2">
            서울시 대표 가족축제가 찾아갑니다.
          </p>
          <p className="text-base lg:text-xl text-center lg:text-left text-gray-600 mb-12">
            가족다양성을 존중하고 시민이 함께 즐기는 연대의 장
          </p>

          {/* 행사 정보 카드 */}
          <div className="w-full bg-gradient-to-r from-purple-200 via-blue-200 to-green-200 rounded-2xl p-6 mb-8 border-4 border-white shadow-lg">
            <div className="flex text-center">
              <div className="flex-1 pr-4">
                <h3 className="font-bold text-gray-900 mb-2">행사 일정</h3>
                <p className="text-gray-800 font-semibold">2025. 10. 18(토)</p>
                <p className="text-gray-700">11:00 - 16:00</p>
              </div>
              <div className="flex-1 pl-4 border-l border-white/50">
                <h3 className="font-bold text-gray-900 mb-2">개최 장소</h3>
                <p className="text-gray-800 font-semibold">여의도공원</p>
                <p className="text-gray-700">문화의마당</p>
              </div>
            </div>
          </div>

          {/* 참여 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-purple-300 hover:bg-purple-400 text-gray-900 font-semibold py-3 px-6 rounded-full transition-colors">
              사전참가 신청하기
            </button>
            <button className="bg-blue-300 hover:bg-blue-400 text-gray-900 font-semibold py-3 px-6 rounded-full transition-colors">
              행사정보 신청하기
            </button>
          </div>
        </div>

        {/* 우측 빈 영역 (캐러셀 공간) */}
        <div className="flex items-center justify-center">
          {/* 나중에 캐러셀이 들어갈 공간 */}
        </div>
      </div>
    </section>
  )
}
