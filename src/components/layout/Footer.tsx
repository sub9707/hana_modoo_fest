import Link from 'next/link'
import { Mail, Phone, MapPin, ExternalLink, Instagram, Youtube, Globe } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white pb-20 lg:pb-0" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 메인 푸터 콘텐츠 */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* 로고 및 기본 정보 */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">모</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">모두하나대축제 2025</h3>
                  <p className="text-slate-300 text-sm">서울시 대표 가족축제</p>
                </div>
              </div>
              
              <p className="text-slate-300 mb-6 leading-relaxed">
                서울특별시가 주최하고 서울특별시한부모가족지원센터가 주관하는 
                모두하나대축제는 가족다양성을 존중하고 시민이 함께 즐기는 연대의 장입니다.
              </p>

              {/* 축제 정보 */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="text-sm">
                    2025년 10월 18일(토) 11:00-16:00 | 여의도공원 문화의마당
                  </span>
                </div>
              </div>
            </div>

            {/* 연락처 정보 */}
            <div>
              <h4 className="text-lg font-semibold mb-4">연락처</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <a href="tel:02-123-4567" className="text-sm hover:text-blue-400 transition-colors">
                    02-123-4567
                  </a>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <a 
                    href="mailto:info@moduhana2025.seoul.kr" 
                    className="text-sm hover:text-blue-400 transition-colors"
                  >
                    info@moduhana2025.seoul.kr
                  </a>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p>서울특별시 중구 세종대로 110</p>
                    <p className="text-slate-400">서울특별시청</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 바로가기 링크 */}
            <div>
              <h4 className="text-lg font-semibold mb-4">바로가기</h4>
              <div className="space-y-2">
                <Link 
                  href="/register" 
                  className="block text-sm hover:text-blue-400 transition-colors"
                >
                  사전참가 신청
                </Link>
                <Link 
                  href="/programs" 
                  className="block text-sm hover:text-blue-400 transition-colors"
                >
                  행사 프로그램
                </Link>
                <Link 
                  href="/online-festival" 
                  className="block text-sm hover:text-blue-400 transition-colors"
                >
                  온라인 축제
                </Link>
                <Link 
                  href="/location" 
                  className="block text-sm hover:text-blue-400 transition-colors"
                >
                  오시는 길
                </Link>
                <a 
                  href="https://seoul.go.kr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm hover:text-blue-400 transition-colors"
                >
                  <span>센터 홈페이지</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* SNS 링크 */}
        <div className="border-t border-slate-700 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 sm:mb-0">
              <a 
                href="https://instagram.com/moduhana2025" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                aria-label="인스타그램"
              >
                <Instagram className="w-5 h-5" />
              </a>
              
              <a 
                href="https://youtube.com/@moduhana2025" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                aria-label="유튜브"
              >
                <Youtube className="w-5 h-5" />
              </a>
              
              <a 
                href="https://blog.seoul.go.kr/moduhana" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                aria-label="블로그"
              >
                <Globe className="w-5 h-5" />
              </a>
            </div>

            <div className="text-center sm:text-right">
              <p className="text-sm text-slate-400">
                함께 만들어가는 모두의 축제
              </p>
            </div>
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="border-t border-slate-700 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-slate-400">
              <span>주최: 서울특별시</span>
              <span>주관: 서울특별시한부모가족지원센터</span>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-slate-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                개인정보처리방침
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                이용약관
              </Link>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-700 text-center">
            <p className="text-sm text-slate-500">
              © 2025 서울특별시한부모가족지원센터. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}