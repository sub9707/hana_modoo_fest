import React from 'react'
import AboutCTAButton from './AboutCTAButton'
import Image from 'next/image'

function JoinFestival() {
  return (
    <section className="py-30 container mx-auto px-4 flex flex-col items-center text-center">
      <h1 className='w-full text-7xl font-extrabold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent italic  mb-6 '>지금 바로 참여하세요!</h1>
      <p className='text-lg font-medium text-gray-700'>모두가 함께 만들어가는 따뜻한 축제, 모두하나대축제 2025에서<br/>
        새로운 연결과 소중한 추억을 만들어보세요.
      </p>
      <div className='flex justify-center items-center gap-6 mt-10 mb-10'>
         <AboutCTAButton href="/registration" text="사전참가 신청하기" />
         <AboutCTAButton href="/directions" text="오시는길 확인" reversed/>
      </div>
      <div className='relative w-160 h-125'>
        <Image src={"/images/about/about_bottom.webp"} fill alt='bottom_character'/>
      </div>
    </section>
  )
}

export default JoinFestival