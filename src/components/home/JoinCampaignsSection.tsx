import Image from 'next/image'
import React from 'react'
import { CAMPAIGN_STAT_LABELS, CAMPAIGN_SECTION_TEXT } from '@/constants'
import { getCampaignStats } from '@/lib/services/campaign-stats-service'

const formatCount = (n: number) => n.toLocaleString('ko-KR')

interface CampaignStat {
  number: string
  label: string
  description?: string
}

export default async function JoinCampaignsSection() {
  // DB 직접 조회. 실패 시 가짜 숫자 대신 통계 영역을 숨긴다.
  const statsData = await getCampaignStats().catch((error) => {
    console.error('캠페인 통계 조회 실패:', error)
    return null
  })

  const campaignStats: CampaignStat[] = statsData ? [
    {
      number: formatCount(statsData.preregistration_count),
      label: CAMPAIGN_STAT_LABELS.preregistration.label,
      description: CAMPAIGN_STAT_LABELS.preregistration.description
    },
    {
      number: formatCount(statsData.comment_count),
      label: CAMPAIGN_STAT_LABELS.comment.label,
      description: CAMPAIGN_STAT_LABELS.comment.description
    },
    {
      number: formatCount(statsData.writing_count),
      label: CAMPAIGN_STAT_LABELS.writing.label,
      description: CAMPAIGN_STAT_LABELS.writing.description
    }
  ] : []

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="bg-gradient-to-r from-orange-300 to-pink-400 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          {/* 배경 패턴 */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full"></div>
          </div>

          {/* 헤더 영역 */}
          <div className="flex items-center justify-between mb-12 max-w-6xl ml-0 sm:ml-20 translate-x-0 sm:translate-x-1/3 relative z-10">
            <div className="text-left flex-1 relative">
              <h2 className="text-2xl sm:text-3xl lg:text-7xl font-black mb-6 text-center sm:text-left">
                {CAMPAIGN_SECTION_TEXT.title}
              </h2>

              <p className="text-md sm:text-lg lg:text-2xl font-medium opacity-90 break-keep text-center sm:text-start">
                {CAMPAIGN_SECTION_TEXT.description.split(' 온라인 캠페인에')[0]} &nbsp;
                <br className='hidden sm:block' />
                온라인 캠페인에{CAMPAIGN_SECTION_TEXT.description.split('온라인 캠페인에')[1]}
              </p>
              <div className='absolute -left-85 -top-5 w-70 h-55 hidden sm:flex'>
                <Image
                  src={'/images/main/join_left.webp'}
                  alt='참여 좌측 캐릭터'
                  fill
                  priority={false}
                  sizes="(max-width: 768px) 0px, 280px"
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* 실시간 통계 그리드 */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 relative z-10">
            {campaignStats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-2xl lg:text-3xl font-black mb-2 transition-transform group-hover:scale-110">
                  {stat.number}
                </div>
                <div className="text-sm lg:text-3xl font-semibold opacity-95 mb-1">
                  {stat.label}
                </div>
                {stat.description && (
                  <div className="text-xs lg:text-sm opacity-75 hidden lg:block transition-opacity group-hover:opacity-100">
                    {stat.description}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 모바일 캐릭터 */}
          <div className='absolute right-0 bottom-0 w-40 h-30 sm:hidden'>
            <Image
              src={'/images/main/join_left.webp'}
              alt='참여 좌측 캐릭터'
              fill
              sizes="160px"
              className="object-contain"
            />
          </div>

        </div>
      </div>
    </section>
  )
}
