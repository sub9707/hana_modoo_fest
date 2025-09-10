export default function Introduction() {

    return (
        <section className="w-full h-full">
            <div className="w-full h-full flex flex-col items-center justify-center gap-6 sm:gap-8 text-center px-4">
                <button className="text-sm sm:text-base">축제소개</button>
                <h2 className="text-5xl sm:text-5xl lg:text-6xl text-white font-extrabold leading-tight">
                    축제 한눈에 보기
                </h2>
                <p className="text-white text-md sm:text-lg leading-relaxed max-w-2xl">
                    모두하나대축제는 가족 다양성 인식 확산과 <br/> 시민연대 문화 조성을 위한 서울시 대표가족 축제입니다.
                </p>
            </div>
        </section>
    )
}