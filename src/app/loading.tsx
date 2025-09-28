export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white font-paper">
      <div className="text-center">
        {/* 로딩 스피너 */}
        <div className="relative">
          <div className="w-20 h-20 border-4 border-orange-200 rounded-full animate-spin mx-auto mb-6">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-orange-600 rounded-full animate-spin"></div>
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          로딩 중...
        </h2>
        <p className="text-slate-600">
          잠시만 기다려주세요
        </p>
        
        {/* 진행 표시 (선택사항) */}
        <div className="mt-6 w-64 bg-slate-200 rounded-full h-2 mx-auto">
          <div className="bg-orange-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>
    </div>
  )
}