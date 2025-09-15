import React from 'react'
import ProgramCard from '@/components/home/ProgramCard'
import cardData from "@/data/ProgramCardData.json"

function ProgramCardSection() {
    return (
        <section className='w-full h-auto pt-20 pb-32 sm:py-20 min-[2560px]:py-12 px-4 sm:h-screen min-[2560px]:h-[75vh] flex flex-col items-center justify-center'>
            {/* 가로 스크롤 컨테이너 */}
            <div className="w-full max-w-6xl">
                <div
                    className="flex gap-4 sm:gap-16 sm:justify-center overflow-x-auto sm:overflow-x-visible py-16 px-4 sm:py-8 sm:px-4 scrollbar-hide"
                    style={{
                        scrollbarWidth: 'none', /* Firefox */
                        msOverflowStyle: 'none', /* IE and Edge */
                    }}
                >
                    {
                        cardData.map((data, idx) =>
                            <div key={idx} className="flex-shrink-0 w-72 sm:w-auto">
                                <ProgramCard {...data} />
                            </div>
                        )
                    }
                </div>
            </div>

            {/* 모바일 스와이프 힌트 */}
            <div className="sm:hidden flex flex-col items-center justify-center mt-0 sm:mt-6 gap-4">
                {/* 텍스트를 위로 */}
                <span className="text-gray-500 text-sm whitespace-nowrap">좌우로 스와이프</span>

                <div className="swipe-hint-container">
                    {/* 더 큰 화살표들 - 간격 더 벌림 */}
                    <div className="swipe-arrows">
                        <svg width="100" height="50" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-left">
                            <path d="M18 15L8 25L18 35M8 25H30" stroke="#9CA3AF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <svg width="100" height="50" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-right">
                            <path d="M82 35L92 25L82 15M92 25H70" stroke="#9CA3AF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    {/* 애니메이션되는 손가락 아이콘 */}
                    <div className="swipe-finger">
                        <img src="/images/icons/ui/touch.svg" alt="터치" width="35" height="35" />
                    </div>
                </div>
            </div>
        </section >
    )
}

export default ProgramCardSection