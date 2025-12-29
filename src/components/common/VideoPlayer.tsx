"use client"

import React, { useRef, useState, useEffect } from "react"
import { Volume2, VolumeX, Play, Pause, Maximize } from "lucide-react"

interface VideoPlayerProps {
  src: string
  isMobile?: boolean
}

function VideoPlayer({ src, isMobile = false }: VideoPlayerProps) {
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

  // 컴포넌트 언마운트 시 비디오 클린업
  useEffect(() => {
    const video = videoRef.current
    
    return () => {
      if (video) {
        video.pause()
        video.currentTime = 0
        video.src = ''
        video.load()
      }
    }
  }, [])

  // 모바일용 반응형 스타일
  const iconSize = isMobile ? 24 : 32
  const buttonPadding = isMobile ? "p-2" : "p-3"
  const centerIconPadding = isMobile ? "p-3" : "p-4"
  const buttonPosition = isMobile ? "top-4 left-4" : "top-8 left-6"
  const buttonPositionRight = isMobile ? "top-4 right-4" : "top-8 right-6"

  return (
    <div
      ref={containerRef}
      className="relative w-full cursor-pointer aspect-video"
      onClick={() => !fullscreen && toggleMute()}
      onMouseEnter={() => !fullscreen && setHovered(true)}
      onMouseLeave={() => !fullscreen && setHovered(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover rounded-2xl"
        autoPlay
        loop
        muted={muted}
        playsInline
        controls={fullscreen}
        preload="metadata"
        poster="/images/video-poster.jpg"
      >
        <source src={src} type="video/mp4" />
        브라우저가 지원하지 않는 비디오 플레이어입니다.
      </video>

      {!fullscreen && hovered && (
        <>
          {/* 중앙 뮤트 아이콘 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={`bg-black/50 rounded-full ${centerIconPadding} text-white transition`}>
              {muted ? <VolumeX size={iconSize} /> : <Volume2 size={iconSize} />}
            </div>
          </div>

          {/* 왼쪽 위 재생/일시정지 버튼 */}
          <div className={`absolute ${buttonPosition}`}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                togglePlay()
              }}
              className={`bg-black/50 rounded-full ${buttonPadding} text-white hover:bg-black/70 transition`}
            >
              {paused ? <Play size={isMobile ? 16 : 20} /> : <Pause size={isMobile ? 16 : 20} />}
            </button>
          </div>

          {/* 오른쪽 위 전체화면 버튼 */}
          <div className={`absolute ${buttonPositionRight}`}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleFullscreen()
              }}
              className={`bg-black/50 rounded-full ${buttonPadding} text-white hover:bg-black/70 transition`}
            >
              <Maximize size={isMobile ? 16 : 20} />
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default VideoPlayer