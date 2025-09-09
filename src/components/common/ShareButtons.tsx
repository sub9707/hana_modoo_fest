'use client'

import { useState } from 'react'
import { Share2, Link, MessageCircle, Mail, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface ShareButtonsProps {
  url?: string
  title?: string
  description?: string
  className?: string
}

export default function ShareButtons({ 
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = '모두하나대축제 2025',
  description = '서울시 대표 가족축제에 함께하세요',
  className = ''
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('링크 복사 실패:', err)
    }
  }

  const handleKakaoShare = () => {
    const kakaoUrl = `https://story.kakao.com/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    window.open(kakaoUrl, '_blank', 'width=600,height=600')
  }

  const handleEmailShare = () => {
    const subject = encodeURIComponent(title)
    const body = encodeURIComponent(`${description}\n\n${url}`)
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        className="space-x-2"
      >
        {copied ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />}
        <span>{copied ? '복사됨!' : '링크 복사'}</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleKakaoShare}
        className="space-x-2"
      >
        <MessageCircle className="w-4 h-4" />
        <span>카카오톡</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleEmailShare}
        className="space-x-2"
      >
        <Mail className="w-4 h-4" />
        <span>이메일</span>
      </Button>
    </div>
  )
}