import Image from "next/image";
import Link from "next/link";

export default function Introduction() {
    return (
        <section className="w-full h-full bg-[#885ef9] relative">
            <div className="w-full h-full flex flex-col items-center justify-center gap-6 sm:gap-8 text-center px-4 pt-10 pb-10 sm:pb-20 relative z-10">
                <Link
                    href={"/about"}
                    className="text-sm sm:text-xl font-bold bg-white px-10 py-2 rounded-lg"
                >
                    축제소개
                </Link>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white font-extrabold leading-tight relative z-20 text-shadow-md">
                    축제 한눈에 보기
                </h2>
                <p className="text-white text-sm sm:text-xl leading-relaxed max-w-2xl relative z-20">
                    모두하나대축제는 가족 다양성 인식 확산과 <br /> 시민연대 문화 조성을
                    위한 서울시 대표가족 축제입니다.
                </p>
            </div>

            {/* 이미지: z-index 낮게 지정해서 뒤로 */}
            <div className="absolute bottom-1/3 sm:bottom-0 right-0 sm:right-1/6 w-40 h-30 sm:w-90 sm:h-60 z-0">
                <Image
                    src={"/images/main/main_2.webp"}
                    alt="festival_character_2"
                    fill
                    className="object-contain"
                />
            </div>
        </section>
    );
}
