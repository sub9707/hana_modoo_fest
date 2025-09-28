import Image from 'next/image'
import React from 'react'

interface CampaignStat {
  number: string
  label: string
  description?: string
}

interface CampaignStatsData {
  preregistration_count: number
  comment_count: number
  writing_count: number
}

function formatNumber(num: number): string {
  if (num >= 10000) {
    return `${Math.floor(num / 1000)}K+`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toLocaleString()
}

// 안전한 숫자 변환 함수
function safeToNumber(value: any): number {
  if (typeof value === 'number') return Math.max(0, Math.floor(value))
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10)
    return isNaN(parsed) ? 0 : Math.max(0, parsed)
  }
  return 0
}

// 폴백 데이터
const getFallbackStats = (): CampaignStatsData => ({
  preregistration_count: 1247,
  comment_count: 1786,
  writing_count: 103
})

// 최적화된 데이터 조회 함수
async function getCampaignStatsData(): Promise<CampaignStatsData> {
  const startTime = Date.now()
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                   (process.env.NODE_ENV === 'production' 
                     ? 'https://www.모두하나대축제.com' 
                     : 'http://localhost:3000')
    
    const response = await fetch(`${baseUrl}/api/campaign/stats`, {
      cache: 'default',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CampaignStats/1.0'
      },
      signal: AbortSignal.timeout(5000)
    })
    
    const responseTime = Date.now() - startTime
    
    if (!response.ok) {
      console.warn(`❌ API 응답 오류: ${response.status} ${response.statusText}`)
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const result = await response.json()
  
    
    // 기본 응답 구조 검증
    if (!result.success || !result.data) {
      console.warn('⚠️ 잘못된 API 응답 구조:', result)
      throw new Error('Invalid API response structure')
    }
    
    const { data } = result
    
    // 안전한 타입 변환 및 검증
    const safeData: CampaignStatsData = {
      preregistration_count: safeToNumber(data.preregistration_count),
      comment_count: safeToNumber(data.comment_count),
      writing_count: safeToNumber(data.writing_count)
    }
    
    // 변환된 데이터 검증
    const isValidData = 
      safeData.preregistration_count >= 0 &&
      safeData.comment_count >= 0 &&
      safeData.writing_count >= 0

    if (!isValidData) {
      console.warn('⚠️ 데이터 값이 유효하지 않음:', safeData)
      throw new Error('Invalid data values after conversion')
    }

    return safeData
    
  } catch (error) {
    const responseTime = Date.now() - startTime
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error(`⏰ API 타임아웃 (${responseTime}ms):`, error.message)
      } else if (error.message.includes('fetch failed')) {
        console.error(`🌐 네트워크 오류 (${responseTime}ms):`, error.message)
      } else {
        console.error(`❌ API 오류 (${responseTime}ms):`, error.message)
      }
    } else {
      console.error(`❓ 알 수 없는 오류 (${responseTime}ms):`, error)
    }
    
    // 폴백 데이터 반환
    const fallbackData = getFallbackStats()
    return fallbackData
  }
}

export default async function JoinCampaignsSection() {
  const statsData = await getCampaignStatsData()
  
  const campaignStats: CampaignStat[] = [
    {
      number: formatNumber(statsData.preregistration_count),
      label: "사전접수 참여자",
      description: "축제 사전 등록을 완료한 시민"
    },
    {
      number: formatNumber(statsData.comment_count),
      label: "응원 댓글", 
      description: "따뜻한 응원과 격려 메시지"
    },
    {
      number: formatNumber(statsData.writing_count),
      label: "가족주제 글짓기",
      description: "가족에 대한 진솔한 이야기"
    }
  ]

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
                온라인 캠페인 참여하기
              </h2>

              <p className="text-md sm:text-lg lg:text-2xl font-medium opacity-90">
                집에서도, 길에서도, 언제 어디서나 함께할 수 있는
                <br className='hidden sm:block' />
                온라인 캠페인에 참여해보세요
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
          
          {/* 실시간 업데이트 표시 */}
          <div className="absolute top-4 right-4 text-xs opacity-60 z-20">
            <div className="flex items-center gap-1 bg-white/10 rounded-full px-2 py-1 backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              실시간 업데이트
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}