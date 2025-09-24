"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";

const photos = [
  { id: 1, src: "/images/main/program_1.webp", alt: "프로그램 사진 1" },
  { id: 2, src: "/images/main/program_2.webp", alt: "프로그램 사진 2" },
  { id: 3, src: "/images/main/program_3.webp", alt: "프로그램 사진 3" },
  { id: 4, src: "/images/main/program_4.webp", alt: "프로그램 사진 4" },
  { id: 5, src: "/images/main/program_5.webp", alt: "프로그램 사진 5" },
  { id: 6, src: "/images/main/program_6.webp", alt: "프로그램 사진 6" },
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

  function handleTouchStart(index: number) {
    // 터치 시작 시에는 아무것도 하지 않음
  }

  function handleTouch(index: number) {
    // 이미 활성화된 항목을 터치하면 비활성화, 아니면 활성화
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      handleEnter(index);
    }
  }

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
  }

  function handleDragStart(e: React.DragEvent) {
    e.preventDefault();
  }

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="relative w-full h-96 md:h-[600px] bg-white rounded-4xl overflow-hidden select-none"
        onMouseLeave={handleLeaveContainer}
        onContextMenu={handleContextMenu}
        style={{
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          KhtmlUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          userSelect: 'none'
        }}
      >
        {/* 그리드 - 모바일: 2*3, 데스크탑: 3*2 */}
        <div className="grid grid-cols-2 grid-rows-3 md:grid-cols-3 md:grid-rows-2 w-full h-full gap-3 md:gap-6 p-3 md:p-0">
          {photos.map((p, i) => (
            <div
              key={p.id}
              ref={(el) => {
                cellRefs.current[i] = el;
              }}
              onMouseEnter={() => handleEnter(i)}
              onClick={() => handleTouch(i)}
              onContextMenu={handleContextMenu}
              onDragStart={handleDragStart}
              className={`w-full h-full relative cursor-pointer overflow-hidden transition-opacity rounded-2xl md:rounded-4xl shadow-md duration-1000 select-none ${activeIndex !== null ? "opacity-30" : "opacity-100"
                }`}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                className=" object-cover pointer-events-none"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* 전체 오버레이 */}
        <div
          className={`absolute inset-0 z-50 flex items-end transition-opacity duration-700 ${activeIndex !== null ? "opacity-100" : "opacity-0 pointer-events-none"
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
                <div className="w-full h-full">
                  <Image
                    fill
                    src={photos[activeIndex].src}
                    alt={photos[activeIndex].alt}
                    className="object-cover select-none pointer-events-none"
                    draggable={false}
                    onContextMenu={handleContextMenu}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <p className="text-center text-gray-600 mt-4 md:mt-6 text-sm md:text-base">
        <span className="md:hidden">각 사진을 터치해보세요!</span>
        <span className="hidden md:inline">각 사진에 마우스를 올려보세요!</span>
      </p>
    </div>
  );
}