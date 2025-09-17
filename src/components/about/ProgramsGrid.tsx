"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";

const photos = [
  { id: 1, src: "/images/main/comment_pic.webp", alt: "Mountain landscape", title: "산 풍경", desc: "맑은 공기와 함께하는 등산" },
  { id: 2, src: "/images/main/comment_pic.webp", alt: "Ocean waves", title: "바다", desc: "끝없이 펼쳐진 푸른 파도" },
  { id: 3, src: "/images/main/comment_pic.webp", alt: "Forest path", title: "숲길", desc: "고요한 산책로에서의 휴식" },
  { id: 4, src: "/images/main/comment_pic.webp", alt: "Desert landscape", title: "사막", desc: "끝없는 모래언덕의 풍경" },
  { id: 5, src: "/images/main/comment_pic.webp", alt: "City skyline", title: "도시 전경", desc: "불빛이 가득한 야경" },
  { id: 6, src: "/images/main/comment_pic.webp", alt: "Sunset view", title: "노을", desc: "따뜻한 빛으로 물드는 하늘" },
];

export default function ProgramsGrid() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [origin, setOrigin] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  function handleEnter(index: number) {
    const cell = cellRefs.current[index];
    const container = containerRef.current;
    if (cell && container) {
      const crect = container.getBoundingClientRect();
      const r = cell.getBoundingClientRect();
      const cx = ((r.left + r.width / 2 - crect.left) / crect.width) * 100;
      const cy = ((r.top + r.height / 2 - crect.top) / crect.height) * 100;
      setOrigin({ x: cx, y: cy });
    } else {
      setOrigin({ x: 50, y: 50 });
    }
    setActiveIndex(index);
  }

  function handleLeaveContainer() {
    setActiveIndex(null);
  }

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="relative w-full h-96 md:h-[600px] bg-white rounded-4xl overflow-hidden"
        onMouseLeave={handleLeaveContainer}
      >
        {/* 그리드 */}
        <div className="grid grid-cols-3 grid-rows-2 w-full h-full gap-6">
          {photos.map((p, i) => (
            <div
              key={p.id}
              ref={(el) => {
                cellRefs.current[i] = el;
              }}
              onMouseEnter={() => handleEnter(i)}
              className={`relative cursor-pointer overflow-hidden transition-opacity rounded-4xl shadow-md duration-1000 ${
                activeIndex !== null ? "opacity-30" : "opacity-100"
              }`}
            >
              <Image src={p.src} alt={p.alt} fill className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* 전체 오버레이 */}
        <div
          className={`absolute inset-0 z-50 flex items-end transition-opacity duration-700 ${
            activeIndex !== null ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {activeIndex !== null && (
            <>
              {/* 확대 이미지 */}
              <div
                className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out"
                style={{
                  transformOrigin: `${origin.x}% ${origin.y}%`,
                  transform: "scale(1.08)",
                }}
              >
                <img
                  src={photos[activeIndex].src}
                  alt={photos[activeIndex].alt}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 검은 비네팅 + 텍스트 */}
              <div className="relative w-full h-full flex items-end">
                <div className="w-full p-6 bg-gradient-to-t from-black/70 to-transparent text-white">
                  <h3 className="text-2xl font-bold">{photos[activeIndex].title}</h3>
                  <p className="text-sm mt-2 opacity-90">{photos[activeIndex].desc}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <p className="text-center text-gray-600 mt-6">각 사진에 마우스를 올려보세요!</p>
    </div>
  );
}
