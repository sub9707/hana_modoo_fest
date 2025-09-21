"use client";

import React, { useState } from 'react';
import styles from './FestivalJoinGuide.module.css';
import NodeGraph from './NodeGraph';
import Image from 'next/image';

function FestivalJoinGuide() {
    const [hoveredItem, setHoveredItem] = useState<number | null>(null);

    const getTextClass = (itemId: number, isLeft: boolean) => {
        const baseClass = `text-6xl font-bold mb-2 cursor-pointer transition-all duration-400 ${styles.baseTextStyle}`;

        if (hoveredItem === itemId) {
            return `${baseClass} ${isLeft ? styles.animateGlowTextLeft : styles.animateGlowTextRight}`;
        } else {
            return `${baseClass} ${styles.fadeOutText}`;
        }
    };

    const getDotClass = (itemId: number) => {
        const baseClass = "w-4 h-4 bg-white rounded-full transition-all duration-400";

        if (hoveredItem === itemId) {
            return `${baseClass} ${styles.animateGlowDot}`;
        } else {
            return `${baseClass} ${styles.fadeOutDot}`;
        }
    };

    const getLineClass = (itemId: number) => {
        const baseClass = "w-screen h-0.5 bg-white transition-all duration-400";

        if (hoveredItem === itemId) {
            return `${baseClass} ${styles.animateGlowLine}`;
        } else {
            return `${baseClass} ${styles.fadeOutLine}`;
        }
    };

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
                <div className="w-full h-100 flex items-center justify-center mb-16">
                    <NodeGraph />/
                </div>

                {/* 참여 방법 영역 */}
                <div className="text-white text-center py-6 w-full relative my-25">
                    <h3 className="text-7xl font-bold mb-15 text-shadow-md">참여 방법</h3>
                    <div className="space-y-8">
                        {/* 1. 사진찍기 신청 - 좌측 선분과 점 */}
                        <div className={`${styles.participationStep} relative flex items-center justify-center`}>
                            <div className="inline-block text-left relative">
                                {/* 선분 */}
                                <div className="absolute right-[105%] top-[35%] transform -translate-y-1/2 flex items-center">
                                    <div className={`${getLineClass(1)}`}></div>
                                    <div className={`${getDotClass(1)} -ml-1.5`}></div>
                                </div>
                                <h4
                                    className={getTextClass(1, true)}
                                    onMouseEnter={() => setHoveredItem(1)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                >1. 사진찍기 신청</h4>
                                <p className="text-lg text-center font-bold text-amber-100 text-shadow-md opacity-80">온라인으로 간편하게</p>
                            </div>
                        </div>

                        {/* 2. 온라인 캠페인 참여 - 좌측 선분과 점 */}
                        <div className={`${styles.participationStep} relative flex items-center justify-center`}>
                            <div className="inline-block text-left relative">
                                {/* 선분 */}
                                <div className="absolute right-[105%] top-[35%] transform -translate-y-1/2 flex items-center">
                                    <div className={`${getLineClass(2)}`}></div>
                                    <div className={`${getDotClass(2)} -ml-1.5`}></div>
                                </div>
                                <h4
                                    className={getTextClass(2, true)}
                                    onMouseEnter={() => setHoveredItem(2)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                >2. 온라인 캠페인 참여</h4>
                                <p className="text-lg text-center font-bold text-amber-100 text-shadow-md opacity-80">9-10월 사전축제</p>
                                <div className='absolute -right-85 -top-37 w-80 h-80'>
                                    <Image src={'/images/about/join_right.webp'} alt='참여 방법 우측' fill />
                                </div>
                            </div>
                        </div>

                        {/* 3. 현장 축제 참여*/}
                        <div className={`${styles.participationStep} relative flex items-center justify-center`}>
                            <div className="inline-block text-center relative">
                                {/* 선분 */}
                                <div className="absolute left-[105%] top-[35%] transform -translate-y-1/2 flex items-center">
                                    <div className={`${getDotClass(3)} -mr-1.5`}></div>
                                    <div className={`${getLineClass(3)}`}></div>
                                </div>
                                <h4
                                    className={getTextClass(3, false)}
                                    onMouseEnter={() => setHoveredItem(3)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                >3. 현장 축제 참여</h4>
                                <p className="text-lg text-center font-bold text-amber-100 text-shadow-md opacity-80">10월 18일 여의도공원 2025모두하나대축제</p>
                            </div>
                        </div>

                        {/* 4. 연대와 소통 - 우측 점과 선분 */}
                        <div className={`${styles.participationStep} relative flex items-center justify-center`}>
                            <div className="inline-block text-right relative">
                                {/* 선분 */}
                                <div className="absolute left-[105%] top-[35%] transform -translate-y-1/2 flex items-center">
                                    <div className={`${getDotClass(4)} -mr-1.5`}></div>
                                    <div className={`${getLineClass(4)}`}></div>
                                </div>
                                <h4
                                    className={getTextClass(4, false)}
                                    onMouseEnter={() => setHoveredItem(4)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                >4. 연대와 소통</h4>
                                <p className="text-lg text-center font-bold text-amber-100 text-shadow-md opacity-80">지속적인 네트워킹</p>
                            </div>
                            <div className='absolute left-45 -top-37 w-50 h-50'>
                                <Image src={'/images/about/join_left_2.webp'} alt='참여 방법 좌측' fill />
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