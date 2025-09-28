"use client";

import React, { useState, useCallback, useMemo } from 'react';
import styles from './FestivalJoinGuide.module.css';
import NodeGraph from './NodeGraph';
import Image from 'next/image';
import NetworkSection from './NetworkSection';

function FestivalJoinGuide() {
    const [hoveredItem, setHoveredItem] = useState<number | null>(null);

    // 이벤트 핸들러 메모이제이션으로 불필요한 리렌더링 방지
    const handleMouseEnter = useCallback((itemId: number) => {
        setHoveredItem(itemId);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setHoveredItem(null);
    }, []);

    // 클래스 생성 함수들을 메모이제이션
    const getTextClass = useCallback((itemId: number, isLeft: boolean) => {
        const baseClass = `text-3xl sm:text-6xl font-bold mb-2 cursor-pointer transition-all duration-400 ${styles.baseTextStyle}`;

        if (hoveredItem === itemId) {
            return `${baseClass} ${isLeft ? styles.animateGlowTextLeft : styles.animateGlowTextRight}`;
        } else {
            return `${baseClass} ${styles.fadeOutText}`;
        }
    }, [hoveredItem]);

    const getDotClass = useCallback((itemId: number) => {
        const baseClass = "w-4 h-4 bg-white rounded-full transition-all duration-400";

        if (hoveredItem === itemId) {
            return `${baseClass} ${styles.animateGlowDot}`;
        } else {
            return `${baseClass} ${styles.fadeOutDot}`;
        }
    }, [hoveredItem]);

    const getLineClass = useCallback((itemId: number) => {
        const baseClass = "w-screen h-0.5 bg-white transition-all duration-400";

        if (hoveredItem === itemId) {
            return `${baseClass} ${styles.animateGlowLine}`;
        } else {
            return `${baseClass} ${styles.fadeOutLine}`;
        }
    }, [hoveredItem]);

    // 정적 데이터 메모이제이션
    const specialBenefits = useMemo(() => [
        "사전 접수 신청 후 축제 참여시 기념품 제공",
        "온라인 캠페인 및 이벤트 참여자 1,111명에게 추첨을 통한 선물 제공",
        "자원봉사자 대상 활동 인정 시간 부여",
    ], []);

    // 참여 방법 데이터 메모이제이션
    const participationSteps = useMemo(() => [
        {
            id: 1,
            title: "1. 사전참가 신청",
            subtitle: "온라인으로 간편하게",
            isLeft: true,
            hasImage: false
        },
        {
            id: 2,
            title: "2. 온라인 캠페인 참여",
            subtitle: "9-10월 사전축제",
            isLeft: true,
            hasImage: true,
            imageSrc: "/images/about/join_right.webp",
            imageAlt: "참여 방법 우측",
            imageClass: "absolute sm:-right-85 sm:-top-37 sm:w-80 sm:h-80 -right-14 -top-55 w-25 h-25"
        },
        {
            id: 3,
            title: "3. 현장 축제 참여",
            subtitle: "10월 18일 여의도공원 2025모두하나대축제",
            isLeft: false,
            hasImage: false
        },
        {
            id: 4,
            title: "4. 연대와 소통",
            subtitle: "지속적인 네트워킹",
            isLeft: false,
            hasImage: true,
            imageSrc: "/images/about/join_left_2.webp",
            imageAlt: "참여 방법 좌측",
            imageClass: "absolute -left-20 -top-105 w-15 h-15 sm:-left-100 sm:-top-50 sm:w-50 sm:h-50"
        }
    ], []);

    return (
        <section className="py-16 bg-gradient-to-r from-pink-300 to-[rgba(255,162,150,1)] relative overflow-x-hidden">
            <div className="container mx-auto px-4 flex flex-col items-center min-h-screen">
                {/* 타이틀 */}
                <div className="text-white text-4xl lg:text-8xl font-black italic text-shadow-lg mb-6 text-center">
                    누구나 참여할 수 있는 <span className='text-6xl lg:text-8xl'>축제</span>
                </div>
                <p className="text-white text-md lg:text-2xl text-center text-shadow-lg mb-14">
                    모두하나대축제는 서울시민 누구나, <br className='flex sm:hidden'/> 어떤 형태의 가족이든 환영합니다. <br />
                    여러분의 참여가 더 따뜻하고 <br className='flex sm:hidden'/> 포용적인 서울을 만듭니다.
                </p>

                {/* 그래프 영역 */}
                <div className="w-full h-100 flex items-center justify-center mb-16">
                    <NetworkSection />
                </div>

                {/* 참여 방법 영역 - 최적화된 렌더링 */}
                <div className="text-white text-center py-6 w-full relative my-25">
                    <h3 className="text-5xl sm:text-7xl font-bold mb-15 text-shadow-md">참여 방법</h3>
                    <div className="space-y-8">
                        {participationSteps.map((step) => (
                            <div key={step.id} className={`${styles.participationStep} relative flex items-center justify-center`}>
                                <div className={`inline-block ${step.isLeft ? 'text-left' : step.id === 3 ? 'text-center' : 'text-right'} relative`}>
                                    {/* 선분과 점 */}
                                    <div className={`absolute ${step.isLeft ? 'right-[105%]' : 'left-[105%]'} top-[35%] transform -translate-y-1/2 hidden items-center sm:flex`}>
                                        {step.isLeft ? (
                                            <>
                                                <div className={getLineClass(step.id)}></div>
                                                <div className={`${getDotClass(step.id)} -ml-1.5`}></div>
                                            </>
                                        ) : (
                                            <>
                                                <div className={`${getDotClass(step.id)} -mr-1.5`}></div>
                                                <div className={getLineClass(step.id)}></div>
                                            </>
                                        )}
                                    </div>
                                    
                                    <h4
                                        className={getTextClass(step.id, step.isLeft)}
                                        onMouseEnter={() => handleMouseEnter(step.id)}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        {step.title}
                                    </h4>
                                    <p className="text-lg text-center font-bold text-amber-100 text-shadow-md opacity-80">
                                        {step.subtitle}
                                    </p>
                                    
                                    {/* 이미지 렌더링 최적화 */}
                                    {step.hasImage && (
                                        <div className={step.imageClass}>
                                            <Image 
                                                src={step.imageSrc!} 
                                                alt={step.imageAlt!} 
                                                fill 
                                                loading="lazy"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 특별 혜택 영역 */}
                <div className="w-full max-w-3xl text-white">
                    <h3 className="text-3xl lg:text-5xl font-bold text-center mb-8 text-amber-100 text-shadow-md">
                        ※ 특별 참여 혜택 ※
                    </h3>
                    <ul className="flex flex-col">
                        {specialBenefits.map((item, idx) => (
                            <li key={idx} className="flex items-center justify-center gap-2 text-sm sm:text-lg lg:text-2xl">
                                <span className="text-white font-bold text-lg sm:text-4xl mb-1.5">◆</span>
                                <span className="font-medium">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}

export default React.memo(FestivalJoinGuide);