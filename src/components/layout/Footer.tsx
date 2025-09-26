import Link from 'next/link'
import { Mail, Phone, MapPin, ExternalLink, Instagram, Youtube, Globe } from 'lucide-react'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="font-paper bg-gradient-to-b from-purple-50 to-purple-100 text-gray-700 pb-20 lg:pb-0 z-10" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 메인 푸터 콘텐츠 */}
        <div className="py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* 로고 및 기본 정보 */}
            <div className="lg:col-span-1">
              <div className="mb-4 flex items-center justify-center sm:justify-start">
                <div className="relative w-80 h-15 flex items-center justify-center">
                  <Image src={'/icons/logo.png'} fill alt='logo'/>
                </div>
              </div>
              
              <p className="text-center text-gray-600 mb-4 text-sm leading-relaxed">
                가족다양성을 존중하고 시민이 함께 즐기는 연대의 장
              </p>

              {/* 축제 정보 */}
              <div className="bg-white rounded-lg p-3 border border-purple-200">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-gray-800">2025.10.18(토) 11:00-16:00</p>
                    <p className="text-gray-600">여의도공원 문화의마당</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 연락처 & 바로가기 통합 */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* 연락처 */}
                <div>
                  <h4 className="text-base font-semibold mb-3 text-gray-800">연락처</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <a href="tel:02-861-3020" className="text-sm hover:text-purple-600 transition-colors">
                        02-861-3020
                      </a>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <a 
                        href="mailto:hanbumo1@seoul.go.kr" 
                        className="text-sm hover:text-purple-600 transition-colors"
                      >
                        hanbumo1@seoul.go.kr
                      </a>
                    </div>
                  </div>
                </div>

                {/* 바로가기 링크 */}
                <div>
                  <h4 className="text-base font-semibold mb-3 text-gray-800">바로가기</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Link 
                      href="/register" 
                      className="text-sm hover:text-purple-600 transition-colors"
                    >
                      사전참가신청
                    </Link>
                    <Link 
                      href="/programs" 
                      className="text-sm hover:text-purple-600 transition-colors"
                    >
                      행사프로그램
                    </Link>
                    <Link 
                      href="/online-festival" 
                      className="text-sm hover:text-purple-600 transition-colors"
                    >
                      온라인축제
                    </Link>
                    <Link 
                      href="/location" 
                      className="text-sm hover:text-purple-600 transition-colors"
                    >
                      오시는길
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SNS & 하단 정보 통합 */}
        <div className="border-t border-purple-200 py-6">
          <div className="flex flex-col space-y-4">
            {/* SNS 링크 */}
            <div className="flex justify-center space-x-4">
              <a 
                href="https://instagram.com/moduhana2025" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-white rounded-lg shadow-sm border border-purple-200 hover:border-purple-300 transition-colors"
                aria-label="인스타그램"
              >
                <Instagram className="w-5 h-5 text-purple-600" />
              </a>
              
              <a 
                href="https://youtube.com/@moduhana2025" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-white rounded-lg shadow-sm border border-purple-200 hover:border-purple-300 transition-colors"
                aria-label="유튜브"
              >
                <Youtube className="w-5 h-5 text-purple-600" />
              </a>
              
              <a 
                href="https://seoul.go.kr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-white rounded-lg shadow-sm border border-purple-200 hover:border-purple-300 transition-colors"
                aria-label="홈페이지"
              >
                <Globe className="w-5 h-5 text-purple-600" />
              </a>
            </div>

            {/* 주최/주관 정보 */}
            <div className="text-center">
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-gray-600 mb-2">
                <span>주최: 서울특별시</span>
                <span className="hidden sm:block">|</span>
                <span>주관: 서울특별시한부모가족지원센터</span>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-gray-500 mb-3">
                <Link href="/privacy" className="hover:text-purple-600 transition-colors">
                  개인정보처리방침
                </Link>
                <span className="hidden sm:block">|</span>
                <Link href="/terms" className="hover:text-purple-600 transition-colors">
                  이용약관
                </Link>
              </div>
              
              <p className="text-xs text-gray-500">
                © 2025 서울특별시한부모가족지원센터. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}