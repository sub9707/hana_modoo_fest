import Image from 'next/image'
import React from 'react'

function JoinCampaignsSection() {
  const campaignStats = [
    {
      number: "1,247",
      label: "사전접수 참여자"
    },
    {
      number: "817",
      label: "퀴즈이벤트"
    },
    {
      number: "1,786",
      label: "응원 댓글"
    },
    {
      number: "103",
      label: "가족추제 글짓기"
    },
    {
      number: "1,183",
      label: "랜덤룰렛 이벤트"
    }
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="bg-gradient-to-r from-orange-300 to-pink-400 rounded-3xl p-12 text-center text-white">
          {/* 헤더 영역 */}
          <div className="flex items-center justify-between mb-12 max-w-6xl ml-0 sm:ml-20 translate-x-0 sm:translate-x-1/3">
            {/* 텍스트 영역 */}
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
                <Image src={'/images/main/join_left.webp'} alt='참여 좌측 캐릭터' fill />
              </div>
            </div>

          </div>

          {/* 통계 그리드 */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
            {campaignStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl lg:text-3xl font-black mb-2">
                  {stat.number}
                </div>
                <div className="text-sm lg:text-3xl font-semibold opacity-95">
                  {stat.label}
                </div>
              </div>
            ))}
            <div className='absolute translate-y-35 translate-x-25 w-45 h-35 sm:hidden'>
              <Image src={'/images/main/join_left.webp'} alt='참여 좌측 캐릭터' fill />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default JoinCampaignsSection