import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '오시는 길',
  description: '여의도공원 모두하나대축제 2025 행사장 위치와 교통안내',
}

export default function LocationPage() {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            오시는 길
          </h1>
          <p className="text-xl text-slate-600">
            여의도공원 문화의마당에서 만나요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 지도 영역 */}
          <div className="space-y-6">
            <div className="aspect-video bg-slate-100 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">🗺️</div>
                <h3 className="text-lg font-semibold mb-2">행사장 위치</h3>
                <p className="text-slate-600">여의도공원 문화의마당</p>
                <p className="text-sm text-slate-500">서울특별시 영등포구 여의공원로 68</p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="font-semibold mb-3">행사 정보</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">일시:</span> 2025년 10월 18일(토) 11:00-16:00</p>
                <p><span className="font-medium">장소:</span> 여의도공원 문화의마당</p>
                <p><span className="font-medium">참가비:</span> 무료</p>
              </div>
            </div>
          </div>

          {/* 교통 정보 */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">교통 안내</h2>
            
            <div className="space-y-4">
              <div className="border border-blue-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600">🚇</span>
                  </div>
                  <h3 className="text-lg font-semibold">지하철 (추천)</h3>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>• 5호선 여의나루역 2번 출구 도보 5분</p>
                  <p>• 9호선 여의도역 4번 출구 도보 10분</p>
                </div>
              </div>

              <div className="border border-green-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600">🚌</span>
                  </div>
                  <h3 className="text-lg font-semibold">버스</h3>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>• 여의도공원 정류장: 162, 261, 461, 753</p>
                  <p>• 국회의사당 정류장: 150, 160, 162, 260</p>
                </div>
              </div>

              <div className="border border-orange-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600">🚗</span>
                  </div>
                  <h3 className="text-lg font-semibold">자가용</h3>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>• 여의도공원 주차장 이용 가능</p>
                  <p>• 주차 요금: 기본 30분 1,000원</p>
                  <p className="text-orange-600 font-medium">※ 주차공간 한정, 대중교통 이용 권장</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-xl">
              <h3 className="font-semibold mb-3">접근성 안내</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <p>• 휠체어 이용 가능한 진입로 및 화장실 완비</p>
                <p>• 수유실 및 기저귀 교환대 운영</p>
                <p>• 의료진 상주 및 응급처치 지원</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}