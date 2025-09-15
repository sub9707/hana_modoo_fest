'use client'

import Link from 'next/link'
import { Search, Home, ArrowLeft} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 px-4 py-8">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-60 right-32 w-24 h-24 bg-pink-200 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-32 w-40 h-40 bg-blue-200 rounded-full opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-9xl w-full text-center relative z-10">
        {/* 404 일러스트 */}
        <div className="w-full mb-8 relative">
          <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6 relative">
            페이지를 찾을 수 없어요!
          </div>
          
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto shadow-lg border-4 border-white">
              <Search className="w-16 h-16 text-purple-500" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-ping">
              <span className="text-white text-sm">!</span>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            앗! 축제장에서 길을 잃으셨나요?
          </h1>
          
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.<br />
            <span className="text-purple-600 font-medium">모두하나대축제</span>의 다른 멋진 곳들을 둘러보세요!
          </p>
        </div>
        
        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link 
            href="/"
            className="group inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:from-purple-700 hover:to-pink-700 hover:-translate-y-0.5 text-lg"
          >
            <Home className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
            축제 홈으로 가기
          </Link>
          
          <button 
            onClick={handleGoBack}
            className="group inline-flex items-center justify-center px-10 py-5 bg-white border-2 border-purple-600 text-purple-600 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:bg-purple-50 hover:-translate-y-0.5 text-lg"
          >
            <ArrowLeft className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
            이전 페이지로
          </button>
        </div>
      </div>
    </div>
  )
}