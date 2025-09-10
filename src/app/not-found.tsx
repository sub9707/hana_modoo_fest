import Link from 'next/link'
import { Search, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50 px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 일러스트 */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-blue-200 mb-4">404</div>
          <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-16 h-16 text-blue-400" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          페이지를 찾을 수 없습니다
        </h1>
        
        <p className="text-lg text-slate-600 mb-8">
          요청하신 페이지가 존재하지 않거나<br />
          이동되었을 수 있습니다.
        </p>
        
        {/* 추천 링크들 */}
        <div className="bg-white rounded-lg p-6 mb-8 border">
          <h3 className="font-semibold text-slate-900 mb-4">이런 페이지는 어떠세요?</h3>
          <div className="space-y-2">
            <Link 
              href="/festival" 
              className="block p-3 text-left rounded-md hover:bg-slate-50 transition-colors"
            >
              <div className="font-medium text-slate-900">축제 소개</div>
              <div className="text-sm text-slate-500">모두하나대축제에 대해 알아보세요</div>
            </Link>
            <Link 
              href="/programs" 
              className="block p-3 text-left rounded-md hover:bg-slate-50 transition-colors"
            >
              <div className="font-medium text-slate-900">행사 프로그램</div>
              <div className="text-sm text-slate-500">다양한 프로그램을 확인하세요</div>
            </Link>
            <Link 
              href="/register" 
              className="block p-3 text-left rounded-md hover:bg-slate-50 transition-colors"
            >
              <div className="font-medium text-slate-900">사전참가 신청</div>
              <div className="text-sm text-slate-500">축제에 참가하세요</div>
            </Link>
          </div>
        </div>
        
        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 px-6">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              홈으로 가기
            </Link>
          </button>
          
          <button 
            className="px-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            이전 페이지로
          </button>
        </div>
        
        {/* 검색 제안 */}
        <div className="mt-8 text-sm text-slate-500">
          <p>원하는 정보를 찾지 못하셨나요?</p>
          <Link href="/news" className="text-blue-600 hover:text-blue-700 font-medium">
            공지사항에서 검색해보세요 →
          </Link>
        </div>
      </div>
    </div>
  )
}