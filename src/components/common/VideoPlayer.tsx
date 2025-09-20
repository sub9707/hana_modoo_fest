"use client"

import React, { useRef, useState, useEffect } from "react"
import { Volume2, VolumeX, Play, Pause, Maximize } from "lucide-react"

function VideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [muted, setMuted] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [paused, setPaused] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted
      setMuted(!muted)
    }
  }

  const togglePlay = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
      setPaused(false)
    } else {
      videoRef.current.pause()
      setPaused(true)
    }
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  useEffect(() => {
    const handler = () => {
      setFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handler)
    return () => {
      document.removeEventListener("fullscreenchange", handler)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-pointer"
      onClick={() => !fullscreen && toggleMute()} // 전체화면 아닐 때만 클릭 뮤트
      onMouseEnter={() => !fullscreen && setHovered(true)}
      onMouseLeave={() => !fullscreen && setHovered(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full aspect-auto rounded-2xl"
        autoPlay
        loop
        muted={muted}
        playsInline
        controls={fullscreen} // 전체화면이면 브라우저 컨트롤 사용
      >
        <source src={src} type="video/mp4" />
        브라우저가 지원하지 않는 비디오 플레이어입니다.
      </video>

      {/* 전체화면 아닐 때만 커스텀 UI */}
      {!fullscreen && hovered && (
        <>
          {/* 중앙 뮤트 아이콘 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 rounded-full p-4 text-white transition">
              {muted ? <VolumeX size={32} /> : <Volume2 size={32} />}
            </div>
          </div>

          {/* 왼쪽 위 재생/일시정지 */}
          <div className="absolute top-8 left-6">
            <button
              onClick={(e) => {
                e.stopPropagation()
                togglePlay()
              }}
              className="bg-black/50 rounded-full p-3 text-white hover:bg-black/70 transition"
            >
              {paused ? <Play size={24} /> : <Pause size={24} />}
            </button>
          </div>

          {/* 오른쪽 위 전체화면 버튼 */}
          <div className="absolute top-8 right-6">
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleFullscreen()
              }}
              className="bg-black/50 rounded-full p-3 text-white hover:bg-black/70 transition"
            >
              <Maximize size={24} />
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default VideoPlayer
