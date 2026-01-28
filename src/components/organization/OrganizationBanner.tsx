'use client'

import Link from "next/link"
import { CONTACT } from "@/constants"

function OrganizationBanner() {
    const handleContactClick = () => {
        alert(`전화: ${CONTACT.phone}\n이메일: ${CONTACT.email}\n홈페이지: ${CONTACT.social.website.url}`)
    }

    return (
        <section className="w-full h-full min-h-80 bg-[#885ef9]">
            <div className="w-full h-full flex flex-col items-center justify-center gap-6 sm:gap-8 text-center px-4 py-10 relative">
                <h2 className="text-3xl sm:text-5xl lg:text-6xl text-white font-extrabold leading-tight">
                    함께 만들어가는 따뜻한 사회
                </h2>
                <p className="text-white text-sm sm:text-xl leading-relaxed">
                    서울특별시한부모가족지원센터는 <br className="flex sm:hidden"/> 모든 가족이 행복할 수 있는 포용사회를 만들어갑니다. <br /> 여러분의 관심과 참여가 더 나은 미래를 만드는 힘입니다.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="https://seoulhanbumo.or.kr"
                        className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        기관 홈페이지
                    </Link>
                    <button
                        onClick={handleContactClick}
                        className="inline-flex items-center px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        문의하기
                    </button>
                </div>
            </div>
        </section>
    )
}

export default OrganizationBanner