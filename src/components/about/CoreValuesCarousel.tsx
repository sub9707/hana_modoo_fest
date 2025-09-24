"use client"

import React, { useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import { motion, AnimatePresence } from "framer-motion"

import corevalues from "@/data/CoreValues.json"
import Image from "next/image"

function CoreValuesCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="w-full mt-6">
      {/* 캐러셀 영역 */}
      <div className="h-80 relative">
        <Swiper
          className="h-full"
          modules={[Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 5000 }}
          pagination={{
            clickable: true,
            bulletClass:
              "swiper-pagination-bullet !bg-gray-400 !opacity-100",
            bulletActiveClass:
              "swiper-pagination-bullet-active !bg-gray-900",
          }}
          onSlideChange={(swiper) =>
            setActiveIndex(swiper.realIndex) // 현재 실제 인덱스 업데이트
          }
        >
          {corevalues.map((item, index) => (
            <SwiperSlide key={index} className="h-full relative">
              {/* 배경 이미지 */}
              <Image
                src={item.image}
                fill
                alt={item.title}
                className="object-cover w-full h-full"
              />
              {/* 오버레이 + 설명 */}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center px-4">
                <p className="text-white text-md sm:text-lg md:text-3xl font-normal text-center w-full">
                  {item.description}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 타이틀 영역 (description 제거됨) */}
      <div className="w-full flex flex-col items-center justify-center py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h3 className="font-bold text-3xl">
              {corevalues[activeIndex].title}
            </h3>
            <p className="text-xl font-light">
              {corevalues[activeIndex].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default CoreValuesCarousel
