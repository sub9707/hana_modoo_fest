"use client";

function FestivalJoinGuide() {
    const specialBenefits = [
        "사전신청 시 축제 기념품 및 프로그램 우선 예약",
        "온라인 캠페인 참여자 대상 현장 이벤트 추가 혜택",
        "자조모임 및 단체 참여 시 전용 공간 및 지원 프로그램 제공",
        "자원봉사자 대상 활동 인증서 및 감사 이벤트",
    ];

    return (
        <section className="py-16 bg-gradient-to-r from-pink-300 to-[rgba(255,162,150,1)] relative overflow-x-hidden">
            <div className="container mx-auto px-4 flex flex-col items-center min-h-screen">
                {/* 타이틀 */}
                <h2 className="text-white text-4xl lg:text-8xl font-black italic text-shadow-lg mb-6 text-center">
                    누구나 참여할 수 있는 축제
                </h2>
                <p className="text-white text-md lg:text-2xl text-center text-shadow-lg mb-14">
                    모두하나대축제는 서울시민 누구나, 어떤 형태의 가족이든 환영합니다. <br />
                    여러분의 참여가 더 따뜻하고 포용적인 서울을 만듭니다.
                </p>

                {/* 그래프 영역 */}
                <div className="w-full h-100 border-2 border-white text-white text-4xl flex items-center justify-center mb-16 py-6">
                    그래프 영역
                </div>

                {/* 참여 방법 영역 */}
                <div className="text-white text-center py-6 w-full relative my-25">
                    <h3 className="text-7xl font-bold mb-15 text-shadow-md">참여 방법</h3>
                    <div className="space-y-8">
                        {/* 1. 사진찍기 신청 - 좌측 선분과 점 */}
                        <div className="relative flex items-center justify-center">
                            <div className="inline-block text-left relative">
                                {/* 선분 */}
                                <div className="absolute right-[105%] top-[35%] transform -translate-y-1/2 flex items-center">
                                    <div className="w-screen h-0.5 bg-white"></div>
                                    <div className="w-4 h-4 bg-white rounded-full -ml-1.5"></div>
                                </div>
                                <h4 className="text-6xl font-bold mb-2 text-shadow-lg">1. 사진찍기 신청</h4>
                                <p className="text-lg text-center font-bold text-amber-100 text-shadow-md opacity-80">온라인으로 간편하게</p>
                            </div>
                        </div>

                        {/* 2. 온라인 캠페인 참여 - 좌측 선분과 점 */}
                        <div className="relative flex items-center justify-center">
                            <div className="inline-block text-left relative">
                                {/* 선분 */}
                                <div className="absolute right-[105%] top-[35%] transform -translate-y-1/2 flex items-center">
                                    <div className="w-screen h-0.5 bg-white"></div>
                                    <div className="w-4 h-4 bg-white rounded-full -ml-1.5"></div>
                                </div>
                                <h4 className="text-6xl font-bold mb-2 text-shadow-lg">2. 온라인 캠페인 참여</h4>
                                <p className="text-lg text-center font-bold text-amber-100 text-shadow-md opacity-80">9-10월 사전축제</p>
                            </div>
                        </div>

                        {/* 3. 현장 축제 참여*/}
                        <div className="relative flex items-center justify-center">
                            <div className="inline-block text-center relative">
                                {/* 선분 */}
                                <div className="absolute left-[105%] top-[35%] transform -translate-y-1/2 flex items-center">
                                    <div className="w-4 h-4 bg-white rounded-full -mr-1.5"></div>
                                    <div className="w-screen h-0.5 bg-white"></div>
                                </div>
                                <h4 className="text-6xl font-bold mb-2 text-shadow-lg">3. 현장 축제 참여</h4>
                                <p className="text-lg text-center font-bold text-amber-100 text-shadow-md opacity-80">10월 18일 여의도공원 2025모두하나대축제</p>
                            </div>
                        </div>

                        {/* 4. 연대와 소통 - 우측 점과 선분 */}
                        <div className="relative flex items-center justify-center">
                            <div className="inline-block text-right relative">
                                {/* 선분 */}
                                <div className="absolute left-[105%] top-[35%] transform -translate-y-1/2 flex items-center">
                                    <div className="w-4 h-4 bg-white rounded-full -mr-1.5"></div>
                                    <div className="w-screen h-0.5 bg-white"></div>
                                </div>
                                <h4 className="text-6xl font-bold mb-2 text-shadow-lg">4. 연대와 소통</h4>
                                <p className="text-lg text-center font-bold text-amber-100 text-shadow-md opacity-80">지속적인 네트워킹</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 특별 혜택 영역 */}
                <div className="w-full max-w-3xl text-white">
                    <h3 className="text-3xl lg:text-5xl font-bold text-center mb-8 text-amber-100 text-shadow-md">※ 특별 참여 혜택 ※</h3>
                    <ul className="flex flex-col">
                        {specialBenefits.map((item, idx) => (
                            <li key={idx} className="flex items-center justify-center gap-2 text-lg lg:text-2xl">
                                <span className="text-white font-bold text-4xl mb-1.5">◆</span>
                                <span className="font-medium">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}

export default FestivalJoinGuide;