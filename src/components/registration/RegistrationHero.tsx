import { getFormattedDeadline, getTimeUntilDeadline, isRegistrationClosed } from '@/lib/utils/registration-deadline'
import { Clock } from 'lucide-react'

export default function RegistrationHero() {
  const timeLeft = getTimeUntilDeadline()
  const isClosed = isRegistrationClosed()
  const formattedDeadline = getFormattedDeadline()

  return (
    <section className="bg-gradient-to-r from-orange-400 to-pink-500 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          사전참가 신청
        </h1>
        <p className="text-xl md:text-2xl mb-4 opacity-90">
          모두하나대축제 2025에 함께해주세요
        </p>

        {/* 마감 안내 */}
        {!isClosed ? (
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border-2 border-white/40">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5" />
                <span className="font-bold text-lg">접수 마감</span>
              </div>
              <div className="text-2xl font-bold mb-2">
                {formattedDeadline}
              </div>
              {!timeLeft.isExpired && (
                <div className="text-sm opacity-90">
                  남은 시간: {timeLeft.days > 0 && `${timeLeft.days}일 `}
                  {timeLeft.hours > 0 && `${timeLeft.hours}시간 `}
                  {timeLeft.minutes}분
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-8 max-w-2xl mx-auto">
            <p className="inline-block rounded-md bg-white px-5 py-2.5 font-bold text-red-600">
              사전 접수가 마감되었습니다
            </p>
          </div>
        )}

        <dl className="grid grid-cols-1 md:grid-cols-3 max-w-3xl mx-auto border-y border-white/40 md:divide-x divide-white/40">
          <div className="py-5 px-4">
            <dt className="text-xs font-semibold tracking-widest opacity-80 mb-1">일시</dt>
            <dd className="font-bold">2025. 10. 18 (토)</dd>
            <dd className="opacity-90 text-sm">11:00 - 17:00</dd>
          </div>
          <div className="py-5 px-4 border-t border-white/40 md:border-t-0">
            <dt className="text-xs font-semibold tracking-widest opacity-80 mb-1">장소</dt>
            <dd className="font-bold">여의도공원</dd>
            <dd className="opacity-90 text-sm">문화의마당</dd>
          </div>
          <div className="py-5 px-4 border-t border-white/40 md:border-t-0">
            <dt className="text-xs font-semibold tracking-widest opacity-80 mb-1">참가비</dt>
            <dd className="font-bold">무료</dd>
            <dd className="opacity-90 text-sm">{isClosed ? '현장 참여 가능' : '사전신청 권장'}</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}