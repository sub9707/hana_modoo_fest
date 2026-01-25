'use client'

import Link from 'next/link'
import { ROUTES, CONTACT } from '@/constants'

interface PartnerStats {
  organizers: number
  sponsors: number
  operators: number
  participants: number
}

interface PartnerStatsSectionProps {
  stats: PartnerStats
}

const STAT_ITEMS = [
  { key: 'organizers', label: '주최·주관', gradient: 'from-purple-500 to-indigo-500' },
  { key: 'sponsors', label: '후원', gradient: 'from-indigo-500 to-cyan-500' },
  { key: 'operators', label: '운영법인', gradient: 'from-cyan-500 to-purple-500' },
  { key: 'participants', label: '참여기관', gradient: 'from-purple-400 to-cyan-400' },
] as const

export default function PartnerStatsSection({ stats }: PartnerStatsSectionProps) {
  const totalPartners = stats.organizers + stats.sponsors + stats.operators + stats.participants

  const handlePartnershipInquiry = () => {
    alert(
      `파트너십 문의 안내\n\n` +
      `서울시한부모가족지원센터로 연락해 주세요.\n\n` +
      `전화: ${CONTACT.phone}\n` +
      `이메일: ${CONTACT.email}`
    )
  }

  return (
    <section className="py-20 bg-gradient-to-b from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* 전체 통계 */}
          <header className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                {totalPartners}&nbsp;
              </span>
              개 기관과 함께
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              모두하나대축제 2025는 다양한 분야의 파트너들과 함께
              더 큰 가치를 만들어가고 있습니다
            </p>
          </header>

          {/* 파트너십 카테고리 통계 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {STAT_ITEMS.map((item) => (
              <div
                key={item.key}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/40 hover:bg-white/80 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <div
                  className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent mb-2`}
                >
                  {stats[item.key]}
                </div>
                <div className="text-gray-700 text-sm font-medium">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* 감사 메시지 */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/50 text-center shadow-lg">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              함께해주셔서 감사합니다
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              모든 파트너 기관들의 소중한 참여와 지원으로
              모두하나대축제 2025가 더욱 의미 있는 행사가 될 수 있습니다
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handlePartnershipInquiry}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-indigo-700"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                파트너십 문의
              </button>
              <Link
                href={ROUTES.programs}
                className="inline-flex items-center px-8 py-4 bg-white border-2 border-purple-300 text-purple-600 font-semibold rounded-full hover:bg-purple-50 hover:border-purple-400 transition-all duration-300 hover:scale-105"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                참여 프로그램 보기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
