"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"

function Carousel() {
  return (
    <div className="w-full max-w-2xl relative carousel-swiper">
      <Swiper
      className="rounded-[5rem]"
        modules={[Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}                 // 한 슬라이드만 보이게
        loop={true}                       // 자동 루프
        autoplay={{ delay: 3000 }}        // 3초마다 자동 넘김
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet !bg-gray-400 !opacity-100", // 둥근 버튼
          bulletActiveClass: "swiper-pagination-bullet-active !bg-gray-900", // 활성화 버튼
        }}
      >
        <SwiperSlide>
          <div className="flex items-center justify-center h-140 bg-purple-200">
            Slide 1
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex items-center justify-center h-140 bg-blue-200">
            Slide 2
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex items-center justify-center h-140 bg-green-200">
            Slide 3
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  )
}

export default Carousel
