"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

const groups = [
  { id: 1, label: "자조 모임" },
  { id: 2, label: "일반 시민(가족)" },
  { id: 3, label: "자원봉사자" },
  { id: 4, label: "한부모가족" },
  { id: 5, label: "후원/협력기관" },
]

// 고정된 파티클 위치 (hydration 오류 방지)
const particlePositions = [
  { left: 23, top: 15 },
  { left: 67, top: 45 },
  { left: 12, top: 78 },
  { left: 85, top: 23 },
  { left: 45, top: 89 },
  { left: 78, top: 67 },
  { left: 34, top: 12 },
  { left: 9, top: 56 },
  { left: 56, top: 34 },
  { left: 89, top: 78 },
  { left: 15, top: 45 },
  { left: 73, top: 12 },
  { left: 41, top: 67 },
  { left: 87, top: 45 },
  { left: 29, top: 89 }
]

export default function NetworkPentagon() {
  const [selectedNode, setSelectedNode] = useState<number | null>(null)
  const [hoveredNode, setHoveredNode] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // 클라이언트에서만 화면 크기 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // 반응형 크기 설정
  const size = isMobile ? 400 : 600
  const radius = isMobile ? 140 : 200
  const containerExtra = isMobile ? 80 : 100
  const containerLeft = isMobile ? 40 : 50

  return (
    <div className="w-full flex items-center justify-center p-4 md:p-8 mt-20">
      <div 
        className="relative"
        style={{ 
          width: size + containerExtra, 
          height: size + containerExtra,
        }}
      >
        {/* 배경 파티클 효과 */}
        <div className="absolute inset-0">
          {particlePositions.map((position, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-white rounded-full"
              style={{
                left: position.left + "%",
                top: position.top + "%",
              }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0.3, 1.2, 0.3],
              }}
              transition={{
                duration: 4 + (i % 3),
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <div className="relative" style={{ width: size, height: size, left: containerLeft, top: containerLeft }}>
          {/* 연결선 */}
          <svg
            className="absolute top-0 left-0 w-full h-full"
            viewBox={`0 0 ${size} ${size}`}
          >
            {groups.map((_, i) =>
              groups.map((__, j) => {
                if (i >= j) return null
                const angle1 = (i / groups.length) * (2 * Math.PI) - Math.PI / 2
                const angle2 = (j / groups.length) * (2 * Math.PI) - Math.PI / 2
                const baseX1 = size / 2 + radius * Math.cos(angle1)
                const baseY1 = size / 2 + radius * Math.sin(angle1)
                const baseX2 = size / 2 + radius * Math.cos(angle2)
                const baseY2 = size / 2 + radius * Math.sin(angle2)

                const isHighlighted = 
                  (hoveredNode !== null && (hoveredNode === i || hoveredNode === j)) ||
                  (selectedNode !== null && (selectedNode === i || selectedNode === j))

                return (
                  <motion.line
                    key={`${i}-${j}`}
                    x1={baseX1}
                    y1={baseY1}
                    x2={baseX2}
                    y2={baseY2}
                    stroke="#ffffff"
                    strokeWidth={isHighlighted ? (isMobile ? "3" : "4") : (isMobile ? "1.5" : "2")}
                    animate={{ 
                      strokeOpacity: isHighlighted ? 0.9 : 0.4,
                      filter: isHighlighted ? "drop-shadow(0 0 8px rgba(255,255,255,0.8))" : "none"
                    }}
                    transition={{ duration: 0.3 }}
                  />
                )
              })
            )}
          </svg>

          {/* 노드들 */}
          {groups.map((g, i) => {
            const angle = (i / groups.length) * (2 * Math.PI) - Math.PI / 2
            const baseX = size / 2 + radius * Math.cos(angle)
            const baseY = size / 2 + radius * Math.sin(angle)

            const isSelected = selectedNode === i
            const isHovered = hoveredNode === i

            // 반응형 박스 크기
            const boxWidth = isMobile ? 200 : 300
            const boxLeft = isMobile ? 100 : 150
            const boxTop = isMobile ? 30 : 40

            return (
              <motion.div
                key={g.id}
                className="absolute cursor-pointer select-none"
                style={{
                  left: baseX - boxLeft,
                  top: baseY - boxTop,
                  width: boxWidth,
                  textAlign: "center",
                }}
                onMouseEnter={() => setHoveredNode(i)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setSelectedNode(selectedNode === i ? null : i)}
                animate={{
                  x: [0, isMobile ? 3 : 5, isMobile ? -2 : -3, isMobile ? 5 : 8, isMobile ? -3 : -5, isMobile ? 2 : 4, 0],
                  y: [0, isMobile ? -3 : -4, isMobile ? 4 : 6, isMobile ? -2 : -3, isMobile ? 3 : 5, isMobile ? -4 : -6, 0],
                  scale: isSelected ? 1.15 : isHovered ? 1.1 : 1,
                }}
                transition={{ 
                  x: { 
                    duration: 12 + i * 1.5, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    times: [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1]
                  },
                  y: { 
                    duration: 10 + i * 1.2, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    times: [0, 0.2, 0.35, 0.55, 0.75, 0.9, 1]
                  },
                  scale: { 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 20 
                  }
                }}
              >
                {/* 텍스트 */}
                <motion.div
                  className="relative z-10 text-white font-bold text-2xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl py-2 md:py-4 whitespace-nowrap"
                  style={{
                    textShadow: isSelected || isHovered 
                      ? (isMobile ? "0px 0px 12px rgba(255,255,255,0.9), 0px 0px 25px rgba(255,255,255,0.4)" : "0px 0px 20px rgba(255,255,255,0.9), 0px 0px 40px rgba(255,255,255,0.5)")
                      : (isMobile ? "0px 0px 6px rgba(255,255,255,0.6)" : "0px 0px 10px rgba(255,255,255,0.6)"),
                  }}
                  animate={{
                    textShadow: isSelected || isHovered 
                      ? (isMobile ? "0px 0px 12px rgba(255,255,255,0.9), 0px 0px 25px rgba(255,255,255,0.4)" : "0px 0px 20px rgba(255,255,255,0.9), 0px 0px 40px rgba(255,255,255,0.5)")
                      : (isMobile ? "0px 0px 6px rgba(255,255,255,0.6)" : "0px 0px 10px rgba(255,255,255,0.6)"),
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {g.label}
                </motion.div>

                {/* 선택된 노드 미세한 글로우 효과 */}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{
                      background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                    }}
                  />
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}