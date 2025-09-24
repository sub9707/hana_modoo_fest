import Link from 'next/link'
import { ArrowRight, Users, Calendar, MapPin, Gift } from 'lucide-react'

const benefits = [
  {
    icon: <Gift className="w-6 h-6" />,
    title: '사전접수 선물',
    description: '사전 접수 후 현장 참여 시 선물제공'
  }
]

const stats = [
  { number: '500', label: '사전접수 완료', color: 'text-festival-blue' },
  { number: '2,000', label: '목표 인원', color: 'text-festival-green' },
  { number: '25%', label: '달성률', color: 'text-festival-purple' }
]

export default function PreRegistration() {
  return (
    <div className="p-8 md:p-12">
      {/* 헤더 섹션 */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-festival-blue/10 rounded-full mb-6">
          <span className="text-2xl">✍️</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          모두하나대축제 <br className='flex sm:hidden'/> 사전참가 신청
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto break-keep">
          10월 18일 여의도공원에서 열리는 모두하나대축제에 미리 신청하고<br />
          더 특별한 혜택을 받아보세요!
        </p>
      </div>

      {/* 통계 섹션 */}
      <div className="grid grid-cols-3 gap-6 mb-12">
        {stats.map((stat, index) => (
          <div key={index} className="text-center p-0 sm:p-6 bg-white/50 rounded-2xl">
            <div className={`text-xl sm:text-2xl md:text-3xl font-bold ${stat.color} mb-2`}>
              {stat.number}
            </div>
            <div className="text-sm md:text-base text-gray-600">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* 혜택 섹션 */}
      <div className="mb-12">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-8 text-center">
          사전접수 혜택
        </h3>
        <div className="flex justify-center">
            <div className="flex items-start space-x-4 p-6 bg-white/50 rounded-2xl hover:bg-white/70 transition-colors duration-300">
              <div className="flex-shrink-0 w-12 h-12 bg-festival-blue/10 rounded-full flex items-center justify-center text-festival-blue">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">사전접수 선물</h4>
                <p className="text-gray-600 text-sm">사전 접수 후 현장 참여 시 선물제공</p>
              </div>
            </div>
        </div>
      </div>

      {/* 축제 정보 카드 */}
      <div className="bg-gradient-to-br from-festival-blue/5 via-festival-purple/5 to-festival-pink/5 rounded-2xl p-8 mb-12">
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl mb-3">📅</div>
            <h4 className="font-semibold text-gray-900 mb-2">축제 날짜</h4>
            <p className="text-gray-600">2025년 10월 18일 (토)</p>
            <p className="text-gray-600">11:00 - 16:00</p>
          </div>
          <div>
            <div className="text-2xl mb-3">📍</div>
            <h4 className="font-semibold text-gray-900 mb-2">축제 장소</h4>
            <p className="text-gray-600">여의도공원</p>
            <p className="text-gray-600">문화의마당</p>
          </div>
          <div>
            <div className="text-2xl mb-3">🎪</div>
            <h4 className="font-semibold text-gray-900 mb-2">참가 대상</h4>
            <p className="text-gray-600">시민, 가족</p>
            <p className="text-gray-600">누구나 무료 참가</p>
          </div>
        </div>
      </div>

      {/* 신청 버튼 */}
      <div className="text-center">
        <Link
          href="/registration"
          className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-festival-blue to-festival-purple text-white font-semibold rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 btn-festival"
        >
          <span className="mr-2">지금 사전참가 신청하기</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="text-sm text-gray-500 mt-4">
          신청은 무료이며, 언제든지 취소 가능합니다
        </p>
      </div>

      {/* 주의사항 */}
      <div className="mt-12 p-6 bg-yellow-50/80 rounded-2xl border-l-4 border-yellow-400">
        <h4 className="font-semibold text-yellow-800 mb-2">📢 안내사항</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• 사전접수는 축제 당일까지 가능합니다</li>
          <li>• 개인정보는 축제 운영 목적으로만 사용되며, 종료 후 안전하게 폐기됩니다</li>
          <li>• 기상 악화 시 축제 일정이 변경될 수 있습니다</li>
        </ul>
      </div>
    </div>
  )
}