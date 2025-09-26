'use client';

import HeroCTAButton from "./HeroCTAButton"
import { useState, useEffect } from "react";

interface HeroLeftProps {
  animationStage: number;
}

function HeroLeft({ animationStage }: HeroLeftProps) {
    return (
        <div className="max-w-2xl w-full mb-20">
            {/* 메인 타이틀 */}
            <h1 className="text-6xl lg:text-9xl text-center lg:text-left font-black text-gray-900 leading-none mt-0 mb-4">
                <span 
                    className={`block transition-all duration-500 ease-out ${
                        animationStage >= 1 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 translate-y-6'
                    }`}
                >
                    모두의 서울
                </span>
                <span 
                    className={`block bg-gradient-to-r from-purple-300 via-blue-300 to-green-300 bg-clip-text text-transparent transition-all duration-500 ease-out ${
                        animationStage >= 2 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 translate-y-6'
                    }`}
                >
                    모두 다 함께
                </span>
            </h1>

            {/* 서브 타이틀 */}
            <p 
                className={`text-xl sm:text-2xl lg:text-[2.7rem] text-center lg:text-left text-gray-700 font-bold mb-2 transition-all duration-500 ease-out ${
                    animationStage >= 3 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-6'
                }`}
            >
                서울시 대표 가족축제가 찾아갑니다.
            </p>
            <p 
                className={`text-sm sm:text-base lg:text-xl text-center lg:text-left text-gray-600 mb-6 sm:mb-12 transition-all duration-500 ease-out ${
                    animationStage >= 4 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-6'
                }`}
            >
                가족다양성을 존중하고 시민이 함께 즐기는 연대의 장
            </p>

            {/* 행사 정보 카드 */}
            <div 
                className={`w-full bg-gradient-to-r from-purple-200 via-blue-200 to-green-200 rounded-2xl p-6 mb-8 border-4 border-white shadow-lg transition-all duration-500 ease-out ${
                    animationStage >= 5 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-6'
                }`}
            >
                <div className="flex text-center">
                    <div className="flex-1 pr-4">
                        <h3
                            className="font-bold text-xl sm:text-3xl text-gray-900 mb-2"
                            style={{
                                WebkitTextStroke: "0.5px white"
                            }}
                        >
                            행사 일정
                        </h3>
                        <p className="text-gray-800 text-sm sm:text-xl font-semibold">2025. 10. 18(토)</p>
                        <p className="text-gray-700">11:00 - 17:00</p>
                    </div>
                    <div className="flex-1 pl-4 border-l border-white/50">
                        <h3
                            className="font-bold text-xl sm:text-3xl text-gray-900 mb-2"
                            style={{
                                WebkitTextStroke: "0.5px white"
                            }}
                        >
                            개최 장소</h3>
                        <p className="text-gray-800 text-sm sm:text-xl font-semibold">여의도공원</p>
                        <p className="text-gray-700">문화의마당</p>
                    </div>
                </div>
            </div>

            {/* 참여 버튼들 */}
            <div 
                className={`flex flex-col sm:flex-row gap-4 transition-all duration-500 ease-out ${
                    animationStage >= 6 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-6'
                }`}
            >
                <HeroCTAButton
                    text="사전참가 신청하기"
                    href="/registration"
                />

                <HeroCTAButton
                    text="캠페인 참여하기"
                    href="/online-festival"
                />
            </div>
        </div>
    )
}

export default HeroLeft