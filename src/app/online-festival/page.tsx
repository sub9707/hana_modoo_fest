import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '온라인 축제',
  description: '모두하나대축제 2025 온라인 캠페인에 참여하세요.',
}

export default function OnlineFestivalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            온라인 축제
          </h1>
          <p className="text-xl text-slate-600">
            집에서도, 길에서도, 언제 어디서나 함께하는 캠페인
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-4xl mb-4">📱</div>
            <h2 className="text-2xl font-bold mb-4">해시태그 챌린지</h2>
            <p className="text-slate-600 mb-6">
              #모두의서울 #함께하는축제 해시태그와 함께 일상 속 가족 이야기를 공유해주세요
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700 font-medium">참여 방법</p>
              <p className="text-sm text-blue-600">SNS에 해시태그와 함께 게시물 작성</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-4xl mb-4">📸</div>
            <h2 className="text-2xl font-bold mb-4">포토 스토리</h2>
            <p className="text-slate-600 mb-6">
              우리 가족만의 특별한 순간을 사진과 함께 스토리로 들려주세요
            </p>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-700 font-medium">참여 방법</p>
              <p className="text-sm text-green-600">사진과 가족 이야기를 홈페이지에 업로드</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-4xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold mb-4">주간 퀴즈</h2>
            <p className="text-slate-600 mb-6">
              가족다양성과 관련된 재미있는 퀴즈를 풀고 선물도 받아가세요
            </p>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-700 font-medium">참여 방법</p>
              <p className="text-sm text-purple-600">매주 화요일 새로운 퀴즈 참여</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">현재 참여 현황</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold text-blue-600">1,247+</div>
              <div className="text-slate-600">총 참여자</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">892</div>
              <div className="text-slate-600">해시태그 게시물</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">355</div>
              <div className="text-slate-600">포토 스토리</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-600">623</div>
              <div className="text-slate-600">퀴즈 참여자</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}